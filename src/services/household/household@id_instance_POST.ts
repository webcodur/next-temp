'use client';
import { fetchDefault } from '@/services/fetchClient';
import { camelToSnake, snakeToCamel } from '@/utils/caseConverter';
import { CreateHouseholdInstanceRequest } from '@/types/household';

/**
 * 특정 세대에 새로운 인스턴스(거주 기간)를 생성한다
 * @param householdId 세대 ID
 * @param data 세대 인스턴스 생성 데이터
 * @returns 생성된 세대 인스턴스 정보
 */
export async function createHouseholdInstance(householdId: number, data: CreateHouseholdInstanceRequest) {
  const response = await fetchDefault(`/households/${householdId}/instances`, {
    method: 'POST',
    body: JSON.stringify(camelToSnake(data)), // 🔥 camelCase → snake_case 변환
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 인스턴스 생성 실패(코드): ${response.status}`;
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