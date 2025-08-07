'use client';
import { fetchDefault } from '@/services/fetchClient';
import { UpdateCarInstanceRequest, CarInstance } from '@/types/car';

// Instance 타입 정의
interface Instance {
  id: number;
  [key: string]: unknown;
}

// #region 서버 타입 정의 (내부 사용)
interface CarInstanceServerResponse {
  id: number;
  car_number: string;
  instance_id: number;
  car_share_onoff: boolean;
  created_at: string;
  updated_at: string;
  car?: Record<string, unknown>;
  instance?: Record<string, unknown>;
}

interface UpdateCarInstanceServerRequest {
  car_share_onoff?: boolean;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: CarInstanceServerResponse): CarInstance {
  return {
    id: server.id,
    carNumber: server.car_number,
    instanceId: server.instance_id,
    carShareOnoff: server.car_share_onoff,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
    car: server.car as Record<string, unknown>,
    instance: server.instance as Instance | undefined,
  };
}

function clientToServer(client: UpdateCarInstanceRequest): UpdateCarInstanceServerRequest {
  return {
    car_share_onoff: client.carShareOnoff,
  };
}
// #endregion

export async function updateCarInstance(carInstanceId: number, data: UpdateCarInstanceRequest, parkinglotId?: string) {
  const serverRequest = clientToServer(data);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (parkinglotId) {
    headers['x-parkinglot-id'] = parkinglotId;
  }

  const response = await fetchDefault(`/cars/instances/${carInstanceId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(serverRequest),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량-인스턴스 연결 수정 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  const serverResponse = result as CarInstanceServerResponse;
  return {
    success: true,
    data: serverToClient(serverResponse),
  };
}
