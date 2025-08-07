'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SearchResidentParams, PaginatedResidentResponse } from '@/types/resident';

// #region 서버 타입 정의 (내부 사용)
interface ResidentInstanceServerResponse {
  id: number;
  resident_id: number;
  instance_id: number;
  memo?: string | null;
  created_at: string;
  updated_at: string;
  instance: {
    id: number;
    parkinglot_id: number;
    address_1depth: string;
    address_2depth: string;
    address_3depth?: string | null;
    instance_type: string;
    memo?: string | null;
    created_at: string;
    updated_at: string;
  } | null;
}

interface ResidentDetailServerResponse {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  birth_date?: string | null;
  gender?: 'M' | 'F' | null;
  emergency_contact?: string | null;
  memo?: string | null;
  created_at: string;
  updated_at: string;
  resident_instance: ResidentInstanceServerResponse[];
}

interface PaginatedResidentServerResponse {
  data: ResidentDetailServerResponse[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: PaginatedResidentServerResponse): PaginatedResidentResponse {
  return {
    data: server.data.map(resident => ({
      id: resident.id,
      name: resident.name,
      phone: resident.phone,
      email: resident.email,
      birthDate: resident.birth_date,
      gender: resident.gender,
      emergencyContact: resident.emergency_contact,
      memo: resident.memo,
      createdAt: resident.created_at,
      updatedAt: resident.updated_at,
      residentInstance: resident.resident_instance.map(ri => ({
        id: ri.id,
        residentId: ri.resident_id,
        instanceId: ri.instance_id,
        memo: ri.memo,
        createdAt: ri.created_at,
        updatedAt: ri.updated_at,
        instance: ri.instance ? {
          id: ri.instance.id,
          parkinglotId: ri.instance.parkinglot_id,
          address1Depth: ri.instance.address_1depth,
          address2Depth: ri.instance.address_2depth,
          address3Depth: ri.instance.address_3depth,
          instanceType: ri.instance.instance_type,
          memo: ri.instance.memo,
          createdAt: ri.instance.created_at,
          updatedAt: ri.instance.updated_at,
        } : null,
      })),
    })),
    total: server.total,
    page: server.page,
    limit: server.limit,
    totalPages: server.total_pages,
  };
}
// #endregion

export async function searchResidents(params?: SearchResidentParams) {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.name) searchParams.append('name', params.name);
  if (params?.phone) searchParams.append('phone', params.phone);
  if (params?.email) searchParams.append('email', params.email);
  if (params?.gender) searchParams.append('gender', params.gender);
  if (params?.address1Depth) searchParams.append('address_1depth', params.address1Depth);
  if (params?.address2Depth) searchParams.append('address_2depth', params.address2Depth);
  if (params?.address3Depth) searchParams.append('address_3depth', params.address3Depth);

  const queryString = searchParams.toString();
  const url = queryString ? `/residents?${queryString}` : '/residents';

  const response = await fetchDefault(url, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `거주자 목록 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  const serverResponse = result as PaginatedResidentServerResponse;
  return {
    success: true,
    data: serverToClient(serverResponse),
  };
}
