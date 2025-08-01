'use client';
import { fetchDefault } from '@/services/fetchClient';

//#region 서버 타입 정의 (파일 내부 사용)
interface DeleteConfigServerResponse {
  message?: string;
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function serverToClient(server: DeleteConfigServerResponse) {
  return {
    message: server.message,
  };
}
//#endregion

/**
 * 지정된 키의 시스템 설정을 삭제한다
 * @param key 삭제할 설정 키
 * @returns 삭제 성공 여부
 */
export async function deleteConfig(key: string) {
  const response = await fetchDefault(`/configs/${key}`, {
    method: 'DELETE',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `설정값 삭제 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }

  const serverResponse = result as DeleteConfigServerResponse;
  const clientData = serverToClient(serverResponse);
  
  return {
    success: true,
    data: clientData,
  };
} 