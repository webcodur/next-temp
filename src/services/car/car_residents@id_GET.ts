'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CarHouseholdResidentWithRelations } from '@/types/car';

//#region 서버 타입 정의 (파일 내부 사용)
interface CarHouseholdResidentServerResponse {
  id: number;
  car_instance_id: number;       // snake_case
  resident_id: number;           // snake_case
  car_alarm: boolean;            // snake_case
  is_primary: boolean;           // snake_case
  created_at: string;            // snake_case
  updated_at: string;            // snake_case
  deleted_at?: string;           // snake_case
  car?: {
    id: number;
    car_number: string;          // snake_case
    brand?: string;
    model?: string;
    type?: string;
    outer_text?: string;         // snake_case
    year?: number;
    external_sticker?: string;   // snake_case
    fuel?: string;
    total_use_number: number;    // snake_case
    in_out_status?: 'IN' | 'OUT'; // snake_case
    last_parking_device_id?: number; // snake_case
    last_time?: string;          // snake_case
    front_image_url?: string;    // snake_case
    rear_image_url?: string;     // snake_case
    side_image_url?: string;     // snake_case
    top_image_url?: string;      // snake_case
    created_at: string;          // snake_case
    updated_at: string;          // snake_case
    deleted_at?: string;         // snake_case
  };
  instance?: {
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
    carInstanceId: server.car_instance_id,
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
    householdInstance: server.instance ? {
      id: server.instance.id,
      dong: server.instance.dong,
      ho: server.instance.ho,
      householderName: server.instance.householder_name,
      phone: server.instance.phone,
      email: server.instance.email,
      moveInDate: server.instance.move_in_date,
      moveOutDate: server.instance.move_out_date,
      isActive: server.instance.is_active,
      createdAt: server.instance.created_at,
      updatedAt: server.instance.updated_at,
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
 * 특정 차량-거주자 연결의 상세 정보를 조회한다
 * @param id 차량-거주자 연결 ID
 * @returns 차량-거주자 연결 상세 정보 (CarHouseholdResidentWithRelations)
 */
export async function getCarResidentRelationDetail(id: number) {
  const response = await fetchDefault(`/cars/residents/${id}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량-거주자 연결 상세 조회 실패(코드): ${response.status}`;
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