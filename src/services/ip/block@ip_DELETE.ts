'use client';
import { fetchDefault } from '@/services/fetchClient';

//#region 서버 타입 정의 (파일 내부 사용)
interface DeleteBlockedIpServerResponse {
  message?: string;
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function serverToClient(server: DeleteBlockedIpServerResponse) {
  return {
    message: server.message,
  };
}
//#endregion

/**
 * 지정된 IP 주소의 차단을 해제한다
 * @param ip 차단 해제할 IP 주소
 * @returns 특정 IP 차단 해제 결과
 */
export async function deleteBlockedIp(ip: string) {
  const response = await fetchDefault(`/ip/block/${ip}`, {
    method: 'DELETE',
  });

  // 204 No Content 응답의 경우 JSON 파싱하지 않음
  if (response.status === 204) {
    return {
      success: true,
      data: { message: '해당 IP 차단이 성공적으로 해제되었습니다.' },
    };
  }

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `특정 IP 차단 해제 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }

  const serverResponse = result as DeleteBlockedIpServerResponse;
  const clientData = serverToClient(serverResponse);
  
  return {
    success: true,
    data: clientData,
  };
} 