'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SearchIpBlockHistoryRequest } from '@/types/api';

/**
 * 쿼리 조건에 따라 차단 내역을 검색한다
 * @param params 검색 조건
 * @returns 차단 내역 목록과 페이지 정보 (PageDto<IpBlockHistory>)
 */
export async function searchBlockHistory(params?: SearchIpBlockHistoryRequest) {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.ip) searchParams.append('ip', params.ip);
  if (params?.blockType) searchParams.append('blockType', params.blockType);
  if (params?.userAgent) searchParams.append('userAgent', params.userAgent);
  if (params?.requestMethod) searchParams.append('requestMethod', params.requestMethod);
  if (params?.requestUrl) searchParams.append('requestUrl', params.requestUrl);
  if (params?.blockReason) searchParams.append('blockReason', params.blockReason);
  if (params?.matchedPattern) searchParams.append('matchedPattern', params.matchedPattern);
  if (params?.blockDuration) searchParams.append('blockDuration', params.blockDuration.toString());
  if (params?.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());
  if (params?.unblockedStartDate) searchParams.append('unblockedStartDate', params.unblockedStartDate);
  if (params?.unblockedEndDate) searchParams.append('unblockedEndDate', params.unblockedEndDate);
  if (params?.unblockedBy) searchParams.append('unblockedBy', params.unblockedBy);
  if (params?.startDate) searchParams.append('startDate', params.startDate);
  if (params?.endDate) searchParams.append('endDate', params.endDate);

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
  
  return {
    success: true,
    data: result, // 🔥 자동 변환됨 (snake_case → camelCase) - PageDto<IpBlockHistory> 타입
  };
} 