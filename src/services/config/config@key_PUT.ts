'use client';
import { fetchDefault } from '@/services/fetchClient';
import { UpdateSystemConfigRequest } from '@/types/api';

/**
 * 설정값을 업데이트한다
 * @param key 설정값 키
 * @param data 업데이트할 설정 데이터
 * @returns 업데이트된 설정값 정보 (SystemConfig)
 */
export async function updateConfig(key: string, data: UpdateSystemConfigRequest) {
  const response = await fetchDefault(`/configs/${key}`, {
    method: 'PUT',
    body: JSON.stringify(data), // 🔥 자동 변환됨 (camelCase → snake_case)
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `설정값 업데이트 실패(코드): ${response.status}`;
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