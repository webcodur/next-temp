'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SearchBlacklistRequest, BlacklistResponse, PageResponse, BlacklistRegistrationReason } from '@/types/blacklist';

// #region 서버 타입 정의 (내부 사용)
interface BlacklistServerResponse {
  id: number;
  car_number: string;
  blacklist_type: string;
  registration_reason: string;
  block_period_days?: number;
  description?: string;
  is_active: boolean;
  registered_at: string;
  expires_at?: string;
  unblock_reason?: string;
  unblocked_at?: string;
  created_at: string;
  updated_at: string;
}

interface PageServerResponse {
  data: BlacklistServerResponse[];
  meta: {
    current_page: number;
    items_per_page: number;
    total_items: number;
    total_pages: number;
    has_next_page: boolean;
    has_previous_page: boolean;
  };
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: BlacklistServerResponse): BlacklistResponse {
  return {
    id: server.id,
    carNumber: server.car_number,
    blacklistType: server.blacklist_type as 'AUTO' | 'MANUAL',
    registrationReason: server.registration_reason as BlacklistRegistrationReason,
    blockPeriodDays: server.block_period_days,
    description: server.description,
    isActive: server.is_active,
    registeredAt: server.registered_at,
    expiresAt: server.expires_at,
    unblockReason: server.unblock_reason,
    unblockedAt: server.unblocked_at,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
  };
}

function serverPageToClient(server: PageServerResponse): PageResponse<BlacklistResponse> {
  return {
    data: server.data.map(serverToClient),
    meta: {
      currentPage: server.meta.current_page,
      itemsPerPage: server.meta.items_per_page,
      totalItems: server.meta.total_items,
      totalPages: server.meta.total_pages,
      hasNextPage: server.meta.has_next_page,
      hasPreviousPage: server.meta.has_previous_page,
    },
  };
}
// #endregion

export async function searchBlacklists(params?: SearchBlacklistRequest) {
  const searchParams = new URLSearchParams();
  
  // 쿼리 파라미터는 snake_case로 전송
  if (params?.carNumber) searchParams.append('car_number', params.carNumber);
  if (params?.blacklistType) searchParams.append('blacklist_type', params.blacklistType);
  if (params?.registrationReason) searchParams.append('registration_reason', params.registrationReason);
  if (params?.isActive !== undefined) searchParams.append('is_active', params.isActive.toString());
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());

  const url = `/blacklists${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  const response = await fetchDefault(url, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `블랙리스트 목록 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  const serverResponse = result as PageServerResponse;
  return {
    success: true,
    data: serverPageToClient(serverResponse),
  };
}