'use client';
import { fetchDefault } from '@/services/fetchClient';

// 특정 관리자 계정의 상세 정보를 조회한다
export async function getAdminDetail(
  { id }: { id: number }
) {
  const response = await fetchDefault(`/admin/${id}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `관리자 상세 조회 실패(코드): ${response.status}`;
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