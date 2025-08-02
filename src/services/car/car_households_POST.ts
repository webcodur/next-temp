'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CreateCarHouseholdRequest } from '@/types/car';

//#region 서버 타입 정의 (파일 내부 사용)
interface CreateCarHouseholdServerRequest {
  car_number: string;            // snake_case
  instance_id: number;           // snake_case
  car_share_onoff?: boolean;     // snake_case
}

interface CarHouseholdServerResponse {
  message?: string;
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function clientToServer(client: CreateCarHouseholdRequest): CreateCarHouseholdServerRequest {
  return {
    car_number: client.carNumber,
    instance_id: client.instanceId,
    car_share_onoff: client.carShareOnoff,
  };
}

function serverToClient(server: CarHouseholdServerResponse) {
  return {
    message: server.message,
  };
}
//#endregion

/**
 * 차량을 세대 인스턴스에 연결한다
 * @param data 차량-세대 연결 데이터
 * @returns 연결 성공 여부
 */
export async function createCarHouseholdRelation(data: CreateCarHouseholdRequest) {
  const serverRequest = clientToServer(data);

  const response = await fetchDefault('/cars/households', {
    method: 'POST',
    body: JSON.stringify(serverRequest),
  });

  if (response.status === 201) {
    return {
      success: true,
      data: { message: '차량-세대 연결이 성공적으로 완료되었습니다.' },
    };
  }

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량-세대 연결 실패(코드): ${response.status}`;
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