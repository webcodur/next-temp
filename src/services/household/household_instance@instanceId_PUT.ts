'use client';
import { fetchDefault } from '@/services/fetchClient';
import { UpdateHouseholdInstanceRequest } from '@/types/household';

/**
 * 특정 세대 인스턴스의 정보를 수정한다
 * @param instance_id 인스턴스 ID
 * @param data 수정할 세대 인스턴스 정보
 * @returns 수정된 세대 인스턴스 정보
 */
export async function updateHouseholdInstance(instance_id: number, data: UpdateHouseholdInstanceRequest) {
  const response = await fetchDefault(`/households/instances/${instance_id}`, {
    method: 'PUT',
    body: JSON.stringify(data), // 🔥 자동 변환됨 (camelCase → snake_case)
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
    data: result, // 🔥 자동 변환됨 (snake_case → camelCase)
  };
} 