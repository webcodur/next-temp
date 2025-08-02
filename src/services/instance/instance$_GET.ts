'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SearchInstanceRequest, Instance, PaginatedResponse } from '@/types/instance';

// #region 서버 타입 정의 (내부 사용)
interface InstanceServerResponse {
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
function serverToClient(server: InstanceServerResponse): Instance {
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

function paginatedServerToClient(server: PaginatedServerResponse<InstanceServerResponse>): PaginatedResponse<Instance> {
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
 * 인스턴스를 검색한다 (페이지네이션 및 필터링)
 * @param params 검색 조건
 * @returns 인스턴스 목록과 페이지 정보
 */
export async function searchInstance(params?: SearchInstanceRequest) {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.householdId) searchParams.append('household_id', params.householdId.toString());
  if (params?.instanceName) searchParams.append('instance_name', params.instanceName);

  const queryString = searchParams.toString();
  const url = queryString ? `/households/instances?${queryString}` : '/households/instances';

  const response = await fetchDefault(url, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `인스턴스 검색 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  const serverResponse = result as PaginatedServerResponse<InstanceServerResponse>;
  return {
    success: true,
    data: paginatedServerToClient(serverResponse),
  };
}