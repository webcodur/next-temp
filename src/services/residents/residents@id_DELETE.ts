'use client';
import { fetchDefault } from '@/services/fetchClient';

export async function deleteResident(id: number) {
  const response = await fetchDefault(`/residents/${id}`, {
    method: 'DELETE',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `거주자 삭제 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  // DELETE 요청의 경우 204 처리
  if (response.status === 204) {
    return { success: true, data: { message: '삭제 완료' } };
  }
  
  return {
    success: true,
    data: result,
  };
}
