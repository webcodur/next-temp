'use client';
import { fetchDefault } from '@/services/fetchClient';
import { camelToSnake, snakeToCamel } from '@/utils/caseConverter';

/**
 * 여러 주차장에 메뉴를 일괄로 할당 (이미 할당된 조합은 제외됨)
 * @param parkingLotIds 대상 주차장 ID 목록
 * @param menuIds 할당할 메뉴 ID 목록
 * @returns 일괄 할당 결과
 */
export async function bulkAssignMenuToParkingLots(parkingLotIds: number[], menuIds: number[]) {
  const response = await fetchDefault('/menus/parking-lots/bulk-assign', {
    method: 'PUT',
    body: JSON.stringify(camelToSnake({ parkingLotIds, menuIds })), // 🔥 camelCase → snake_case 변환
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `여러 주차장 메뉴 일괄 할당 실패(코드): ${response.status}`;
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