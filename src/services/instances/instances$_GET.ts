'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SearchInstanceParams, PaginatedInstanceResponse, Instance, InstanceType } from '@/types/instance';

// #region 서버 타입 정의 (내부 사용)
interface InstanceServerResponse {
  id: number;
  parkinglot_id: number;
  address_1depth: string;
  address_2depth: string;
  address_3depth?: string | null;
  instance_type: string;
  password: string;
  memo?: string | null;
  created_at: string;
  updated_at: string;
}

interface PaginatedInstanceServerResponse {
  data: InstanceServerResponse[];
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
    parkinglotId: server.parkinglot_id,
    address1Depth: server.address_1depth,
    address2Depth: server.address_2depth,
    address3Depth: server.address_3depth,
    instanceType: server.instance_type as InstanceType,
    password: server.password,
    memo: server.memo,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
  };
}

function paginatedServerToClient(server: PaginatedInstanceServerResponse): PaginatedInstanceResponse {
  return {
    data: server.data.map(serverToClient),
    total: server.total,
    page: server.page,
    limit: server.limit,
    totalPages: server.total_pages,
  };
}
// #endregion

export async function searchInstances(params?: SearchInstanceParams) {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.instanceType) searchParams.append('instance_type', params.instanceType);
  if (params?.address1Depth) searchParams.append('address_1depth', params.address1Depth);
  if (params?.address2Depth) searchParams.append('address_2depth', params.address2Depth);
  if (params?.address3Depth) searchParams.append('address_3depth', params.address3Depth);
  if (params?.instanceId) searchParams.append('instance_id', params.instanceId.toString());
  if (params?.instanceName) searchParams.append('instance_name', params.instanceName);

  const queryString = searchParams.toString();
  const url = queryString ? `/instances?${queryString}` : '/instances';

  const response = await fetchDefault(url, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `인스턴스 목록 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  const serverResponse = result as PaginatedInstanceServerResponse;
  return {
    success: true,
    data: paginatedServerToClient(serverResponse),
  };
}
