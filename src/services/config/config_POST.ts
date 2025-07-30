'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CreateSystemConfigRequest } from '@/types/api';

/**
 * 새로운 시스템 설정을 생성한다
 * @param data 생성할 설정 데이터
 * @returns 생성된 설정값 정보 (SystemConfig)
 */
export async function createConfig(data: CreateSystemConfigRequest) {
  const response = await fetchDefault('/configs', {
    method: 'POST',
    body: JSON.stringify(data), // 🔥 자동 변환됨 (camelCase → snake_case)
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `설정값 생성 실패(코드): ${response.status}`;
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