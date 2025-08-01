'use client';

import { fetchDefault } from '@/services/fetchClient';
import { TokenResponse } from '@/types/auth';

//#region 서버 타입 정의 (파일 내부 사용)
interface TokenServerResponse {
  access_token: string;      // snake_case
  refresh_token: string;     // snake_case
  role_id?: number;          // snake_case
  parking_lot_id?: number;   // snake_case
  parkinglots?: { 
    id: number; 
    code: string; 
    name: string; 
    description: string 
  }[];
}

interface LoginServerRequest {
  account: string;
  password: string;
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function serverToClient(server: TokenServerResponse): TokenResponse {
  return {
    accessToken: server.access_token,
    refreshToken: server.refresh_token,
    roleId: server.role_id,
    parkingLotId: server.parking_lot_id,
    parkinglots: server.parkinglots,
  };
}

function clientToServer(account: string, password: string): LoginServerRequest {
  return {
    account,
    password,
  };
}
//#endregion

/**
 * 로그인 클라이언트 함수
 */
export async function signInWithCredentials(account: string, password: string) {
  try {
    const serverRequest = clientToServer(account, password);
    const response = await fetchDefault('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(serverRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        errorMsg: errorData.message || '로그인 실패',
      };
    }

    const serverResponse = await response.json() as TokenServerResponse;
    const clientData = serverToClient(serverResponse);
    return {
      success: true,
      data: clientData,
    };
  } catch {
    return {
      success: false,
      errorMsg: '네트워크 오류',
    };
  }
} 