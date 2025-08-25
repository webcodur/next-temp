'use client';

import { fetchDefault } from '@/services/fetchClient';
import { ApiMessageResponse } from '@/types/auth';
import { getApiErrorMessage, getNetworkErrorMessage} from '@/utils/apiErrorMessages';

//#region 서버 타입 정의 (파일 내부 사용)
interface ApiMessageServerResponse {
  message?: string; // 이미 snake_case가 아니므로 변환 불필요
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function serverToClient(server: ApiMessageServerResponse): ApiMessageResponse {
  return { message: server.message };
}
//#endregion

/**
 * 로그아웃 클라이언트 함수
 */
export async function logout() {
  try {
    const response = await fetchDefault('/auth/logout', {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        errorMsg: await getApiErrorMessage(errorData, response.status),
      };
    }

    const serverResponse = await response.json() as ApiMessageServerResponse;
    const clientData = serverToClient(serverResponse);
    return {
      success: true,
      data: clientData,
    };
  } catch {
    return {
      success: false,
      errorMsg: getNetworkErrorMessage(),
    };
  }
} 