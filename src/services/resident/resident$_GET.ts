'use client';
import { fetchDefault } from '@/services/fetchClient';
import type { Resident, SearchResidentRequest, PaginatedResponse } from '@/types/api';

//#region 서버 타입 정의 (파일 내부 사용)
interface SearchResidentServerParams {
  page?: number;
  limit?: number;
  name?: string;
  phone?: string;
  email?: string;
  gender?: 'M' | 'F';
  parkinglot_id?: number;        // snake_case
  address_1depth?: string;       // snake_case
  address_2depth?: string;       // snake_case
  address_3depth?: string;       // snake_case
}

interface ResidentServerResponse {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  birth_date?: Date;             // snake_case
  gender?: string;
  emergency_contact?: string;    // snake_case
  memo?: string;
  created_at: Date;              // snake_case
  updated_at: Date;              // snake_case
  deleted_at?: Date | null;      // snake_case
  resident_instance?: unknown[];    // snake_case
}

interface PaginatedServerResponse<T> {
  data: T[];
  meta: {
    current_page: number;        // snake_case
    items_per_page: number;      // snake_case
    total_pages: number;         // snake_case
    total_items: number;         // snake_case
  };
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function clientToServerParams(client?: SearchResidentRequest): SearchResidentServerParams | undefined {
  if (!client) return undefined;
  
  return {
    page: client.page,
    limit: client.limit,
    name: client.name,
    phone: client.phone,
    email: client.email,
    gender: client.gender,
    parkinglot_id: client.parkinglotId,
    address_1depth: client.address1Depth,
    address_2depth: client.address2Depth,
    address_3depth: client.address3Depth,
  };
}

function serverToClient(server: ResidentServerResponse): Resident {
  return {
    id: server.id,
    name: server.name,
    phone: server.phone,
    email: server.email,
    birthDate: server.birth_date,
    gender: server.gender,
    emergencyContact: server.emergency_contact,
    memo: server.memo,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
    deletedAt: server.deleted_at,
    residentHouseholds: server.resident_instance,
  };
}

function serverToClientPaginated(server: PaginatedServerResponse<ResidentServerResponse>): PaginatedResponse<Resident> {
  return {
    data: server.data.map(serverToClient),
    total: server.meta.total_items,
    page: server.meta.current_page,
    limit: server.meta.items_per_page,
    totalPages: server.meta.total_pages,
  };
}
//#endregion

/**
 * 거주자 목록을 조회한다
 * @param params 검색 조건 및 페이지네이션 정보
 * @returns 거주자 목록과 페이지 정보 (PaginatedResponse<Resident>)
 */
export async function searchResident(params?: SearchResidentRequest) {
  const serverParams = clientToServerParams(params);
  const searchParams = new URLSearchParams();
  
  if (serverParams?.page) searchParams.append('page', serverParams.page.toString());
  if (serverParams?.limit) searchParams.append('limit', serverParams.limit.toString());
  if (serverParams?.name) searchParams.append('name', serverParams.name);
  if (serverParams?.phone) searchParams.append('phone', serverParams.phone);
  if (serverParams?.email) searchParams.append('email', serverParams.email);
  if (serverParams?.gender) searchParams.append('gender', serverParams.gender);
  if (serverParams?.parkinglot_id) searchParams.append('parkinglot_id', serverParams.parkinglot_id.toString());
  if (serverParams?.address_1depth) searchParams.append('address_1depth', serverParams.address_1depth);
  if (serverParams?.address_2depth) searchParams.append('address_2depth', serverParams.address_2depth);
  if (serverParams?.address_3depth) searchParams.append('address_3depth', serverParams.address_3depth);

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
  
  const serverResponse = result as PaginatedServerResponse<ResidentServerResponse>;
  const clientData = serverToClientPaginated(serverResponse);
  
  return {
    success: true,
    data: clientData,
  };
} 