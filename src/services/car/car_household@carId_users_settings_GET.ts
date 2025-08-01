'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CarHouseholdResidentWithRelations } from '@/types/car';

//#region 서버 타입 정의 (파일 내부 사용)
interface CarHouseholdResidentServerResponse {
  id: number;
  car_id: number;                // snake_case
  household_instance_id: number; // snake_case
  resident_id: number;           // snake_case
  car_alarm: boolean;           // snake_case
  is_primary: boolean;           // snake_case
  created_at: string;            // snake_case
  updated_at: string;            // snake_case
  deleted_at?: string;           // snake_case
  car?: {
    id: number;
    car_number: string;          // snake_case
    brand?: string;
    model?: string;
    // ... 나머지 차량 필드들
  };
  household_instance?: {
    id: number;
    dong: string;
    ho: string;
    householder_name?: string;   // snake_case
    phone?: string;
    email?: string;
    move_in_date?: string;       // snake_case
    move_out_date?: string;      // snake_case
    is_active: boolean;          // snake_case
    created_at: string;          // snake_case
    updated_at: string;          // snake_case
  };
  resident?: {
    id: number;
    name: string;
    phone?: string;
    email?: string;
    birth_date?: string;         // snake_case
    is_householder: boolean;     // snake_case
    relationship_type?: string;  // snake_case
    created_at: string;          // snake_case
    updated_at: string;          // snake_case
  };
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function serverToClient(server: CarHouseholdResidentServerResponse): CarHouseholdResidentWithRelations {
  return {
    id: server.id,
    carId: server.car_id,
    householdInstanceId: server.household_instance_id,
    residentId: server.resident_id,
    carAlarm: server.car_alarm,
    isPrimary: server.is_primary,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
    deletedAt: server.deleted_at,
    car: server.car ? {
      id: server.car.id,
      carNumber: server.car.car_number,
      brand: server.car.brand,
      model: server.car.model,
      type: server.car.type,
      outerText: server.car.outer_text,
      year: server.car.year,
      externalSticker: server.car.external_sticker,
      fuel: server.car.fuel,
      totalUseNumber: server.car.total_use_number,
      inOutStatus: server.car.in_out_status,
      lastParkingDeviceId: server.car.last_parking_device_id,
      lastTime: server.car.last_time,
      frontImageUrl: server.car.front_image_url,
      rearImageUrl: server.car.rear_image_url,
      sideImageUrl: server.car.side_image_url,
      topImageUrl: server.car.top_image_url,
      createdAt: server.car.created_at,
      updatedAt: server.car.updated_at,
      deletedAt: server.car.deleted_at,
    } : undefined,
    householdInstance: server.household_instance ? {
      id: server.household_instance.id,
      dong: server.household_instance.dong,
      ho: server.household_instance.ho,
      householderName: server.household_instance.householder_name,
      phone: server.household_instance.phone,
      email: server.household_instance.email,
      moveInDate: server.household_instance.move_in_date,
      moveOutDate: server.household_instance.move_out_date,
      isActive: server.household_instance.is_active,
      createdAt: server.household_instance.created_at,
      updatedAt: server.household_instance.updated_at,
    } : undefined,
    resident: server.resident ? {
      id: server.resident.id,
      name: server.resident.name,
      phone: server.resident.phone,
      email: server.resident.email,
      birthDate: server.resident.birth_date,
      isHouseholder: server.resident.is_householder,
      relationshipType: server.resident.relationship_type,
      createdAt: server.resident.created_at,
      updatedAt: server.resident.updated_at,
    } : undefined,
  };
}
//#endregion

/**
 * 세대의 특정 차량의 등록된 사용자 목록 및 설정을 조회한다
 * @param carId 차량 ID
 * @returns 세대 차량 상세 정보 (CarHouseholdResidentWithRelations)
 */
export async function getCarHouseholdUsersSettings(carId: number) {
  const response = await fetchDefault(`/cars/household/${carId}/users-settings`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 차량 상세 조회 실패(코드): ${response.status}`;
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