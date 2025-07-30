'use client';
import { fetchDefault } from '@/services/fetchClient';

export interface CreateResidentHouseholdRequest {
  residentId: number;
  householdInstanceId: number;
  relationship: 'HEAD' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'OTHER';
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
 * 거주자와 세대 간의 관계를 생성한다
 * @param data 거주자-세대 관계 정보
 * @returns 거주자-세대 관계 정보 (ResidentHouseholdResponse)
 */
export async function createResidentHousehold(data: CreateResidentHouseholdRequest) {
  const response = await fetchDefault('/residents/households', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `거주자-세대 관계 생성 실패 (코드): ${response.status}`;
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