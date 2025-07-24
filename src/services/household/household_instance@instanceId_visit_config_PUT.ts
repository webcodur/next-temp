'use client';
import { fetchDefault } from '@/services/fetchClient';
import { camelToSnake, snakeToCamel } from '@/utils/caseConverter';
import { UpdateHouseholdVisitConfigRequest } from '@/types/household';

/**
 * 세대 인스턴스의 방문 시간 설정을 수정한다
 * @param instanceId 인스턴스 ID
 * @param data 방문 설정 데이터
 * @returns 수정된 방문 설정 정보
 */
export async function updateHouseholdVisitConfig(instanceId: number, data: UpdateHouseholdVisitConfigRequest) {
  const response = await fetchDefault(`/households/instances/${instanceId}/visit-config`, {
    method: 'PUT',
    body: JSON.stringify(camelToSnake(data)), // 🔥 camelCase → snake_case 변환
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 방문 설정 수정 실패(코드): ${response.status}`;
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