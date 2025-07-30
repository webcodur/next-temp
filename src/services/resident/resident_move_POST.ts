'use client';
import { fetchDefault } from '@/services/fetchClient';

export interface MoveResidentRequest {
  residentId: number;
  targetHouseholdInstanceId: number;
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
  deletedAt?: Date | null;
  householdInstance: {
    id: number;
    householdId: number;
    instanceName?: string;
    password?: string;
    startDate?: Date;
    endDate?: Date;
    memo?: string;
    createdAt: Date;
    updatedAt: Date;
    household: {
      id: number;
      parkinglotId: number;
      address1Depth: string;
      address2Depth: string;
      address3Depth?: string;
      householdType: string;
      memo?: string;
      createdAt: Date;
      updatedAt: Date;
      parkinglot: {
        id: number;
        code: string;
        name: string;
        description?: string;
        createdAt: Date;
        updatedAt: Date;
      };
    };
  };
}

/**
 * 같은 현장 내에서 거주자를 다른 세대로 이동시킨다 (이력 보존)
 * @param data 거주자 이동 정보
 * @returns 거주자-세대 관계 정보 (ResidentHouseholdResponse)
 */
export async function moveResident(data: MoveResidentRequest) {
  const response = await fetchDefault('/residents/move', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `거주자 세대 이동 실패 (코드): ${response.status}`;
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