'use client';
import { fetchDefault } from '@/services/fetchClient';

export async function processExpiredBlacklists() {
  const response = await fetchDefault('/blacklists/process-expired', {
    method: 'POST',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `만료된 블랙리스트 자동 해제 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  // 201 응답 처리
  if (response.status === 201) {
    return { success: true, data: { message: '만료된 블랙리스트 자동 해제 완료' } };
  }
  
  return {
    success: true,
    data: result,
  };
}