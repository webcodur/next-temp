'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CarHouseholdResidentWithRelations } from '@/types/car';

/**
 * 세대의 특정 차량의 등록된 사용자 목록 및 설정을 조회한다
 * @param carId 차량 ID
 * @returns 세대 차량 상세 정보 (CarHouseholdResidentWithRelations)
 */
export async function getCarHouseholdUsersSettings(carId: number) {
  const response = await fetchDefault(`/cars/household/${carId}/users-settings`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 차량 상세 조회 실패(코드): ${response.status}`;
    console.log(errorMsg); // 서버 출력 필수
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  return {
    success: true,
    data: result, // 🔥 자동 변환됨 (snake_case → camelCase) - CarHouseholdResidentWithRelations 타입
  };
}