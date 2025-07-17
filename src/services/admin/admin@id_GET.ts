'use server';

import { fetchDefault } from '../fetchClient';

/**
 * 관리자 상세 조회
 * @param id 관리자 ID
 * @returns 관리자 상세 정보
 */
export async function getAdminDetail({
  id
}: {
  id: number;
}) {
  const response = await fetchDefault(`/admins/${id}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `관리자 상세 조회 실패(코드): ${response.status}`
    console.log(errorMsg)
    return {
      success: false,
      errorMsg: errorMsg,
    }
  }
  
  return {
    success: true,
    data: result,
  }
} 