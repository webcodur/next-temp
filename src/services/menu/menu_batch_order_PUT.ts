'use client';
import { fetchDefault } from '@/services/fetchClient';

/**
 * 여러 메뉴의 순서를 일괄로 변경 (모든 메뉴는 같은 부모를 가져야 함)
 * @param items 순서를 변경할 메뉴 목록 (menuId와 order 포함)
 * @returns 일괄 순서 변경 결과
 */
export async function updateBatchMenuOrder(items: Array<{ menuId: number; order: number }>) {
  const response = await fetchDefault('/menus/batch-order', {
    method: 'PUT',
    body: JSON.stringify({ items }),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `메뉴 순서 일괄 변경 실패(코드): ${response.status}`;
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