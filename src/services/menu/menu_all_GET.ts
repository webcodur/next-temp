'use client';
import { fetchDefault } from '@/services/fetchClient';

/**
 * 시스템의 모든 메뉴를 계층 구조로 반환 (관리자 권한 필요)
 * @returns MenuListResponseDto - 모든 메뉴 목록
 */
export async function getAllMenuList() {
  const response = await fetchDefault('/menus/all', {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `모든 메뉴 조회 실패(코드): ${response.status}`;
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