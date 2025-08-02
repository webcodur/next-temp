'use client';
import { fetchDefault } from '@/services/fetchClient';
import { UpdateCarHouseholdRequest, CarHousehold } from '@/types/car';

//#region 서버 타입 정의 (파일 내부 사용)
interface UpdateCarHouseholdServerRequest {
  car_share_onoff?: boolean;     // snake_case
}

interface CarHouseholdServerResponse {
  id: number;
  car_id: number;                // snake_case
  instance_id: number;           // snake_case
  car_share_onoff: boolean;      // snake_case
  created_at: string;            // snake_case
  updated_at: string;            // snake_case
  deleted_at?: string;           // snake_case
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function clientToServer(client: UpdateCarHouseholdRequest): UpdateCarHouseholdServerRequest {
  return {
    car_share_onoff: client.carShareOnoff,
  };
}

function serverToClient(server: CarHouseholdServerResponse): CarHousehold {
  return {
    id: server.id,
    carId: server.car_id,
    instanceId: server.instance_id,
    carShareOnoff: server.car_share_onoff,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
    deletedAt: server.deleted_at,
  };
}
//#endregion

/**
 * 차량과 세대 간의 연결 관계를 수정한다
 * @param id 차량-세대 연결 ID
 * @param data 수정할 데이터
 * @returns 수정된 차량-세대 연결 정보 (CarHousehold)
 */
export async function updateCarHouseholdRelation(id: number, data: UpdateCarHouseholdRequest) {
  const serverRequest = clientToServer(data);

  const response = await fetchDefault(`/cars/households/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(serverRequest),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량-세대 연결 수정 실패(코드): ${response.status}`;
    console.log(errorMsg); // 서버 출력 필수
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }

  const serverResponse = result as CarHouseholdServerResponse;
  const clientData = serverToClient(serverResponse);
  
  return {
    success: true,
    data: clientData,
  };
}