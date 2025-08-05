'use client';
import { fetchDefault } from '@/services/fetchClient';
import { UpdateBlacklistRequest, BlacklistResponse, BlacklistRegistrationReason } from '@/types/blacklist';

// #region 서버 타입 정의 (내부 사용)
interface UpdateBlacklistServerRequest {
  registration_reason: string;
  blocked_until: number;
  description?: string;
  unblock_reason?: string;
}

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
// #endregion

// #region 변환 함수 (내부 사용)
function clientToServer(client: UpdateBlacklistRequest): UpdateBlacklistServerRequest {
  return {
    registration_reason: client.registrationReason,
    blocked_until: new Date(client.blockedUntil).getTime(),
    description: client.description,
    unblock_reason: client.unblockReason,
  };
}

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
// #endregion

export async function updateBlacklist(id: number, data: UpdateBlacklistRequest) {
  const serverRequest = clientToServer(data);
  
  const response = await fetchDefault(`/blacklists/${id}`, {
    method: 'PUT',
    body: JSON.stringify(serverRequest),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `블랙리스트 수정 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  const serverResponse = result as BlacklistServerResponse;
  return {
    success: true,
    data: serverToClient(serverResponse),
  };
}