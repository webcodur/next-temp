'use client';
import { fetchDefault } from '@/services/fetchClient';
import { ResidentWithAddress } from '@/types/resident';

// #region 서버 타입 정의 (내부 사용)
interface ResidentWithAddressServerResponse {
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
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: ResidentWithAddressServerResponse): ResidentWithAddress {
  return {
    id: server.id,
    name: server.name,
    phone: server.phone,
    email: server.email,
    birthDate: server.birth_date,
    gender: server.gender,
    emergencyContact: server.emergency_contact,
    memo: server.memo,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
    deletedAt: server.deleted_at,
    address1Depth: server.address_1depth,
    address2Depth: server.address_2depth,
    address3Depth: server.address_3depth,
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
    const errorMsg = result.message || `차량-거주자 연결 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  const serverResponse = result as ResidentWithAddressServerResponse[];
  return {
    success: true,
    data: serverResponse.map(serverToClient),
  };
}
