'use client';
import { fetchDefault } from '@/services/fetchClient';

/**
 * 전체 캐시 상태와 통계를 조회한다
 * @returns 캐시 통계 정보 (CacheStats)
 */
export async function getCacheStats() {
  const response = await fetchDefault('/cache/stats', {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `캐시 통계 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  return {
    success: true,
    data: result, // 🔥 자동 변환됨 (snake_case → camelCase) - CacheStats 타입
  };
} 