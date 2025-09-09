/**
 * 네이버 클라우드 플랫폼 Maps Geocoding API 프록시 라우트
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: '검색어가 제공되지 않았습니다' },
        { status: 400 }
      );
    }

    const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: '서버 설정 오류' },
        { status: 500 }
      );
    }

    // 네이버 클라우드 플랫폼 Maps Geocoding API 호출
    const geocodeUrl = `https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(query)}`;
    
    const response = await fetch(geocodeUrl, {
      method: 'GET',
      headers: {
        'x-ncp-apigw-api-key-id': clientId,
        'x-ncp-apigw-api-key': clientSecret,
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
    
    // 응답 데이터 형식 변환
    if (data.status === 'OK' && data.addresses && data.addresses.length > 0) {
      const addresses = data.addresses.map((addr: {
        roadAddress?: string;
        jibunAddress: string;
        englishAddress?: string;
        x: string;
        y: string;
        addressElements?: unknown;
      }) => ({
        address: addr.roadAddress || addr.jibunAddress,
        roadAddress: addr.roadAddress,
        jibunAddress: addr.jibunAddress,
        englishAddress: addr.englishAddress,
        x: parseFloat(addr.x), // 경도
        y: parseFloat(addr.y), // 위도
        addressElements: addr.addressElements
      }));
      
      return NextResponse.json({ 
        addresses,
        totalCount: data.meta?.totalCount || addresses.length 
      });
    }

    // 검색 결과가 없는 경우
    return NextResponse.json({ 
      addresses: [],
      totalCount: 0 
    });
    
  } catch {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}