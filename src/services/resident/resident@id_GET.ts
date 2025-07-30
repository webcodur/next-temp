'use client';
import { fetchDefault } from '@/services/fetchClient';

export interface ResidentDetailResponse {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  birthDate?: Date;
  gender?: string;
  emergencyContact?: string;
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
  residentHouseholds: {
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
  }[];
}

/**
 * 특정 거주자의 상세 정보를 조회한다
 * @param id 거주자 ID
 * @returns 거주자 상세 정보 (ResidentDetailResponse)
 */
export async function getResidentDetail(id: number) {
  const response = await fetchDefault(`/residents/${id}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `거주자 상세 조회 실패 (코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  return {
    success: true,
    data: result as ResidentDetailResponse,
  };
} 