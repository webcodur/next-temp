'use client';
import { fetchDefault } from '@/services/fetchClient';

/**
 * 특정 네임스페이스의 모든 캐시를 삭제한다
 * @param namespace 삭제할 캐시 네임스페이스
 * @returns 네임스페이스 캐시 삭제 결과
 */
export async function deleteCacheNamespace(namespace: string) {
  const response = await fetchDefault(`/cache/namespace/${namespace}`, {
    method: 'DELETE',
  });

  // 204 No Content 응답의 경우 JSON 파싱하지 않음
  if (response.status === 204) {
    return {
      success: true,
      data: { message: '네임스페이스 캐시가 성공적으로 삭제되었습니다.' },
    };
  }

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `네임스페이스 캐시 삭제 실패(코드): ${response.status}`;
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