'use client';
import { fetchDefault } from '@/services/fetchClient';

//#region 서버 타입 정의 (파일 내부 사용)
interface DeleteResponseServerMessage {
  message: string;
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function serverToClient(server?: DeleteResponseServerMessage) {
  return {
    message: server?.message || '거주자-세대 관계가 성공적으로 삭제되었습니다.',
  };
}
//#endregion

/**
 * 거주자와 세대 간의 관계를 삭제한다
 * @param id 관계 ID
 * @returns 성공/실패 정보
 */
export async function deleteResidentHousehold(id: number) {
  const response = await fetchDefault(`/residents/households/${id}`, {
    method: 'DELETE',
  });

  // HTTP 204 No Content - 성공적인 삭제
  if (response.status === 204) {
    const clientData = serverToClient();
    return {
      success: true,
      data: clientData,
    };
  }

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `거주자-세대 관계 삭제 실패 (코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  const serverResponse = result as DeleteResponseServerMessage;
  const clientData = serverToClient(serverResponse);
  
  return {
    success: true,
    data: clientData,
  };
} 