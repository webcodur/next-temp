'use client';
import { fetchDefault } from '../fetchClient';
import { snakeToCamel } from '@/utils/caseConverter';

// 시스템 관리자가 계정 ID로 관리자 계정을 삭제한다
export async function deleteAdmin(
  { id }: { id: number }
) {
  const response = await fetchDefault(`/admins/${id}`, {
    method: 'DELETE',
  });

  // 204 No Content 응답의 경우 JSON 파싱하지 않음
  if (response.status === 204) {
    return {
      success: true,
      data: { message: '관리자 계정이 성공적으로 삭제되었습니다.' },
    };
  }

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `관리자 계정 삭제 실패(코드): ${response.status}`;
    console.log(errorMsg);
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