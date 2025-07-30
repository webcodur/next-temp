'use client';
import { fetchDefault } from '@/services/fetchClient';

export interface UpdateResidentRequest {
  name?: string;
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