'use client';
import { fetchDefault } from '@/services/fetchClient';

/**
 * 특정 세대 인스턴스의 상세 정보를 조회한다 (삭제된 세대 포함)
 * @param instance_id 인스턴스 ID
 * @returns 세대 인스턴스 상세 정보
 */
export async function getHouseholdInstanceDetail(instance_id: number) {
  const response = await fetchDefault(`/households/instances/${instance_id}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 인스턴스 상세 조회 실패(코드): ${response.status}`;
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