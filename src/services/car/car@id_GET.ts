'use client';
import { fetchDefault } from '@/services/fetchClient';
import { Car } from '@/types/car';

/**
 * 특정 차량의 상세 정보를 조회한다
 * @param id 차량 ID
 * @returns 차량 상세 정보 (Car)
 */
export async function getCarDetail(id: number) {
  const response = await fetchDefault(`/cars/${id}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량 상세 조회 실패(코드): ${response.status}`;
    console.log(errorMsg); // 서버 출력 필수
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  return {
    success: true,
    data: result, // 🔥 자동 변환됨 (snake_case → camelCase) - Car 타입
  };
}