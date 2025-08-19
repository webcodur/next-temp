'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CarResidentWithDetails } from '@/types/car';

// #region 서버 타입 정의 (내부 사용)
interface CarResidentServerResponse {
  id: number;
  car_instance_id: number;
  resident_id: number;
  car_alarm: boolean;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  resident: {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    birth_date: string | null;
    gender: 'M' | 'F' | null;
    emergency_contact: string | null;
    memo: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    address_1depth: string;
    address_2depth: string;
    address_3depth: string | null;
  };
  car_instance?: unknown; // 사용하지 않으므로 unknown으로 처리
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: CarResidentServerResponse): CarResidentWithDetails {
  return {
    id: server.id,
    carInstanceId: server.car_instance_id,
    residentId: server.resident_id,
    carAlarm: server.car_alarm,
    isPrimary: server.is_primary,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
    deletedAt: server.deleted_at,
    resident: {
      id: server.resident.id,
      name: server.resident.name,
      phone: server.resident.phone,
      email: server.resident.email,
      birthDate: server.resident.birth_date,
      gender: server.resident.gender,
      emergencyContact: server.resident.emergency_contact,
      memo: server.resident.memo,
      createdAt: server.resident.created_at,
      updatedAt: server.resident.updated_at,
      deletedAt: server.resident.deleted_at,
      address1Depth: server.resident.address_1depth,
      address2Depth: server.resident.address_2depth,
      address3Depth: server.resident.address_3depth,
    },
  };
}
// #endregion

export async function getCarResidents(carId: number, parkinglotId?: string) {
  const headers: Record<string, string> = {};
  if (parkinglotId) {
    headers['x-parkinglot-id'] = parkinglotId;
  }

  const response = await fetchDefault(`/cars/${carId}/residents`, {
    method: 'GET',
    headers,
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량-거주자 관계 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  const serverResponse = result as CarResidentServerResponse[];
  return {
    success: true,
    data: serverResponse.map(serverToClient),
  };
}
