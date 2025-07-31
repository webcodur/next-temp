'use client';
import { fetchDefault } from '@/services/fetchClient';
import { UpdateCarRequest, Car } from '@/types/car';

/**
 * 차량 정보를 수정한다
 * @param id 차량 ID
 * @param data 수정할 차량 데이터
 * @returns 수정된 차량 정보 (Car)
 */
export async function updateCar(id: number, data: UpdateCarRequest) {
  const response = await fetchDefault(`/cars/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data), // 🔥 자동 변환됨 (camelCase → snake_case)
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량 정보 수정 실패(코드): ${response.status}`;
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