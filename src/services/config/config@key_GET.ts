'use client';
import { fetchDefault } from '@/services/fetchClient';

/**
 * 지정된 키의 설정값을 조회한다
 * @param key 조회할 설정 키
 * @returns 설정값 정보 (SystemConfig)
 */
export async function getConfigByKey(key: string) {
  const response = await fetchDefault(`/configs/${key}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `특정 설정값 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  return {
    success: true,
    data: result, // 🔥 자동 변환됨 (snake_case → camelCase) - SystemConfig 타입
  };
} 