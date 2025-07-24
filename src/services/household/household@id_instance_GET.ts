'use client';
import { fetchDefault } from '@/services/fetchClient';
import { snakeToCamel } from '@/utils/caseConverter';
import { SearchHouseholdInstanceRequest } from '@/types/household';

/**
 * 특정 세대의 모든 인스턴스(거주 기간) 목록을 조회한다
 * @param householdId 세대 ID
 * @param params 검색 조건
 * @returns 세대 인스턴스 목록과 페이지 정보
 */
export async function getHouseholdInstanceList(householdId: number, params?: SearchHouseholdInstanceRequest) {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.householdId) searchParams.append('household_id', params.householdId.toString());
  if (params?.instanceName) searchParams.append('instance_name', params.instanceName);

  const queryString = searchParams.toString();
  const url = queryString ? `/households/${householdId}/instances?${queryString}` : `/households/${householdId}/instances`;

  const response = await fetchDefault(url, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대별 인스턴스 목록 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  return {
    success: true,
    data: snakeToCamel(result), // 🔥 snake_case → camelCase 변환
  };
} 