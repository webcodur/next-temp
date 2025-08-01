'use client';
import { fetchDefault } from '@/services/fetchClient';

//#region 서버 타입 정의 (파일 내부 사용)
interface UpdateResidentHouseholdServerRequest {
  relationship?: 'HEAD' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'OTHER';
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
function clientToServer(client: UpdateResidentHouseholdRequest): UpdateResidentHouseholdServerRequest {
  return {
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

export interface UpdateResidentHouseholdRequest {
  relationship?: 'HEAD' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'OTHER';
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
 * 거주자와 세대 간의 관계를 수정한다
 * @param id 관계 ID
 * @param data 수정할 거주자-세대 관계 정보
 * @returns 거주자-세대 관계 정보 (ResidentHouseholdResponse)
 */
export async function updateResidentHousehold(id: number, data: UpdateResidentHouseholdRequest) {
  const serverRequest = clientToServer(data);
  
  const response = await fetchDefault(`/residents/households/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(serverRequest),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `거주자-세대 관계 수정 실패 (코드): ${response.status}`;
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