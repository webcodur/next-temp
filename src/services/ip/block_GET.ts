'use client';
import { fetchDefault } from '@/services/fetchClient';

/**
 * Redis에 저장된 모든 차단된 IP 주소와 상세 정보를 조회한다
 * @returns 차단된 IP 목록 (IpBlock[])
 */
export async function getBlockedIpList() {
  const response = await fetchDefault('/ip/block', {
    method: 'GET',
  });

  const result = await response.json();
  if (!response.ok) {
    const errorMsg = result.message || `차단된 IP 목록 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  return {
    success: true,
    data: result, // 🔥 자동 변환됨 (snake_case → camelCase) - IpBlock[] 타입
  };
} 