'use client';

import { fetchDefault } from '../fetchClient';
import { snakeToCamel } from '@/utils/caseConverter';

/**
 * 차단 이력 검색
 * @param page 페이지 번호
 * @param limit 페이지당 아이템 수
 * @param ip IP 주소
 * @param blockType Block Type
 * @param userAgent User-Agent
 * @param requestMethod Request Method
 * @param requestUrl Request URL
 * @param blockReason 차단 사유
 * @param matchedPattern Matched Pattern
 * @param blockDuration Block Duration
 * @param isActive 활성화 여부
 * @param unblockedStartDate 차단 해제 날짜(시작)
 * @param unblockedEndDate 차단 해제 날짜(종료)
 * @param unblockedBy 차단 해제 사용자
 * @param startDate 차단 날짜(시작) (YYYY-MM-DD)
 * @param endDate 차단 날짜(종료) (YYYY-MM-DD)
 * @returns 차단 이력 목록과 페이지 정보
 */
export async function searchIpBlockHistory({
  page = 1,
  limit = 10,
  ip,
  blockType,
  userAgent,
  requestMethod,
  requestUrl,
  blockReason,
  matchedPattern,
  blockDuration,
  isActive,
  unblockedStartDate,
  unblockedEndDate,
  unblockedBy,
  startDate,
  endDate
}: {
  page?: number;
  limit?: number;
  ip?: string;
  blockType?: string;
  userAgent?: string;
  requestMethod?: string;
  requestUrl?: string;
  blockReason?: string;
  matchedPattern?: string;
  blockDuration?: number;
  isActive?: number;
  unblockedStartDate?: string;
  unblockedEndDate?: string;
  unblockedBy?: string;
  startDate?: string;
  endDate?: string;
} = {}) {
  // 쿼리 파라미터 처리
  const params = new URLSearchParams();
  
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  if (ip) params.append('ip', ip);
  if (blockType) params.append('blockType', blockType);
  if (userAgent) params.append('userAgent', userAgent);
  if (requestMethod) params.append('requestMethod', requestMethod);
  if (requestUrl) params.append('requestUrl', requestUrl);
  if (blockReason) params.append('blockReason', blockReason);
  if (matchedPattern) params.append('matchedPattern', matchedPattern);
  if (blockDuration !== undefined) params.append('blockDuration', blockDuration.toString());
  if (isActive !== undefined) params.append('isActive', isActive.toString());
  if (unblockedStartDate) params.append('unblockedStartDate', unblockedStartDate);
  if (unblockedEndDate) params.append('unblockedEndDate', unblockedEndDate);
  if (unblockedBy) params.append('unblockedBy', unblockedBy);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await fetchDefault(`/ip-blocks/history/search?${params.toString()}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차단 이력 검색 실패(코드): ${response.status}`
    console.log(errorMsg)
    return {
      success: false,
      errorMsg: errorMsg,
    }
  }
  
  return {
    success: true,
    data: snakeToCamel(result), // 🔥 snake_case → camelCase 변환
  }
} 