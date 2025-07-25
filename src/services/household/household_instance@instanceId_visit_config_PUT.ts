'use client';
import { fetchDefault } from '@/services/fetchClient';
import { UpdateHouseholdVisitConfigRequest } from '@/types/household';

/**
 * 세대 인스턴스의 방문 시간 설정을 수정한다
 * @param instance_id 인스턴스 ID
 * @param data 방문 설정 데이터
 * @returns 수정된 방문 설정 정보
 */
export async function updateHouseholdVisitConfig(instance_id: number, data: UpdateHouseholdVisitConfigRequest) {
  const response = await fetchDefault(`/households/instances/${instance_id}/config/visit`, {
    method: 'PUT',
    body: JSON.stringify(data), // 🔥 자동 변환됨 (camelCase → snake_case)
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
    data: result, // 🔥 자동 변환됨 (snake_case → camelCase)
  };
} 