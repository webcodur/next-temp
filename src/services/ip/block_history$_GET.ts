'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SearchIpBlockHistoryRequest, IpBlockHistory } from '@/types/api';

//#region 서버 타입 정의 (파일 내부 사용)
interface IpBlockHistoryServerResponse {
  id: number;
  ip: string;
  block_type: 'MANUAL' | 'AUTO';   // snake_case
  user_agent?: string;             // snake_case
  request_method?: string;         // snake_case
  request_url?: string;            // snake_case
  block_reason: string;            // snake_case
  matched_pattern?: string;        // snake_case
  block_duration?: number;         // snake_case
  blocked_at: string;              // snake_case
  unblocked_at?: string;           // snake_case
  unblocked_by?: number;           // snake_case
}

interface IpBlockHistorySearchServerResponse {
  data: IpBlockHistoryServerResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function buildServerQueryParams(client: SearchIpBlockHistoryRequest): URLSearchParams {
  const searchParams = new URLSearchParams();
  
  if (client.page) searchParams.append('page', client.page.toString());
  if (client.limit) searchParams.append('limit', client.limit.toString());
  if (client.ip) searchParams.append('ip', client.ip);
  if (client.blockType) searchParams.append('block_type', client.blockType);  // snake_case
  if (client.userAgent) searchParams.append('user_agent', client.userAgent);  // snake_case
  if (client.requestMethod) searchParams.append('request_method', client.requestMethod);  // snake_case
  if (client.requestUrl) searchParams.append('request_url', client.requestUrl);  // snake_case
  if (client.blockReason) searchParams.append('block_reason', client.blockReason);  // snake_case
  if (client.matchedPattern) searchParams.append('matched_pattern', client.matchedPattern);  // snake_case
  if (client.blockDuration) searchParams.append('block_duration', client.blockDuration.toString());  // snake_case
  if (client.isActive !== undefined) searchParams.append('is_active', client.isActive.toString());  // snake_case
  if (client.unblockedStartDate) searchParams.append('unblocked_start_date', client.unblockedStartDate);  // snake_case
  if (client.unblockedEndDate) searchParams.append('unblocked_end_date', client.unblockedEndDate);  // snake_case
  if (client.unblockedBy) searchParams.append('unblocked_by', client.unblockedBy);  // snake_case
  if (client.startDate) searchParams.append('start_date', client.startDate);  // snake_case
  if (client.endDate) searchParams.append('end_date', client.endDate);  // snake_case

  return searchParams;
}

function serverToClient(server: IpBlockHistoryServerResponse): IpBlockHistory {
  return {
    id: server.id,
    ip: server.ip,
    blockType: server.block_type,
    userAgent: server.user_agent,
    requestMethod: server.request_method,
    requestUrl: server.request_url,
    blockReason: server.block_reason,
    matchedPattern: server.matched_pattern,
    blockDuration: server.block_duration,
    blockedAt: server.blocked_at,
    unblockedAt: server.unblocked_at,
    unblockedBy: server.unblocked_by,
  };
}

function searchResponseToClient(server: IpBlockHistorySearchServerResponse) {
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
 * 쿼리 조건에 따라 차단 내역을 검색한다
 * @param params 검색 조건
 * @returns 차단 내역 목록과 페이지 정보 (PageDto<IpBlockHistory>)
 */
export async function searchBlockHistory(params?: SearchIpBlockHistoryRequest) {
  const searchParams = buildServerQueryParams(params || {});
  const queryString = searchParams.toString();
  const url = queryString ? `/ip/block/history/search?${queryString}` : '/ip/block/history/search';

  const response = await fetchDefault(url, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차단 내역 검색 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }

  const serverResponse = result as IpBlockHistorySearchServerResponse;
  const clientData = searchResponseToClient(serverResponse);
  
  return {
    success: true,
    data: clientData,
  };
} 