'use client';
import { fetchDefault } from '@/services/fetchClient';
import { snakeToCamel } from '@/utils/caseConverter';

/**
 * 세대 인스턴스의 방문 설정을 조회한다
 * @param instanceId 인스턴스 ID
 * @returns 방문 설정 정보
 */
export async function getHouseholdVisitConfig(instanceId: number) {
  const response = await fetchDefault(`/households/instances/${instanceId}/visit-config`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 방문 설정 조회 실패(코드): ${response.status}`;
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