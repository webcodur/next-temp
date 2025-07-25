'use client';
import { fetchDefault } from '@/services/fetchClient';

/**
 * 모든 설정값을 조회한다
 * @returns 모든 설정값 목록 (SystemConfig[])
 */
export async function getAllConfigs() {
  const response = await fetchDefault('/configs', {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `모든 설정값 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  return {
    success: true,
    data: result, // 🔥 자동 변환됨 (snake_case → camelCase) - SystemConfig[] 타입
  };
} 