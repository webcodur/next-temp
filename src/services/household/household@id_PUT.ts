'use client';
import { fetchDefault } from '@/services/fetchClient';
import { camelToSnake, snakeToCamel } from '@/utils/caseConverter';
import { UpdateHouseholdRequest } from '@/types/household';

/**
 * 특정 세대의 정보를 수정한다
 * @param id 세대 ID
 * @param data 수정할 세대 정보
 * @returns 수정된 세대 정보
 */
export async function updateHousehold(id: number, data: UpdateHouseholdRequest) {
  const response = await fetchDefault(`/households/${id}`, {
    method: 'PUT',
    body: JSON.stringify(camelToSnake(data)), // 🔥 camelCase → snake_case 변환
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 정보 수정 실패(코드): ${response.status}`;
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