'use client';
import returnFetch from 'return-fetch';

const URL_PROD = process.env.NEXT_PUBLIC_API_PROD_URL;
const URL_TEST = process.env.NEXT_PUBLIC_API_TEST_URL;
const deployMode = process.env.NEXT_PUBLIC_NODE_ENV;
const baseUrl = deployMode === 'production' ? URL_PROD : URL_TEST;

/**
 * localStorage에서 값 가져오기 (안전한 접근)
 */
const getFromStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

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

export const fetchDefault = returnFetch({
  baseUrl: baseUrl,
  interceptors: {
    request: async (args) => {
      if (args[1]) {
        const accessToken = getTokenFromCookie('access-token');
        const parkingLotId = getFromStorage('selected-parkinglot-id');
        
        args[1].headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken || ''}`,
          ...(parkingLotId && { 'x-parkinglot-id': parkingLotId }),
        };
      }
      return args;
    },
    response: async (response) => { 
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
        const parkingLotId = getFromStorage('selected-parkinglot-id');
        
        args[1].headers = {
          ...args[1].headers,
          Authorization: `Bearer ${accessToken || ''}`,
          ...(parkingLotId && { 'x-parkinglot-id': parkingLotId }),
        };
      }
      return args;
    },
    response: async (response) => {
      return response;
    },
  },
});
