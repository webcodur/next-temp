'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CreateCarInstanceRequest } from '@/types/car';

// #region 서버 타입 정의 (내부 사용)
interface CreateCarInstanceServerRequest {
  car_number: string;
  instance_id: number;
  car_share_onoff?: boolean;
}
// #endregion

// #region 변환 함수 (내부 사용)
function clientToServer(client: CreateCarInstanceRequest): CreateCarInstanceServerRequest {
  return {
    car_number: client.carNumber,
    instance_id: client.instanceId,
    car_share_onoff: client.carShareOnoff,
  };
}
// #endregion

export async function createCarInstance(data: CreateCarInstanceRequest, parkinglotId?: string) {
  const serverRequest = clientToServer(data);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (parkinglotId) {
    headers['x-parkinglot-id'] = parkinglotId;
  }

  const response = await fetchDefault('/cars/instances', {
    method: 'POST',
    headers,
    body: JSON.stringify(serverRequest),
  });

  if (!response.ok) {
    const result = await response.json();
    const errorMsg = result.message || `차량-인스턴스 연결 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  return { success: true, data: { message: '연결 완료' } };
}
