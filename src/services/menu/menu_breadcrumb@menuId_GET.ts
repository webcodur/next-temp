'use client';
import { fetchDefault } from '@/services/fetchClient';

/**
 * 특정 메뉴의 breadcrumb 경로를 반환
 * 모든 사용자는 자신이 접근 가능한 메뉴만 조회 가능
 * @param menuId 메뉴 ID
 * @returns MenuResponseDto - 메뉴 breadcrumb 정보
 */
export async function getMenuBreadcrumb(menuId: number) {
  const response = await fetchDefault(`/menus/breadcrumb/${menuId}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `메뉴 breadcrumb 조회 실패(코드): ${response.status}`;
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