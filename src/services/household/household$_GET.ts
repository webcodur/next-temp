'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SearchHouseholdRequest } from '@/types/household';

/**
 * 세대 목록을 조회한다 (페이지네이션 및 필터링)
 * @param params 검색 조건
 * @returns 세대 목록과 페이지 정보
 */
export async function searchHousehold(params?: SearchHouseholdRequest) {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.householdType) searchParams.append('householdType', params.householdType);
  if (params?.address1Depth) searchParams.append('address1Depth', params.address1Depth);
  if (params?.address2Depth) searchParams.append('address2Depth', params.address2Depth);
  if (params?.address3Depth) searchParams.append('address3Depth', params.address3Depth);

  const queryString = searchParams.toString();
  const url = queryString ? `/households?${queryString}` : '/households';

  const response = await fetchDefault(url, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 목록 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  return {
    success: true,
    data: result, // 🔥 자동 변환됨 (snake_case → camelCase)
  };
} 