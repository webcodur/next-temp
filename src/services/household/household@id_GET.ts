'use client';
import { fetchDefault } from '@/services/fetchClient';
import { snakeToCamel } from '@/utils/caseConverter';

/**
 * 특정 세대의 상세 정보를 조회한다
 * @param id 세대 ID
 * @returns 세대 상세 정보
 */
export async function getHouseholdDetail(id: number) {
  const response = await fetchDefault(`/households/${id}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 상세 조회 실패(코드): ${response.status}`;
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