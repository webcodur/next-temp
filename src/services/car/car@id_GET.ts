'use client';
import { fetchDefault } from '@/services/fetchClient';
import { Car } from '@/types/car';

//#region 서버 타입 정의 (파일 내부 사용)
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
 * 특정 차량의 상세 정보를 조회한다
 * @param id 차량 ID
 * @returns 차량 상세 정보 (Car)
 */
export async function getCarDetail(id: number) {
  const response = await fetchDefault(`/cars/${id}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량 상세 조회 실패(코드): ${response.status}`;
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