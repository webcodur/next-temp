'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CreateCarHouseholdRequest } from '@/types/car';

/**
 * 차량을 세대 인스턴스에 연결한다
 * @param data 차량-세대 연결 데이터
 * @returns 연결 성공 여부
 */
export async function createCarHouseholdRelation(data: CreateCarHouseholdRequest) {
  const response = await fetchDefault('/cars/household-relation', {
    method: 'POST',
    body: JSON.stringify(data), // 🔥 자동 변환됨 (camelCase → snake_case)
  });

  if (response.status === 201) {
    return {
      success: true,
      data: { message: '차량-세대 연결이 성공적으로 완료되었습니다.' },
    };
  }

  const result = await response.json();
  const errorMsg = result.message || `차량-세대 연결 실패(코드): ${response.status}`;
  console.log(errorMsg); // 서버 출력 필수
  return {
    success: false,
    errorMsg: errorMsg,
  };
}