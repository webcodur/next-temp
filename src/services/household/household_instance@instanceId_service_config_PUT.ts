'use client';
import { fetchDefault } from '@/services/fetchClient';
import { UpdateHouseholdServiceConfigRequest } from '@/types/household';

/**
 * 세대 인스턴스의 서비스 설정을 수정한다
 * @param instance_id 인스턴스 ID
 * @param data 서비스 설정 데이터
 * @returns 수정된 서비스 설정 정보
 */
export async function updateHouseholdServiceConfig(instance_id: number, data: UpdateHouseholdServiceConfigRequest) {
  const response = await fetchDefault(`/households/instances/${instance_id}/config/service`, {
    method: 'PUT',
    body: JSON.stringify(data), // 🔥 자동 변환됨 (camelCase → snake_case)
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 서비스 설정 수정 실패(코드): ${response.status}`;
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