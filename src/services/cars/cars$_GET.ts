'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SearchCarParams, CarListResponse, CarWithInstance } from '@/types/car';

// Instance 타입 정의
interface Instance {
  id: number;
  [key: string]: unknown;
}

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

interface CarInstanceServerResponse {
  id: number;
  car_number: string;
  instance_id: number;
  car_share_onoff: boolean;
  created_at: string;
  updated_at: string;
  car?: CarServerResponse;
  instance?: Record<string, unknown>;
}

interface CarWithInstanceServerResponse extends CarServerResponse {
  car_instance: CarInstanceServerResponse[];
}

interface PaginatedServerResponse {
  data: CarWithInstanceServerResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: CarWithInstanceServerResponse): CarWithInstance {
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
    carInstance: server.car_instance.map(instance => ({
      id: instance.id,
      carNumber: instance.car_number,
      instanceId: instance.instance_id,
      carShareOnoff: instance.car_share_onoff,
      createdAt: instance.created_at,
      updatedAt: instance.updated_at,
      car: instance.car ? {
        id: instance.car.id,
        carNumber: instance.car.car_number,
        brand: instance.car.brand,
        model: instance.car.model,
        type: instance.car.type,
        outerText: instance.car.outer_text,
        year: instance.car.year,
        externalSticker: instance.car.external_sticker,
        fuel: instance.car.fuel,
        frontImageUrl: instance.car.front_image_url,
        rearImageUrl: instance.car.rear_image_url,
        sideImageUrl: instance.car.side_image_url,
        topImageUrl: instance.car.top_image_url,
        createdAt: instance.car.created_at,
        updatedAt: instance.car.updated_at,
      } : undefined,
      instance: instance.instance as Instance | undefined,
    })),
  };
}
// #endregion

export async function searchCars(params?: SearchCarParams, parkinglotId?: string) {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.carNumber) searchParams.append('car_number', params.carNumber);
  if (params?.brand) searchParams.append('brand', params.brand);
  if (params?.model) searchParams.append('model', params.model);
  if (params?.type) searchParams.append('type', params.type);
  if (params?.fuel) searchParams.append('fuel', params.fuel);
  if (params?.yearFrom) searchParams.append('year_from', params.yearFrom);
  if (params?.yearTo) searchParams.append('year_to', params.yearTo);
  if (params?.instanceId) searchParams.append('instance_id', params.instanceId.toString());
  if (params?.residentId) searchParams.append('resident_id', params.residentId);
  if (params?.status) searchParams.append('status', params.status);

  const headers: Record<string, string> = {};
  if (parkinglotId) {
    headers['x-parkinglot-id'] = parkinglotId;
  }

  const url = `/cars${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const response = await fetchDefault(url, {
    method: 'GET',
    headers,
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량 목록 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  const serverResponse = result as PaginatedServerResponse;
  const clientResponse: CarListResponse = {
    data: serverResponse.data.map(serverToClient),
    total: serverResponse.total,
    page: serverResponse.page,
    limit: serverResponse.limit,
    totalPages: serverResponse.totalPages,
  };

  return {
    success: true,
    data: clientResponse,
  };
}
