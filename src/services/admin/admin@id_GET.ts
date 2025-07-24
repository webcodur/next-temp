'use client';
import { fetchDefault } from '../fetchClient';
import { snakeToCamel } from '@/utils/caseConverter';

// 관리자 계정 정보를 조회한다
export async function getAdminDetail(
  { id }: { id: number }
) {
  const url = `/admins/${id}`;
  console.log('getAdminDetail 요청 URL:', url, 'ID:', id, 'ID 타입:', typeof id);

  const response = await fetchDefault(url, {
    method: 'GET',
  });

  console.log('getAdminDetail 응답 상태:', response.status, response.statusText);
  
  const result = await response.json();
  console.log('getAdminDetail 응답 데이터:', result);
  
  if (!response.ok) {
    const errorMsg = result.message || `관리자 계정 상세 조회 실패(코드): ${response.status}`;
    console.log('getAdminDetail 오류:', errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  return {
    success: true,
    data: snakeToCamel(result), // 🔥 snake_case → camelCase 변환
  };
} 