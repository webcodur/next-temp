'use client';
import { fetchDefault } from '@/services/fetchClient';
import { BlacklistStatusResponse } from '@/types/blacklist';

// #region 서버 타입 정의 (내부 사용)
interface BlacklistStatusServerResponse {
  car_number: string;
  is_blacklisted: boolean;
  blacklist_info?: {
    id: number;
    blacklist_type: string;
    registration_reason: string;
    registered_at: string;
    expires_at?: string;
    description?: string;
  };
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: BlacklistStatusServerResponse): BlacklistStatusResponse {
  return {
    carNumber: server.car_number,
    isBlacklisted: server.is_blacklisted,
    blacklistInfo: server.blacklist_info ? {
      id: server.blacklist_info.id,
      blacklistType: server.blacklist_info.blacklist_type as 'AUTO' | 'MANUAL',
      registrationReason: server.blacklist_info.registration_reason as any,
      registeredAt: server.blacklist_info.registered_at,
      expiresAt: server.blacklist_info.expires_at,
      description: server.blacklist_info.description,
    } : undefined,
  };
}
// #endregion

export async function getBlacklistStatus(carNumber: string) {
  const response = await fetchDefault(`/car-blacklists/status/${encodeURIComponent(carNumber)}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량 블랙리스트 상태 확인 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  const serverResponse = result as BlacklistStatusServerResponse;
  return {
    success: true,
    data: serverToClient(serverResponse),
  };
}