'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SearchHouseholdInstanceRequest, HouseholdInstance, PaginatedResponse } from '@/types/household';

// #region 서버 타입 정의 (내부 사용)
interface HouseholdInstanceServerResponse {
  id: number;
  household_id: number;
  instance_name?: string;
  password: string;
  start_date?: string;
  end_date?: string;
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
function serverToClient(server: HouseholdInstanceServerResponse): HouseholdInstance {
  return {
    id: server.id,
    householdId: server.household_id,
    instanceName: server.instance_name,
    password: server.password,
    startDate: server.start_date,
    endDate: server.end_date,
    memo: server.memo,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
    deletedAt: server.deleted_at,
  };
}

function paginatedServerToClient(server: PaginatedServerResponse<HouseholdInstanceServerResponse>): PaginatedResponse<HouseholdInstance> {
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
 * 특정 세대의 모든 인스턴스(거주 기간) 목록을 조회한다
 * @param householdId 세대 ID
 * @param params 검색 조건
 * @returns 세대 인스턴스 목록과 페이지 정보
 */
export async function getHouseholdInstanceList(householdId: number, params?: SearchHouseholdInstanceRequest) {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.householdId) searchParams.append('household_id', params.householdId.toString());
  if (params?.instanceName) searchParams.append('instance_name', params.instanceName);

  const queryString = searchParams.toString();
  const url = queryString ? `/households/${householdId}/instances?${queryString}` : `/households/${householdId}/instances`;

  const response = await fetchDefault(url, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대별 인스턴스 목록 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  const serverResponse = result as PaginatedServerResponse<HouseholdInstanceServerResponse>;
  return {
    success: true,
    data: paginatedServerToClient(serverResponse),
  };
} 