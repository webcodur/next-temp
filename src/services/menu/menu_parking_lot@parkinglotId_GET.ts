'use client';
import { fetchDefault } from '@/services/fetchClient';

/**
 * 특정 주차장에 할당된 메뉴 목록을 계층 구조로 반환
 * @param parkinglotId 주차장 ID
 * @returns ParkingLotMenuResponseDto - 주차장 정보와 할당된 메뉴 목록
 */
export async function getParkingLotMenuList(parkinglotId: number) {
  const response = await fetchDefault(`/menus/parking-lot/${parkinglotId}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `주차장별 메뉴 조회 실패(코드): ${response.status}`;
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