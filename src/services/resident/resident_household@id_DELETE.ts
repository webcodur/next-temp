'use client';
import { fetchDefault } from '@/services/fetchClient';

/**
 * 거주자와 세대 간의 관계를 삭제한다
 * @param id 관계 ID
 * @returns 성공/실패 정보
 */
export async function deleteResidentHousehold(id: number) {
  const response = await fetchDefault(`/residents/households/${id}`, {
    method: 'DELETE',
  });

  if (response.status === 204) {
    return {
      success: true,
      data: { message: '거주자-세대 관계가 성공적으로 삭제되었습니다.' },
    };
  }

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `거주자-세대 관계 삭제 실패 (코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  return {
    success: true,
    data: result,
  };
} 