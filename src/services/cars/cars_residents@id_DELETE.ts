'use client';
import { fetchDefault } from '@/services/fetchClient';

export async function deleteCarInstanceResident(carInstanceResidentId: number, parkinglotId?: string) {
  const headers: Record<string, string> = {};
  
  if (parkinglotId) {
    headers['x-parkinglot-id'] = parkinglotId;
  }

  const response = await fetchDefault(`/cars/residents/${carInstanceResidentId}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    try {
      const result = await response.json();
      const errorMsg = result.message || `차량-주민 연결 삭제 실패(코드): ${response.status}`;
      console.error('차량-주민 연결 삭제 실패:', result);
      return { success: false, errorMsg };
    } catch (parseError) {
      const errorMsg = `차량-주민 연결 삭제 실패(코드): ${response.status}`;
      console.error('차량-주민 연결 삭제 파싱 오류:', parseError);
      return { success: false, errorMsg };
    }
  }
  
  // DELETE 요청의 경우 204 No Content 또는 빈 응답 처리
  if (response.status === 204) {
    return { success: true, data: { message: '삭제 완료' } };
  }
  
  // 응답 내용이 있는지 확인
  const contentType = response.headers.get('content-type');
  const hasJsonContent = contentType && contentType.includes('application/json');
  
  // 응답 텍스트를 먼저 가져와서 빈 내용인지 확인
  const responseText = await response.text();
  
  if (!responseText.trim() || !hasJsonContent) {
    // 빈 응답이거나 JSON이 아닌 경우
    return { success: true, data: { message: '삭제 완료' } };
  }
  
  try {
    const result = JSON.parse(responseText);
    return {
      success: true,
      data: result,
    };
  } catch {
    // JSON 파싱 실패 시에도 성공으로 처리 (DELETE 요청이므로)
    return { success: true, data: { message: '삭제 완료' } };
  }
}
