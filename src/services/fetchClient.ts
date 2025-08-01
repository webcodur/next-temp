'use client';
import returnFetch from 'return-fetch';
import { camelToSnake, snakeToCamel } from '@/utils/caseConverter';
import { getParkinglotIdFromToken, getRoleIdFromToken } from '@/utils/tokenUtils';

const URL_PROD = process.env.NEXT_PUBLIC_API_PROD_URL;
const URL_TEST = process.env.NEXT_PUBLIC_API_TEST_URL;
const deployMode = process.env.NEXT_PUBLIC_NODE_ENV;
const baseUrl = deployMode === 'production' ? URL_PROD : URL_TEST;

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

/**
 * JSON 여부 확인
 */
const isJsonContent = (contentType: string | null): boolean => {
  return contentType?.includes('application/json') ?? false;
};

/**
 * 요청 body가 JSON 문자열인지 확인
 */
const isJsonString = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

/**
 * URL의 쿼리 파라미터를 camelCase → snake_case로 변환
 */
const convertUrlQueryParams = (url: string): string => {
  try {
    const urlObj = new URL(url, baseUrl);
    const convertedParams = new URLSearchParams();
    
    urlObj.searchParams.forEach((value, key) => {
      const snakeKey = camelToSnake(key);
      convertedParams.append(snakeKey, value);
    });
    
    // 쿼리 파라미터가 있는 경우에만 재구성
    if (convertedParams.toString()) {
      return `${urlObj.pathname}?${convertedParams.toString()}`;
    }
    
    return urlObj.pathname;
  } catch {
    // URL 파싱 실패시 원본 반환
    return url;
  }
};

export const fetchDefault = returnFetch({
  baseUrl: baseUrl,
  interceptors: {
    request: async (args) => {
      if (args[1]) {
        const accessToken = getTokenFromCookie('access-token');
        const parkingLotId = getEffectiveParkingLotId();
        
        // 🔄 URL 쿼리 파라미터 자동 변환 (camelCase → snake_case)
        if (typeof args[0] === 'string') {
          args[0] = convertUrlQueryParams(args[0]);
        }
        
        // 헤더 설정
        args[1].headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken || ''}`,
          ...(parkingLotId && { 'x-parkinglot-id': parkingLotId.toString() }),
          ...args[1].headers, // 기존 헤더 보존
        };

        // 🔄 요청 body가 JSON이면 camelCase → snake_case 변환
        if (args[1].body && typeof args[1].body === 'string') {
          const headers = args[1].headers as Record<string, string> | undefined;
          const contentType = (headers?.['Content-Type'] || headers?.['content-type']) ?? null;
          if (isJsonContent(contentType) && isJsonString(args[1].body)) {
            try {
              const parsedBody = JSON.parse(args[1].body);
              const convertedBody = camelToSnake(parsedBody);
              args[1].body = JSON.stringify(convertedBody);
            } catch (error) {
              console.warn('Request body conversion failed:', error);
            }
          }
        }
      }
      return args;
    },
    response: async (response) => {
      // 🔄 JSON 응답이면 snake_case → camelCase 변환
      const contentType = response.headers.get('content-type');
      if (isJsonContent(contentType) && response.ok) {
        try {
          // 원본 response는 한 번만 읽을 수 있으므로 clone 사용
          const clonedResponse = response.clone();
          const jsonData = await clonedResponse.json();
          const convertedData = snakeToCamel(jsonData);
          
          // 새로운 Response 객체 생성 (변환된 데이터로)
          return new Response(JSON.stringify(convertedData), {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
          });
        } catch (error) {
          console.warn('Response conversion failed:', error);
          return response; // 변환 실패시 원본 반환
        }
      }
      
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