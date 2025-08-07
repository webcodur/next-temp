'use client';
import { fetchDefault } from '@/services/fetchClient';

export async function deleteCarInstance(carInstanceId: number, parkinglotId?: string) {
  const headers: Record<string, string> = {};
  
  if (parkinglotId) {
    headers['x-parkinglot-id'] = parkinglotId;
  }

  const response = await fetchDefault(`/cars/instances/${carInstanceId}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    const result = await response.json();
    const errorMsg = result.message || `차량-인스턴스 연결 삭제 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  // DELETE 요청의 경우 204 처리
  if (response.status === 204) {
    return { success: true, data: { message: '삭제 완료' } };
  }
  
  const result = await response.json();
  return {
    success: true,
    data: result,
  };
}
