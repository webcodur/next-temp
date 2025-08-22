'use client';
import { fetchDefault } from '@/services/fetchClient';
import { BlacklistStatusResponse, BlacklistRegistrationReason } from '@/types/blacklist';

// #region 서버 타입 정의 (내부 사용)
interface BlacklistStatusServerResponse {
  is_blacklisted: boolean;
  blacklist?: {
    id: number;
    car_id?: number | null;
    car_number: string;
    blacklist_type: string;
    registration_reason: string;
    total_violations: number;
    total_penalty_points: number;
    blocked_at: string | null;
    blocked_until?: string | null;
    auto_unblock: boolean;
    is_active: boolean;
    unblocked_at?: string | null;
    unblocked_by?: number | null;
    unblock_reason?: string | null;
    block_reason?: string | null;
    evidence_data?: unknown;
    registered_by?: number | null;
    created_at: string | null;
    updated_at: string | null;
    car?: {
      id: number;
      car_number: string;
      brand: string | null;
      model: string | null;
    } | null;
    registered_admin?: {
      id: number;
      name: string | null;
      account: string;
    } | null;
    unblocked_admin?: {
      id: number;
      name: string | null;
      account: string;
    } | null;
  } | null;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: BlacklistStatusServerResponse): BlacklistStatusResponse {
  return {
    isBlacklisted: server.is_blacklisted,
    blacklist: server.blacklist ? {
      id: server.blacklist.id,
      carId: server.blacklist.car_id,
      carNumber: server.blacklist.car_number,
      blacklistType: server.blacklist.blacklist_type as 'AUTO' | 'MANUAL',
      registrationReason: server.blacklist.registration_reason as BlacklistRegistrationReason,
      totalViolations: server.blacklist.total_violations,
      totalPenaltyPoints: server.blacklist.total_penalty_points,
      blockedAt: server.blacklist.blocked_at,
      blockedUntil: server.blacklist.blocked_until,
      autoUnblock: server.blacklist.auto_unblock,
      isActive: server.blacklist.is_active,
      unblockedAt: server.blacklist.unblocked_at,
      unblockedBy: server.blacklist.unblocked_by,
      unblockReason: server.blacklist.unblock_reason,
      blockReason: server.blacklist.block_reason,
      evidenceData: server.blacklist.evidence_data,
      registeredBy: server.blacklist.registered_by,
      createdAt: server.blacklist.created_at,
      updatedAt: server.blacklist.updated_at,
      car: server.blacklist.car,
      registeredAdmin: server.blacklist.registered_admin,
      unblockedAdmin: server.blacklist.unblocked_admin,
    } : null,
  };
}
// #endregion

export async function getBlacklistStatus(carNumber: string) {
  const response = await fetchDefault(`/blacklists/status/${encodeURIComponent(carNumber)}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량 블랙리스트 상태 확인 실패(코드): ${response.status}`;
    // console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  const serverResponse = result as BlacklistStatusServerResponse;
  return {
    success: true,
    data: serverToClient(serverResponse),
  };
}