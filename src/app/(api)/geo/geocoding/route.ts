/**
 * 네이버 Geocoding API 프록시 라우트
 * 
 * NCP Application Service > Maps API 사용
 * 
 * ⚠️ 주의사항:
 * - AI·NAVER API > Maps는 사용하지 않음 (무료 할당량 없음, 구독 필요)
 * - Application Service > Maps를 사용해야 함 (무료 할당량 제공)
 * 
 * NCP Maps API 엔드포인트:
 * - Static Map: https://maps.apigw.ntruss.com/map-static/v2
 * - Directions 5: https://maps.apigw.ntruss.com/map-direction/v1
 * - Directions 15: https://maps.apigw.ntruss.com/map-direction-15/v1
 * - Geocoding: https://maps.apigw.ntruss.com/map-geocode/v2
 * - Reverse Geocoding: https://maps.apigw.ntruss.com/map-reversegeocode/v2
 * 
 * 참고: https://api.ncloud-docs.com/docs/ko/application-maps-overview
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();
    
    if (!address) {
      return NextResponse.json(
        { error: '주소가 제공되지 않았습니다' },
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

    // NCP Application Service > Maps > Geocoding API 호출
    // ⚠️ AI·NAVER API 엔드포인트 사용 금지: https://naveropenapi.apigw.ntruss.com (X)
    // ✅ Application Service 엔드포인트 사용: https://maps.apigw.ntruss.com (O)
    const geocodeUrl = `https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(address)}`;
    
    const response = await fetch(geocodeUrl, {
      headers: {
        // NCP Application Service > Maps 인증 헤더
        'X-NCP-APIGW-API-KEY-ID': clientId,
        'X-NCP-APIGW-API-KEY': clientSecret,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Geocoding 실패', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // 네이버 API 응답에서 좌표 추출
    if (data.addresses && data.addresses.length > 0) {
      const { x, y } = data.addresses[0];
      const coordinates = {
        longitude: parseFloat(x),
        latitude: parseFloat(y),
      };
      
      return NextResponse.json({ coordinates });
    }

    return NextResponse.json(
      { error: '주소를 찾을 수 없습니다' },
      { status: 404 }
    );
    
  } catch {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
