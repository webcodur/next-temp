'use client';
import { fetchDefault } from '@/services/fetchClient';

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
  
  return {
    success: true,
    data: result as ResidentHistoryResponse,
  };
} 