'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SearchCarRequest, CarListResponse, CarWithHousehold } from '@/types/car';

//#region 서버 타입 정의 (파일 내부 사용)
interface CarWithHouseholdServerResponse {
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
  car_household?: {
    id: number;
    car_id: number;              // snake_case
    household_instance_id: number; // snake_case
    created_at: string;          // snake_case
    updated_at: string;          // snake_case
    deleted_at?: string;         // snake_case
    household_instance: {
      id: number;
      code: string;
      name: string;
      description?: string;
    }[];
  }[];
}

interface CarListServerResponse {
  data: CarWithHouseholdServerResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function buildServerQueryParams(client: SearchCarRequest): URLSearchParams {
  const searchParams = new URLSearchParams();
  if (client.page) searchParams.append('page', client.page.toString());
  if (client.limit) searchParams.append('limit', client.limit.toString());
  if (client.carNumber) searchParams.append('car_number', client.carNumber);
  if (client.brand) searchParams.append('brand', client.brand);
  if (client.model) searchParams.append('model', client.model);
  if (client.type) searchParams.append('type', client.type);
  if (client.fuel) searchParams.append('fuel', client.fuel);
  if (client.yearFrom) searchParams.append('year_from', client.yearFrom.toString());
  if (client.yearTo) searchParams.append('year_to', client.yearTo.toString());
  if (client.inOutStatus) searchParams.append('in_out_status', client.inOutStatus);
  if (client.householdInstanceId) searchParams.append('household_instance_id', client.householdInstanceId.toString());
  if (client.residentId) searchParams.append('resident_id', client.residentId.toString());
  if (client.status) searchParams.append('status', client.status);
  return searchParams;
}

function serverToClient(server: CarWithHouseholdServerResponse): CarWithHousehold {
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
    carHousehold: server.car_household?.map(ch => ({
      id: ch.id,
      carId: ch.car_id,
      householdInstanceId: ch.household_instance_id,
      createdAt: ch.created_at,
      updatedAt: ch.updated_at,
      deletedAt: ch.deleted_at,
      householdInstance: ch.household_instance,
    })) || [],
  };
}

function searchResponseToClient(server: CarListServerResponse): CarListResponse {
  return {
    data: server.data.map(serverToClient),
    total: server.total,
    page: server.page,
    limit: server.limit,
    totalPages: server.totalPages,
  };
}
//#endregion

/**
 * 차량 목록을 조회한다 (검색 포함)
 * @param params 검색 조건
 * @returns 차량 목록과 페이지 정보 (CarListResponse)
 */
export async function searchCar(params: SearchCarRequest = {}) {
  const searchParams = buildServerQueryParams(params);
  const queryString = searchParams.toString();
  const url = queryString ? `/cars?${queryString}` : '/cars';
  
  const response = await fetchDefault(url, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량 목록 조회 실패(코드): ${response.status}`;
    console.log(errorMsg); // 서버 출력 필수
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }

  const serverResponse = result as CarListServerResponse;
  const clientData = searchResponseToClient(serverResponse);
  
  return {
    success: true,
    data: clientData,
  };
}