'use client';
import { fetchDefault } from '@/services/fetchClient';
import { UpdateCarHouseholdResidentRequest, CarHouseholdResident } from '@/types/car';

//#region 서버 타입 정의 (파일 내부 사용)
interface UpdateCarHouseholdResidentServerRequest {
  car_alarm?: boolean;           // snake_case
  is_primary?: boolean;          // snake_case
}

interface CarHouseholdResidentServerResponse {
  id: number;
  car_instance_id: number;       // snake_case
  resident_id: number;           // snake_case
  car_alarm: boolean;            // snake_case
  is_primary: boolean;           // snake_case
  created_at: string;            // snake_case
  updated_at: string;            // snake_case
  deleted_at?: string;           // snake_case
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function clientToServer(client: UpdateCarHouseholdResidentRequest): UpdateCarHouseholdResidentServerRequest {
  return {
    car_alarm: client.carAlarm,
    is_primary: client.isPrimary,
  };
}

function serverToClient(server: CarHouseholdResidentServerResponse): CarHouseholdResident {
  return {
    id: server.id,
    carInstanceId: server.car_instance_id,
    residentId: server.resident_id,
    carAlarm: server.car_alarm,
    isPrimary: server.is_primary,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
    deletedAt: server.deleted_at,
  };
}
//#endregion

/**
 * 차량과 거주자 간의 연결 관계를 수정한다
 * @param id 차량-거주자 연결 ID
 * @param data 수정할 데이터
 * @returns 수정된 차량-거주자 연결 정보 (CarHouseholdResident)
 */
export async function updateCarResidentRelation(id: number, data: UpdateCarHouseholdResidentRequest) {
  const serverRequest = clientToServer(data);

  const response = await fetchDefault(`/cars/residents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(serverRequest),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량-거주자 연결 수정 실패(코드): ${response.status}`;
    console.log(errorMsg); // 서버 출력 필수
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }

  const serverResponse = result as CarHouseholdResidentServerResponse;
  const clientData = serverToClient(serverResponse);
  
  return {
    success: true,
    data: clientData,
  };
}