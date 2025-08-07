'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CreateCarRequest, Car } from '@/types/car';

// #region 서버 타입 정의 (내부 사용)
interface CarServerResponse {
  id: number;
  car_number: string;
  brand: string | null;
  model: string | null;
  type: string | null;
  outer_text: string | null;
  year: number | null;
  external_sticker: string | null;
  fuel: string | null;
  front_image_url: string | null;
  rear_image_url: string | null;
  side_image_url: string | null;
  top_image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface CreateCarServerRequest {
  car_number: string;
  brand?: string;
  model?: string;
  type?: string;
  outer_text?: string;
  year?: number;
  external_sticker?: string;
  fuel?: string;
  front_image_url?: string;
  rear_image_url?: string;
  side_image_url?: string;
  top_image_url?: string;
}
// #endregion

// #region 변환 함수 (내부 사용)
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
    frontImageUrl: server.front_image_url,
    rearImageUrl: server.rear_image_url,
    sideImageUrl: server.side_image_url,
    topImageUrl: server.top_image_url,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
  };
}

function clientToServer(client: CreateCarRequest): CreateCarServerRequest {
  return {
    car_number: client.carNumber,
    brand: client.brand,
    model: client.model,
    type: client.type,
    outer_text: client.outerText,
    year: client.year,
    external_sticker: client.externalSticker,
    fuel: client.fuel,
    front_image_url: client.frontImageUrl,
    rear_image_url: client.rearImageUrl,
    side_image_url: client.sideImageUrl,
    top_image_url: client.topImageUrl,
  };
}
// #endregion

export async function createCar(data: CreateCarRequest, parkinglotId?: string) {
  const serverRequest = clientToServer(data);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (parkinglotId) {
    headers['x-parkinglot-id'] = parkinglotId;
  }

  const response = await fetchDefault('/cars', {
    method: 'POST',
    headers,
    body: JSON.stringify(serverRequest),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량 생성 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  const serverResponse = result as CarServerResponse;
  return {
    success: true,
    data: serverToClient(serverResponse),
  };
}
