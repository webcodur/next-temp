'use client';
import { fetchDefault } from '@/services/fetchClient';
import { snakeToCamel } from '@/utils/caseConverter';
import { SearchHouseholdInstanceRequest } from '@/types/household';

/**
 * 세대 인스턴스를 검색한다 (페이지네이션 및 필터링)
 * @param params 검색 조건
 * @returns 세대 인스턴스 목록과 페이지 정보
 */
export async function searchHouseholdInstance(params?: SearchHouseholdInstanceRequest) {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.householdId) searchParams.append('household_id', params.householdId.toString());
  if (params?.instanceName) searchParams.append('instance_name', params.instanceName);

  const queryString = searchParams.toString();
  const url = queryString ? `/households/instances?${queryString}` : '/households/instances';

  const response = await fetchDefault(url, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 인스턴스 검색 실패(코드): ${response.status}`;
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