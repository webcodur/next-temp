'use client';
import { fetchDefault } from '@/services/fetchClient';
import { camelToSnake, snakeToCamel } from '@/utils/caseConverter';
import { UpdateHouseholdInstanceRequest } from '@/types/household';

/**
 * 특정 세대 인스턴스의 정보를 수정한다
 * @param instanceId 인스턴스 ID
 * @param data 수정할 세대 인스턴스 정보
 * @returns 수정된 세대 인스턴스 정보
 */
export async function updateHouseholdInstance(instanceId: number, data: UpdateHouseholdInstanceRequest) {
  const response = await fetchDefault(`/households/instances/${instanceId}`, {
    method: 'PUT',
    body: JSON.stringify(camelToSnake(data)), // 🔥 camelCase → snake_case 변환
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 인스턴스 수정 실패(코드): ${response.status}`;
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