'use client';
import { fetchDefault } from '@/services/fetchClient';
import { camelToSnake, snakeToCamel } from '@/utils/caseConverter';
import { CreateHouseholdRequest } from '@/types/household';

/**
 * 세대를 생성한다
 * @param data 세대 생성 데이터
 * @returns 생성된 세대 정보
 */
export async function createHousehold(data: CreateHouseholdRequest) {
  const response = await fetchDefault('/households', {
    method: 'POST',
    body: JSON.stringify(camelToSnake(data)), // 🔥 camelCase → snake_case 변환
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 생성 실패(코드): ${response.status}`;
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