'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CreateHouseholdRequest } from '@/types/household';

/**
 * 세대를 생성한다
 * @param data 세대 생성 데이터
 * @returns 생성된 세대 정보
 */
export async function createHousehold(data: CreateHouseholdRequest) {
  const response = await fetchDefault('/households', {
    method: 'POST',
    body: JSON.stringify(data), // 🔥 자동 변환됨 (camelCase → snake_case)
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 생성 실패(코드): ${response.status}`;
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