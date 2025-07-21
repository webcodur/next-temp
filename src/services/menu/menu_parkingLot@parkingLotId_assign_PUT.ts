'use client';

import { fetchDefault } from '../fetchClient';

/**
 * 주차장에 메뉴 할당
 * @param parkingLotId 주차장 ID
 * @param menuIds 할당할 메뉴 ID 목록
 * @returns 할당 결과
 */
export async function updateMenuParkingLotAssign({
  parkingLotId,
  menuIds
}: {
  parkingLotId: string;
  menuIds: string[];
}) {
  const response = await fetchDefault(`/menus/parking-lot/${parkingLotId}/assign`, {
    method: 'PUT',
    body: JSON.stringify({
      menuIds
    }),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `메뉴 할당 실패(코드): ${response.status}`
    console.log(errorMsg)
    return {
      success: false,
      errorMsg: errorMsg,
    }
  }
  
  return {
    success: true,
    data: result,
  }
} 