'use client';
import { fetchDefault } from '@/services/fetchClient';

/**
 * 특정 메뉴의 순서를 변경 (같은 부모를 가진 메뉴들 내에서만 순서 변경 가능)
 * @param menuId 순서를 변경할 메뉴 ID
 * @param newOrder 변경할 순서 (1부터 시작)
 * @returns 순서 변경 결과
 */
export async function updateMenuOrder(menuId: number, newOrder: number) {
  const response = await fetchDefault(`/menus/${menuId}/order`, {
    method: 'PUT',
    body: JSON.stringify({ newOrder }),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `메뉴 순서 변경 실패(코드): ${response.status}`;
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