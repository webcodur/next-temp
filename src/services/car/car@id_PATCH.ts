'use client';
import { fetchDefault } from '@/services/fetchClient';
import { UpdateCarRequest, Car } from '@/types/car';

//#region 서버 타입 정의 (파일 내부 사용)
interface UpdateCarServerRequest {
  car_number?: string;           // snake_case
  brand?: string;
  model?: string;
  type?: string;
  outer_text?: string;           // snake_case
  year?: number;
  external_sticker?: string;     // snake_case
  fuel?: string;
  in_out_status?: 'IN' | 'OUT';  // snake_case
  last_parking_device_id?: number; // snake_case
  front_image_url?: string;      // snake_case
  rear_image_url?: string;       // snake_case
  side_image_url?: string;       // snake_case
  top_image_url?: string;        // snake_case
  last_time?: string;            // snake_case
}

interface CarServerResponse {
  id: number;
  car_number: string;            // snake_case
  brand?: string;
  model?: string;
  type?: string;
  outer_text?: string;           // snake_case
  year?: number;
  external_sticker?: string;     // snake_case
  fuel?: string;
  total_use_number: number;      // snake_case
  in_out_status?: 'IN' | 'OUT';  // snake_case
  last_parking_device_id?: number; // snake_case
  last_time?: string;            // snake_case
  front_image_url?: string;      // snake_case
  rear_image_url?: string;       // snake_case
  side_image_url?: string;       // snake_case
  top_image_url?: string;        // snake_case
  created_at: string;            // snake_case
  updated_at: string;            // snake_case
  deleted_at?: string;           // snake_case
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function clientToServer(client: UpdateCarRequest): UpdateCarServerRequest {
  return {
    car_number: client.carNumber,
    brand: client.brand,
    model: client.model,
    type: client.type,
    outer_text: client.outerText,
    year: client.year,
    external_sticker: client.externalSticker,
    fuel: client.fuel,
    in_out_status: client.inOutStatus,
    last_parking_device_id: client.lastParkingDeviceId,
    front_image_url: client.frontImageUrl,
    rear_image_url: client.rearImageUrl,
    side_image_url: client.sideImageUrl,
    top_image_url: client.topImageUrl,
    last_time: client.lastTime,
  };
}

function serverToClient(server: CarServerResponse): Car {
  return {
    id: server.id,
    carNumber: server.car_number,
    brand: server.brand,
    model: server.model,
    type: server.type,
    outerText: server.outer_text,
    year: server.year,
    externalSticker: server.external_sticker,
    fuel: server.fuel,
    totalUseNumber: server.total_use_number,
    inOutStatus: server.in_out_status,
    lastParkingDeviceId: server.last_parking_device_id,
    lastTime: server.last_time,
    frontImageUrl: server.front_image_url,
    rearImageUrl: server.rear_image_url,
    sideImageUrl: server.side_image_url,
    topImageUrl: server.top_image_url,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
    deletedAt: server.deleted_at,
  };
}
//#endregion

/**
 * 차량 정보를 수정한다
 * @param id 차량 ID
 * @param data 수정할 차량 데이터
 * @returns 수정된 차량 정보 (Car)
 */
export async function updateCar(id: number, data: UpdateCarRequest) {
  const serverRequest = clientToServer(data);

  const response = await fetchDefault(`/cars/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(serverRequest),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량 정보 수정 실패(코드): ${response.status}`;
    console.log(errorMsg); // 서버 출력 필수
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }

  const serverResponse = result as CarServerResponse;
  const clientData = serverToClient(serverResponse);
  
  return {
    success: true,
    data: clientData,
  };
}