'use client';
import { fetchDefault } from '@/services/fetchClient';
import { IpBlock } from '@/types/api';

//#region 서버 타입 정의 (파일 내부 사용)
interface IpBlockServerResponse {
  ip: string;
  blocked_at: string;
  reason: string;
  user_agent?: string;
  attempts: number;
  remaining_time?: number;
  is_permanent?: boolean;
}

interface IpBlockListServerResponse {
  data: IpBlockServerResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function serverToClient(server: IpBlockServerResponse): IpBlock {
  return {
    ip: server.ip,
    blockType: 'AUTO', // API 스펙에 따라 기본값 설정
    blockReason: server.reason,
    blockedAt: server.blocked_at,
    isActive: true, // 차단된 IP 목록이므로 활성 상태
  };
}

function listResponseToClient(server: IpBlockListServerResponse) {
  return {
    data: server.data.map(serverToClient),
    total: server.total,
    page: server.page,
    limit: server.limit,
    totalPages: server.totalPages,
  };
}
//#endregion

/**
 * Redis에 저장된 모든 차단된 IP 주소와 상세 정보를 조회한다
 * @param page 페이지 번호 (기본값: 1)
 * @param limit 페이지당 항목 수 (기본값: 10)
 * @returns 차단된 IP 목록 (PageDto<IpBlock>)
 */
export async function getBlockedIpList(page?: number, limit?: number) {
  const searchParams = new URLSearchParams();
  if (page) searchParams.append('page', page.toString());
  if (limit) searchParams.append('limit', limit.toString());
  
  const queryString = searchParams.toString();
  const url = queryString ? `/ip/block?${queryString}` : '/ip/block';

  const response = await fetchDefault(url, {
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

  const serverResponse = result as IpBlockListServerResponse;
  const clientData = listResponseToClient(serverResponse);
  
  return {
    success: true,
    data: clientData,
  };
} 