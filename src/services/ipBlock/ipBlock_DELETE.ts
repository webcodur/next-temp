'use client';
import { fetchDefault } from '@/services/fetchClient';

/**
 * Redis에 저장된 모든 차단된 IP 주소를 해제한다
 * @returns 모든 IP 차단 해제 결과
 */
export async function deleteAllBlockedIp() {
  const response = await fetchDefault('/ip/block', {
    method: 'DELETE',
  });

  // 204 No Content 응답의 경우 JSON 파싱하지 않음
  if (response.status === 204) {
    return {
      success: true,
      data: { message: '모든 IP 차단이 성공적으로 해제되었습니다.' },
    };
  }

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `모든 IP 차단 해제 실패(코드): ${response.status}`;
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