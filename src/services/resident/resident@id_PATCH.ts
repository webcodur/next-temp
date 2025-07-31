'use client';
import { fetchDefault } from '@/services/fetchClient';
import type { UpdateResidentRequest, Resident } from '@/types/api';

export interface ResidentResponse extends Resident {}

/**
 * 특정 거주자의 정보를 수정한다
 * @param id 거주자 ID
 * @param data 수정할 거주자 정보
 * @returns 거주자 정보 (ResidentResponse)
 */
export async function updateResident(id: number, data: UpdateResidentRequest) {
  const response = await fetchDefault(`/residents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `거주자 수정 실패 (코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  return {
    success: true,
    data: result as ResidentResponse,
  };
} 