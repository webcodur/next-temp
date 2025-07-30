'use client';
import { fetchDefault } from '@/services/fetchClient';

export interface CreateResidentRequest {
  name: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  gender?: 'M' | 'F';
  emergencyContact?: string;
  memo?: string;
}

export interface ResidentResponse {
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
  deletedAt?: Date | null;
}

/**
 * 새로운 거주자를 생성한다
 * @param data 거주자 정보
 * @returns 거주자 정보 (ResidentResponse)
 */
export async function createResident(data: CreateResidentRequest) {
  const response = await fetchDefault('/residents', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `거주자 생성 실패 (코드): ${response.status}`;
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