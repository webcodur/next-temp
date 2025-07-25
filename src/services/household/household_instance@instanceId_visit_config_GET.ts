'use client';
import { fetchDefault } from '@/services/fetchClient';

/**
 * 세대 인스턴스의 방문 설정을 조회한다
 * @param instance_id 인스턴스 ID
 * @returns 방문 설정 정보
 */
export async function getHouseholdVisitConfig(instance_id: number) {
  const response = await fetchDefault(`/households/instances/${instance_id}/config/visit`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 방문 설정 조회 실패(코드): ${response.status}`;
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