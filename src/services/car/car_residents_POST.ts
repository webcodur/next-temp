'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CreateCarHouseholdResidentRequest } from '@/types/car';

//#region 서버 타입 정의 (파일 내부 사용)
interface CreateCarHouseholdResidentServerRequest {
  car_instance_id: number;       // snake_case
  resident_id: number;           // snake_case
  car_alarm?: boolean;           // snake_case
  is_primary?: boolean;          // snake_case
}

interface CarHouseholdResidentServerResponse {
  message?: string;
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function clientToServer(client: CreateCarHouseholdResidentRequest): CreateCarHouseholdResidentServerRequest {
  return {
    car_instance_id: client.carInstanceId,
    resident_id: client.residentId,
    car_alarm: client.carAlarm,
    is_primary: client.isPrimary,
  };
}

function serverToClient(server: CarHouseholdResidentServerResponse) {
  return {
    message: server.message,
  };
}
//#endregion

/**
 * 차량과 거주자 간의 연결 관계를 생성한다
 * @param data 차량-거주자 연결 데이터
 * @returns 연결 성공 여부
 */
export async function createCarResidentRelation(data: CreateCarHouseholdResidentRequest) {
  const serverRequest = clientToServer(data);

  const response = await fetchDefault('/cars/residents', {
    method: 'POST',
    body: JSON.stringify(serverRequest),
  });

  if (response.status === 201) {
    return {
      success: true,
      data: { message: '차량-거주자 연결이 성공적으로 완료되었습니다.' },
    };
  }

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량-거주자 연결 실패(코드): ${response.status}`;
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