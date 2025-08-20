'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CreateCarInstanceResidentRequest } from '@/types/car';

// #region 서버 타입 정의 (내부 사용)
interface CreateCarInstanceResidentServerRequest {
  car_instance_id: number;
  resident_id: number;
  car_alarm?: boolean;
  is_primary?: boolean;
}
// #endregion

// #region 변환 함수 (내부 사용)
function clientToServer(client: CreateCarInstanceResidentRequest): CreateCarInstanceResidentServerRequest {
  return {
    car_instance_id: client.carInstanceId,
    resident_id: client.residentId,
    car_alarm: client.carAlarm,
    is_primary: client.isPrimary,
  };
}
// #endregion

export async function createCarInstanceResident(data: CreateCarInstanceResidentRequest, parkinglotId?: string) {
  const serverRequest = clientToServer(data);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (parkinglotId) {
    headers['x-parkinglot-id'] = parkinglotId;
  }

  const response = await fetchDefault('/cars/residents', {
    method: 'POST',
    headers,
    body: JSON.stringify(serverRequest),
  });

  if (!response.ok) {
    try {
      const result = await response.json();
      const errorMsg = result.message || `차량-주민 연결 생성 실패(코드): ${response.status}`;
      console.log(errorMsg);
      return { success: false, errorMsg };
    } catch {
      // JSON 파싱 실패 시 기본 에러 메시지
      return { success: false, errorMsg: `차량-주민 연결 생성 실패(코드): ${response.status}` };
    }
  }
  
  // 성공 응답 처리 - 201 Created 또는 200 OK
  if (response.status === 201 || response.status === 200) {
    // 응답 내용이 있는지 확인
    const contentType = response.headers.get('content-type');
    const hasJsonContent = contentType && contentType.includes('application/json');
    
    // 응답 텍스트를 먼저 가져와서 빈 내용인지 확인
    const responseText = await response.text();
    
    if (!responseText.trim() || !hasJsonContent) {
      // 빈 응답이거나 JSON이 아닌 경우
      return { success: true, data: { message: '연결 완료' } };
    }
    
    try {
      const result = JSON.parse(responseText);
      return {
        success: true,
        data: result,
      };
    } catch {
      // JSON 파싱 실패 시에도 성공으로 처리 (POST 요청이 성공했으므로)
      return { success: true, data: { message: '연결 완료' } };
    }
  }
  
  return { success: true, data: { message: '연결 완료' } };
}
