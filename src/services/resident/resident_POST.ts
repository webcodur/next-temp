'use client';
import { fetchDefault } from '@/services/fetchClient';
import type { CreateResidentRequest, Resident } from '@/types/api';

//#region 서버 타입 정의 (파일 내부 사용)
interface CreateResidentServerRequest {
  name: string;
  phone?: string;
  email?: string;
  birth_date?: string;         // snake_case
  gender?: 'M' | 'F';
  emergency_contact?: string;  // snake_case
}

interface ResidentServerResponse {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  birth_date?: Date;           // snake_case
  gender?: string;
  emergency_contact?: string;  // snake_case
  memo?: string;
  created_at: Date;            // snake_case
  updated_at: Date;            // snake_case
  deleted_at?: Date | null;    // snake_case
  resident_households?: unknown[];  // snake_case
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function clientToServer(client: CreateResidentRequest): CreateResidentServerRequest {
  return {
    name: client.name,
    phone: client.phone,
    email: client.email,
    birth_date: client.birthDate,
    gender: client.gender,
    emergency_contact: client.emergencyContact,
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
 * 새로운 거주자를 생성한다
 * @param data 거주자 정보
 * @returns 거주자 정보 (ResidentResponse)
 */
export async function createResident(data: CreateResidentRequest) {
  const serverRequest = clientToServer(data);

  const response = await fetchDefault('/residents', {
    method: 'POST',
    body: JSON.stringify(serverRequest),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `거주자 생성 실패 (코드): ${response.status}`;
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