'use client';
import { fetchDefault } from '@/services/fetchClient';

/**
 * 특정 주차장에 메뉴를 할당 (이미 할당된 메뉴는 제외됨)
 * @param parkinglotId 주차장 ID
 * @param menuIds 할당할 메뉴 ID 목록
 * @returns 메뉴 할당 결과
 */
export async function assignMenuToParkingLot(parkinglotId: number, menuIds: number[]) {
  const response = await fetchDefault(`/menus/parking-lot/${parkinglotId}/assign`, {
    method: 'PUT',
    body: JSON.stringify({ menuIds }),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `주차장 메뉴 할당 실패(코드): ${response.status}`;
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