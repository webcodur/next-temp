'use client';
import { fetchDefault } from '@/services/fetchClient';
import type { UpdateResidentRequest, Resident } from '@/types/api';

//#region 서버 타입 정의 (파일 내부 사용)
interface UpdateResidentServerRequest {
  name?: string;
  phone?: string;
  email?: string;
  birth_date?: string;           // snake_case
  gender?: 'M' | 'F';
  emergency_contact?: string;    // snake_case
  memo?: string;
}

interface ResidentServerResponse {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  birth_date?: Date;             // snake_case
  gender?: string;
  emergency_contact?: string;    // snake_case
  memo?: string;
  created_at: Date;              // snake_case
  updated_at: Date;              // snake_case
  deleted_at?: Date | null;      // snake_case
  resident_households?: unknown[];  // snake_case
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function clientToServer(client: UpdateResidentRequest): UpdateResidentServerRequest {
  return {
    name: client.name,
    phone: client.phone,
    email: client.email,
    birth_date: client.birthDate,
    gender: client.gender,
    emergency_contact: client.emergencyContact,
    memo: client.memo,
  };
}

function serverToClient(server: ResidentServerResponse): Resident {
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
    residentHouseholds: server.resident_households,
  };
}
//#endregion

export type ResidentResponse = Resident;

/**
 * 특정 거주자의 정보를 수정한다
 * @param id 거주자 ID
 * @param data 수정할 거주자 정보
 * @returns 거주자 정보 (ResidentResponse)
 */
export async function updateResident(id: number, data: UpdateResidentRequest) {
  const serverRequest = clientToServer(data);
  
  const response = await fetchDefault(`/residents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(serverRequest),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `거주자 수정 실패 (코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  const serverResponse = result as ResidentServerResponse;
  const clientData = serverToClient(serverResponse);
  
  return {
    success: true,
    data: clientData,
  };
} 