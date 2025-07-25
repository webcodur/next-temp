'use client';
import { fetchDefault } from '@/services/fetchClient';

/**
 * 특정 네임스페이스의 캐시 통계를 조회한다
 * @param namespace 캐시 네임스페이스
 * @returns 네임스페이스별 캐시 통계 정보 (CacheNamespaceStats)
 */
export async function getCacheStatsByNamespace(namespace: string) {
  const response = await fetchDefault(`/cache/namespace/${namespace}/stats`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `네임스페이스별 캐시 통계 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  return {
    success: true,
    data: result, // 🔥 자동 변환됨 (snake_case → camelCase) - CacheNamespaceStats 타입
  };
} 