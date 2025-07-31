'use client';
import { fetchDefault } from '@/services/fetchClient';

/**
 * 차량을 삭제한다 (소프트 삭제)
 * @param id 차량 ID
 * @returns 삭제 성공 여부
 */
export async function deleteCar(id: number) {
  const response = await fetchDefault(`/cars/${id}`, {
    method: 'DELETE',
  });

  if (response.status === 204) {
    return {
      success: true,
      data: { message: '차량이 성공적으로 삭제되었습니다.' },
    };
  }

  const result = await response.json();
  const errorMsg = result.message || `차량 삭제 실패(코드): ${response.status}`;
  console.log(errorMsg); // 서버 출력 필수
  return {
    success: false,
    errorMsg: errorMsg,
  };
}