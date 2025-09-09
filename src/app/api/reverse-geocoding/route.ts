/**
 * 네이버 Reverse Geocoding API 프록시 라우트
 * 
 * NCP Application Service > Maps API 사용
 * 좌표를 주소로 변환
 * 
 * ⚠️ AI·NAVER API는 사용하지 않음
 * ✅ Application Service > Maps 사용
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude } = await request.json();
    
    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: '좌표가 제공되지 않았습니다' },
        { status: 400 }
      );
    }

    const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: '서버 설정 오류', details: 'NAVER API 키가 설정되지 않았습니다' },
        { status: 500 }
      );
    }

    // NCP Application Service > Maps > Reverse Geocoding API 호출
    // ⚠️ AI·NAVER API 엔드포인트 사용 금지: https://naveropenapi.apigw.ntruss.com (X)
    // ✅ Application Service 엔드포인트 사용: https://maps.apigw.ntruss.com (O)
    const coords = `${longitude},${latitude}`;
    const reverseGeocodeUrl = `https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${coords}&output=json&orders=roadaddr,addr`;
    
    const response = await fetch(reverseGeocodeUrl, {
      headers: {
        // NCP Application Service > Maps 인증 헤더
        'X-NCP-APIGW-API-KEY-ID': clientId,
        'X-NCP-APIGW-API-KEY': clientSecret,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Reverse Geocoding 실패', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // 네이버 API 응답에서 주소 추출
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const region = result.region || {};
      const land = result.land || {};
      
      const address = {
        fullAddress: result.name || '',
        roadAddress: land.type === 'roadaddr' ? result.name : '',
        jibunAddress: land.type === 'parceladdr' ? result.name : '',
        si: region.area1?.name || '',
        gu: region.area2?.name || '',
        dong: region.area3?.name || '',
        detail: land.name || ''
      };
      
      return NextResponse.json({ address });
    }

    return NextResponse.json(
      { error: '주소를 찾을 수 없습니다' },
      { status: 404 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}