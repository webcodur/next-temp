'use client';
// import { fetchDefault } from '@/services/fetchClient';

//#region 서버 타입 정의 (파일 내부 사용)
interface ResetPasswordServerResponse {
  message?: string;
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function serverToClient(server: ResetPasswordServerResponse) {
  return {
    message: server.message,
  };
}
//#endregion

interface ResetAdminPasswordRequest {
  id: number;
}

interface ResetAdminPasswordResponse {
  success: boolean;
  data?: unknown;
  errorMsg?: string;
}

/**
 * 관리자 비밀번호 초기화 API
 * PUT /admin/{id}/password/reset
 */
export async function resetAdminPassword(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _params: ResetAdminPasswordRequest
): Promise<ResetAdminPasswordResponse> {
  // TODO: 실존하지 않는 API - 임시 구현
  console.warn('resetAdminPassword API is not implemented on server');
  return {
    success: false,
    errorMsg: '비밀번호 초기화 기능은 현재 사용할 수 없습니다.',
  };

  // 실제 API 호출 코드 (주석 처리)
  // try {
  //   const response = await fetchDefault(`/admin/${params.id}/password/reset`, {
  //     method: 'PUT',
  //   });
  //   const result = await response.json();
  //   
  //   if (!response.ok) {
  //     return {
  //       success: false,
  //       errorMsg: result.message || '비밀번호 초기화 실패',
  //     };
  //   }
  //   
  //   const serverResponse = result as ResetPasswordServerResponse;
  //   const clientData = serverToClient(serverResponse);
  //   
  //   return {
  //     success: true,
  //     data: clientData,
  //   };
  // } catch (error) {
  //   console.error('관리자 비밀번호 초기화 API 호출 실패:', error);
  //   return {
  //     success: false,
  //     errorMsg: '비밀번호 초기화 중 오류가 발생했습니다.',
  //   };
  // }
}
