'use client';
import { fetchDefault } from '@/services/fetchClient';

export interface SearchResidentParams {
  page?: number;
  limit?: number;
  name?: string;
  phone?: string;
  email?: string;
  gender?: 'M' | 'F';
  parkinglotId?: number;
  address1Depth?: string;
  address2Depth?: string;
  address3Depth?: string;
}

export interface ResidentDto {
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
  residentHouseholds?: unknown[];
}

export interface PageMetaDto {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SearchResidentResponse {
  data: ResidentDto[];
  meta: PageMetaDto;
}

/**
 * 거주자 목록을 조회한다
 * @param params 검색 조건 및 페이지네이션 정보
 * @returns 거주자 목록과 페이지 정보 (SearchResidentResponse)
 */
export async function searchResident(params?: SearchResidentParams) {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.name) searchParams.append('name', params.name);
  if (params?.phone) searchParams.append('phone', params.phone);
  if (params?.email) searchParams.append('email', params.email);
  if (params?.gender) searchParams.append('gender', params.gender);
  if (params?.parkinglotId) searchParams.append('parkinglotId', params.parkinglotId.toString());
  if (params?.address1Depth) searchParams.append('address1Depth', params.address1Depth);
  if (params?.address2Depth) searchParams.append('address2Depth', params.address2Depth);
  if (params?.address3Depth) searchParams.append('address3Depth', params.address3Depth);

  const queryString = searchParams.toString();
  const url = queryString ? `/residents?${queryString}` : '/residents';
  
  const response = await fetchDefault(url, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `거주자 목록 조회 실패 (코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  return {
    success: true,
    data: result as SearchResidentResponse,
  };
} 