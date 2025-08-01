'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SearchHouseholdRequest, Household, PaginatedResponse } from '@/types/household';

// #region 서버 타입 정의 (내부 사용)
interface HouseholdServerResponse {
  id: number;
  parkinglot_id: number;
  address_1depth: string;
  address_2depth: string;
  address_3depth?: string;
  household_type: 'GENERAL' | 'TEMP' | 'COMMERCIAL';
  memo?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

interface PaginatedServerResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: HouseholdServerResponse): Household {
  return {
    id: server.id,
    parkinglotId: server.parkinglot_id,
    address1Depth: server.address_1depth,
    address2Depth: server.address_2depth,
    address3Depth: server.address_3depth,
    householdType: server.household_type,
    memo: server.memo,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
    deletedAt: server.deleted_at,
  };
}

function paginatedServerToClient(server: PaginatedServerResponse<HouseholdServerResponse>): PaginatedResponse<Household> {
  return {
    data: server.data.map(serverToClient),
    total: server.total,
    page: server.page,
    limit: server.limit,
    totalPages: server.total_pages,
  };
}
// #endregion

/**
 * 세대 목록을 조회한다 (페이지네이션 및 필터링)
 * @param params 검색 조건
 * @returns 세대 목록과 페이지 정보
 */
export async function searchHousehold(params?: SearchHouseholdRequest) {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.householdType) searchParams.append('household_type', params.householdType);
  if (params?.address1Depth) searchParams.append('address_1depth', params.address1Depth);
  if (params?.address2Depth) searchParams.append('address_2depth', params.address2Depth);
  if (params?.address3Depth) searchParams.append('address_3depth', params.address3Depth);

  const queryString = searchParams.toString();
  const url = queryString ? `/households?${queryString}` : '/households';

  const response = await fetchDefault(url, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 목록 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  const serverResponse = result as PaginatedServerResponse<HouseholdServerResponse>;
  return {
    success: true,
    data: paginatedServerToClient(serverResponse),
  };
} 