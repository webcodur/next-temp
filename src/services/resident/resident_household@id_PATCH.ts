'use client';
import { fetchDefault } from '@/services/fetchClient';

export interface UpdateResidentHouseholdRequest {
  relationship?: 'HEAD' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'OTHER';
  memo?: string;
}

export interface ResidentHouseholdResponse {
  id: number;
  residentId: number;
  householdInstanceId: number;
  relationship: string;
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 거주자와 세대 간의 관계를 수정한다
 * @param id 관계 ID
 * @param data 수정할 거주자-세대 관계 정보
 * @returns 거주자-세대 관계 정보 (ResidentHouseholdResponse)
 */
export async function updateResidentHousehold(id: number, data: UpdateResidentHouseholdRequest) {
  const response = await fetchDefault(`/residents/households/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `거주자-세대 관계 수정 실패 (코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  return {
    success: true,
    data: result as ResidentHouseholdResponse,
  };
} 