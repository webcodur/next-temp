'use client';
import { fetchDefault } from '@/services/fetchClient';
import { UpdateCarInstanceRequest, CarInstance, Car } from '@/types/car';

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
    car: server.car as Car | undefined,
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

  if (!response.ok) {
    try {
      const result = await response.json();
      const errorMsg = result.message || `차량-인스턴스 연결 수정 실패(코드): ${response.status}`;
      // console.log(errorMsg);
      return { success: false, errorMsg };
    } catch {
      return { success: false, errorMsg: `차량-인스턴스 연결 수정 실패(코드): ${response.status}` };
    }
  }
  
  // 성공 응답 처리 - 200 OK 또는 201 Created
  if (response.status === 200 || response.status === 201) {
    // 응답 내용이 있는지 확인
    const contentType = response.headers.get('content-type');
    const hasJsonContent = contentType && contentType.includes('application/json');
    
    // 응답 텍스트를 먼저 가져와서 빈 내용인지 확인
    const responseText = await response.text();
    
    if (!responseText.trim() || !hasJsonContent) {
      // 빈 응답이거나 JSON이 아닌 경우 - 기본 응답 구조로 반환
      return {
        success: true,
        data: {
          id: carInstanceId,
          carShareOnoff: data.carShareOnoff,
        } as Partial<CarInstance>,
      };
    }
    
    try {
      const result = JSON.parse(responseText);
      const serverResponse = result as CarInstanceServerResponse;
      return {
        success: true,
        data: serverToClient(serverResponse),
      };
    } catch {
      // JSON 파싱 실패 시 기본 응답
      return {
        success: true,
        data: {
          id: carInstanceId,
          carShareOnoff: data.carShareOnoff,
        } as Partial<CarInstance>,
      };
    }
  }
  
  // 다른 성공 코드의 경우도 성공으로 처리
  return {
    success: true,
    data: {
      id: carInstanceId,
      carShareOnoff: data.carShareOnoff,
    } as Partial<CarInstance>,
  };
}
