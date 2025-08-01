'use client';
import { fetchDefault } from '@/services/fetchClient';

//#region 서버 타입 정의 (파일 내부 사용)
interface ResidentHistoryServerResponse {
  // 정확한 스키마는 API 스펙에 따라 달라질 수 있음
  data: unknown[];
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function serverToClient(server: ResidentHistoryServerResponse): ResidentHistoryResponse {
  return {
    data: server.data,
  };
}
//#endregion

export interface ResidentHistoryResponse {
  // 정확한 스키마는 API 스펙에 따라 달라질 수 있음
  data: unknown[];
}

/**
 * 거주자의 세대 이동 이력을 시간순으로 조회한다
 * @param id 거주자 ID
 * @returns 거주자 이동 이력 정보 (ResidentHistoryResponse)
 */
export async function getResidentHistory(id: number) {
  const response = await fetchDefault(`/residents/${id}/history`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `거주자 이동 이력 조회 실패 (코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  const serverResponse = result as ResidentHistoryServerResponse;
  const clientData = serverToClient(serverResponse);
  
  return {
    success: true,
    data: clientData,
  };
} 