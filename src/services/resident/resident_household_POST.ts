'use client';
import { fetchDefault } from '@/services/fetchClient';

//#region 서버 타입 정의 (파일 내부 사용)
interface CreateResidentHouseholdServerRequest {
  resident_id: number;                    // snake_case
  household_instance_id: number;          // snake_case
  relationship: 'HEAD' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'OTHER';
  memo?: string;
}

interface ResidentHouseholdServerResponse {
  id: number;
  resident_id: number;                    // snake_case
  household_instance_id: number;          // snake_case
  relationship: string;
  memo?: string;
  created_at: Date;                       // snake_case
  updated_at: Date;                       // snake_case
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function clientToServer(client: CreateResidentHouseholdRequest): CreateResidentHouseholdServerRequest {
  return {
    resident_id: client.residentId,
    household_instance_id: client.householdInstanceId,
    relationship: client.relationship,
    memo: client.memo,
  };
}

function serverToClient(server: ResidentHouseholdServerResponse): ResidentHouseholdResponse {
  return {
    id: server.id,
    residentId: server.resident_id,
    householdInstanceId: server.household_instance_id,
    relationship: server.relationship,
    memo: server.memo,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
  };
}
//#endregion

export interface CreateResidentHouseholdRequest {
  residentId: number;
  householdInstanceId: number;
  relationship: 'HEAD' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'OTHER';
  memo?: string;
}

export interface ResidentHouseholdResponse {
  id: number;
  residentId: number;
  householdInstanceId: number;
  relationship: string;
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 거주자와 세대 간의 관계를 생성한다
 * @param data 거주자-세대 관계 정보
 * @returns 거주자-세대 관계 정보 (ResidentHouseholdResponse)
 */
export async function createResidentHousehold(data: CreateResidentHouseholdRequest) {
  const serverRequest = clientToServer(data);
  
  const response = await fetchDefault('/residents/households', {
    method: 'POST',
    body: JSON.stringify(serverRequest),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `거주자-세대 관계 생성 실패 (코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  const serverResponse = result as ResidentHouseholdServerResponse;
  const clientData = serverToClient(serverResponse);
  
  return {
    success: true,
    data: clientData,
  };
} 