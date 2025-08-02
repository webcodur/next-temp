'use client';
import { fetchDefault } from '@/services/fetchClient';

/**
 * 특정 인스턴스를 삭제한다 (이사 처리)
 * @param id 인스턴스 ID
 * @returns 삭제 성공 여부
 */
export async function deleteInstance(id: number) {
  const response = await fetchDefault(`/households/instances/${id}`, {
    method: 'DELETE',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `인스턴스 삭제 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  return {
    success: true,
    data: result,
  };
}