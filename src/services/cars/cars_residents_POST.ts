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
    const result = await response.json();
    const errorMsg = result.message || `차량-거주자 연결 생성 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  return { success: true, data: { message: '연결 완료' } };
}
