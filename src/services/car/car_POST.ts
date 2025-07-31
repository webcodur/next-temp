'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CreateCarRequest, Car } from '@/types/car';

/**
 * 차량을 생성한다 (존재하면 반환, 없으면 새로 생성)
 * @param data 차량 생성 데이터
 * @returns 생성된 차량 정보 (Car)
 */
export async function createCar(data: CreateCarRequest) {
  const response = await fetchDefault('/cars', {
    method: 'POST',
    body: JSON.stringify(data), // 🔥 자동 변환됨 (camelCase → snake_case)
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량 생성 실패(코드): ${response.status}`;
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