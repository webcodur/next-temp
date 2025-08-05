'use client';
import returnFetch from 'return-fetch';
import { getParkinglotIdFromToken, getRoleIdFromToken } from '@/utils/tokenUtils';

const URL_PROD = process.env.NEXT_PUBLIC_API_PROD_URL;
const URL_TEST = process.env.NEXT_PUBLIC_API_TEST_URL;
const deployMode = process.env.NEXT_PUBLIC_NODE_ENV;
const baseUrl = deployMode === 'production' ? URL_PROD : URL_TEST;

console.log('🌐 API 설정:', {
  deployMode,
  URL_PROD,
  URL_TEST,
  baseUrl
});

/**
 * 쿠키에서 토큰 가져오기
 */
const getTokenFromCookie = (tokenName: string): string | null => {
  if (typeof document === 'undefined') return null;
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${tokenName}=`))
    ?.split('=')[1] || null;
};

/**
 * 로컬스토리지에서 수동 선택된 주차장 ID 가져오기 (최고관리자용)
 */
const getManualParkingLotId = (): number | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('manual-parking-lot-id');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

/**
 * 효과적인 주차장 ID 계산 (토큰 + 수동선택 조합)
 * - 최고관리자(roleId: 1, parkinglot: 0)인 경우: 수동 선택된 주차장 ID 사용
 * - 일반 사용자인 경우: 토큰의 주차장 ID 사용
 */
const getEffectiveParkingLotId = (): number | null => {
  const tokenParkingLotId = getParkinglotIdFromToken();
  const roleId = getRoleIdFromToken();
  
  // 최고관리자(roleId: 1)이고 토큰 주차장 ID가 0인 경우
  if (roleId === 1 && tokenParkingLotId === 0) {
    const manualId = getManualParkingLotId();
    return manualId;
  }
  
  // 일반 사용자는 토큰 기반
  return tokenParkingLotId;
};





export const fetchDefault = returnFetch({
  baseUrl: baseUrl,
  interceptors: {
    request: async (args) => {
      if (args[1]) {
        const accessToken = getTokenFromCookie('access-token');
        const parkingLotId = getEffectiveParkingLotId();
        
        console.log('📤 API 요청:', {
          url: args[0],
          method: args[1].method,
          baseUrl,
          hasToken: !!accessToken,
          parkingLotId
        });

        
        // 헤더 설정
        args[1].headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken || ''}`,
          ...(parkingLotId && { 'x-parkinglot-id': parkingLotId.toString() }),
          ...args[1].headers, // 기존 헤더 보존
        };


      }
      return args;
    },
    response: async (response) => {
      console.log('📥 API 응답:', {
        url: response.url,
        status: response.status,
        statusText: response.statusText
      });
      return response;
    },
  },
});

export const fetchForm = returnFetch({
  baseUrl: baseUrl,
  interceptors: {
    request: async (args) => {
      if (args[1]) {
        const accessToken = getTokenFromCookie('access-token');
        const parkingLotId = getEffectiveParkingLotId();
        
        args[1].headers = {
          ...args[1].headers,
          Authorization: `Bearer ${accessToken || ''}`,
          ...(parkingLotId && { 'x-parkinglot-id': parkingLotId.toString() }),
        };
      }
      return args;
    },
    response: async (response) => {
      return response;
    },
  },
});