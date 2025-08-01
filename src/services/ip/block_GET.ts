'use client';
import { fetchDefault } from '@/services/fetchClient';
import { IpBlock } from '@/types/api';

//#region 서버 타입 정의 (파일 내부 사용)
interface IpBlockServerResponse {
  ip: string;
  block_type: 'MANUAL' | 'AUTO';  // snake_case
  block_reason: string;            // snake_case
  blocked_at: string;              // snake_case
  unblocked_at?: string;           // snake_case
  unblocked_by?: number;           // snake_case
  is_active: boolean;              // snake_case
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function serverToClient(server: IpBlockServerResponse): IpBlock {
  return {
    ip: server.ip,
    blockType: server.block_type,
    blockReason: server.block_reason,
    blockedAt: server.blocked_at,
    unblockedAt: server.unblocked_at,
    unblockedBy: server.unblocked_by,
    isActive: server.is_active,
  };
}
//#endregion

/**
 * Redis에 저장된 모든 차단된 IP 주소와 상세 정보를 조회한다
 * @returns 차단된 IP 목록 (IpBlock[])
 */
export async function getBlockedIpList() {
  const response = await fetchDefault('/ip/block', {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차단된 IP 목록 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }

  const serverResponse = result as IpBlockServerResponse[];
  const clientData = serverResponse.map(serverToClient);
  
  return {
    success: true,
    data: clientData,
  };
} 