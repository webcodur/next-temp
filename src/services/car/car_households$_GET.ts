'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SearchCarHouseholdResidentRequest, CarHouseholdRelationsResponse } from '@/types/car';

//#region 서버 타입 정의 (파일 내부 사용)
interface CarHouseholdRelationsServerResponse {
  data: {
    id: number;
    car_id: number;
    car_instance_id: number;
    household_instance_id: number;
    resident_id: number;
    car_alarm: boolean;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    car?: {
      id: number;
      car_number: string;
      brand?: string;
      model?: string;
      type?: string;
      outer_text?: string;
      year?: number;
      external_sticker?: string;
      fuel?: string;
      total_use_number: number;
      in_out_status?: 'IN' | 'OUT';
      last_parking_device_id?: number;
      last_time?: string;
      front_image_url?: string;
      rear_image_url?: string;
      side_image_url?: string;
      top_image_url?: string;
      created_at: string;
      updated_at: string;
      deleted_at?: string;
    };
    household_instance?: {
      id: number;
      dong: string;
      ho: string;
      householder_name?: string;
      phone?: string;
      email?: string;
      move_in_date?: string;
      move_out_date?: string;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    };
    resident?: {
      id: number;
      name: string;
      phone?: string;
      email?: string;
      birth_date?: string;
      is_householder: boolean;
      relationship_type?: string;
      created_at: string;
      updated_at: string;
    };
  }[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function serverToClient(server: CarHouseholdRelationsServerResponse): CarHouseholdRelationsResponse {
  return {
    data: server.data.map(item => ({
      id: item.id,
      carId: item.car_id,
      carInstanceId: item.car_instance_id,
      householdInstanceId: item.household_instance_id,
      residentId: item.resident_id,
      carAlarm: item.car_alarm,
      isPrimary: item.is_primary,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      deletedAt: item.deleted_at,
      car: item.car ? {
        id: item.car.id,
        carNumber: item.car.car_number,
        brand: item.car.brand,
        model: item.car.model,
        type: item.car.type,
        outerText: item.car.outer_text,
        year: item.car.year,
        externalSticker: item.car.external_sticker,
        fuel: item.car.fuel,
        totalUseNumber: item.car.total_use_number,
        inOutStatus: item.car.in_out_status,
        lastParkingDeviceId: item.car.last_parking_device_id,
        lastTime: item.car.last_time,
        frontImageUrl: item.car.front_image_url,
        rearImageUrl: item.car.rear_image_url,
        sideImageUrl: item.car.side_image_url,
        topImageUrl: item.car.top_image_url,
        createdAt: item.car.created_at,
        updatedAt: item.car.updated_at,
        deletedAt: item.car.deleted_at,
      } : undefined,
      householdInstance: item.household_instance ? {
        id: item.household_instance.id,
        dong: item.household_instance.dong,
        ho: item.household_instance.ho,
        householderName: item.household_instance.householder_name,
        phone: item.household_instance.phone,
        email: item.household_instance.email,
        moveInDate: item.household_instance.move_in_date,
        moveOutDate: item.household_instance.move_out_date,
        isActive: item.household_instance.is_active,
        createdAt: item.household_instance.created_at,
        updatedAt: item.household_instance.updated_at,
      } : undefined,
      resident: item.resident ? {
        id: item.resident.id,
        name: item.resident.name,
        phone: item.resident.phone,
        email: item.resident.email,
        birthDate: item.resident.birth_date,
        isHouseholder: item.resident.is_householder,
        relationshipType: item.resident.relationship_type,
        createdAt: item.resident.created_at,
        updatedAt: item.resident.updated_at,
      } : undefined,
    })),
    total: server.total,
    page: server.page,
    limit: server.limit,
    totalPages: server.totalPages,
  };
}
//#endregion

/**
 * 차량과 세대 간의 연결 관계를 조회한다
 * @param params 검색 조건
 * @returns 차량-세대 관계 목록과 페이지 정보 (CarHouseholdRelationsResponse)
 */
export async function searchCarHouseholdRelations(params: SearchCarHouseholdResidentRequest = {}) {
  // 쿼리 파라미터 처리
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());

  const queryString = searchParams.toString();
  const url = queryString ? `/cars/households?${queryString}` : '/cars/households';
  
  const response = await fetchDefault(url, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량-세대 관계 조회 실패(코드): ${response.status}`;
    console.log(errorMsg); // 서버 출력 필수
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }

  const serverResponse = result as CarHouseholdRelationsServerResponse;
  const clientData = serverToClient(serverResponse);
  
  return {
    success: true,
    data: clientData,
  };
}