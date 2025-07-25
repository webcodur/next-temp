'use client';
import { fetchDefault } from '@/services/fetchClient';

/**
 * 특정 주차장에서 메뉴를 제거
 * @param parkinglot_id 주차장 ID
 * @param menuIds 제거할 메뉴 ID 목록
 * @returns 메뉴 제거 결과
 */
export async function removeMenuFromParkingLot(parkinglot_id: number, menuIds: number[]) {
  const response = await fetchDefault(`/menus/parkinglot/${parkinglot_id}/remove`, {
    method: 'PUT',
    body: JSON.stringify({ menuIds }), // 🔥 자동 변환됨 (camelCase → snake_case)
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `주차장 메뉴 제거 실패(코드): ${response.status}`;
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