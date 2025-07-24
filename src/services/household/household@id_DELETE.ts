'use client';
import { fetchDefault } from '@/services/fetchClient';
import { snakeToCamel } from '@/utils/caseConverter';

/**
 * 특정 세대를 삭제한다 (소프트 삭제)
 * @param id 세대 ID
 * @returns 삭제 성공 여부
 */
export async function deleteHousehold(id: number) {
  const response = await fetchDefault(`/households/${id}`, {
    method: 'DELETE',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 삭제 실패(코드): ${response.status}`;
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