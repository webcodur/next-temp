'use client';
import { fetchDefault } from '@/services/fetchClient';
import { UpdateHouseholdRequest, Household } from '@/types/household';

// #region 서버 타입 정의 (내부 사용)
interface HouseholdServerResponse {
  id: number;
  parkinglot_id: number;
  address_1depth: string;
  address_2depth: string;
  address_3depth?: string;
  household_type: 'GENERAL' | 'TEMP' | 'COMMERCIAL';
  memo?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

interface UpdateHouseholdServerRequest {
  address_1depth?: string;
  address_2depth?: string;
  address_3depth?: string;
  household_type?: 'GENERAL' | 'TEMP' | 'COMMERCIAL';
  memo?: string;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: HouseholdServerResponse): Household {
  return {
    id: server.id,
    parkinglotId: server.parkinglot_id,
    address1Depth: server.address_1depth,
    address2Depth: server.address_2depth,
    address3Depth: server.address_3depth,
    householdType: server.household_type,
    memo: server.memo,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
    deletedAt: server.deleted_at,
  };
}

function clientToServer(client: UpdateHouseholdRequest): UpdateHouseholdServerRequest {
  return {
    address_1depth: client.address1Depth,
    address_2depth: client.address2Depth,
    address_3depth: client.address3Depth,
    household_type: client.householdType,
    memo: client.memo,
  };
}
// #endregion

/**
 * 특정 세대의 정보를 수정한다
 * @param id 세대 ID
 * @param data 수정할 세대 정보
 * @returns 수정된 세대 정보
 */
export async function updateHousehold(id: number, data: UpdateHouseholdRequest) {
  const serverRequest = clientToServer(data);
  const response = await fetchDefault(`/households/${id}`, {
    method: 'PUT',
    body: JSON.stringify(serverRequest),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 정보 수정 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  const serverResponse = result as HouseholdServerResponse;
  return {
    success: true,
    data: serverToClient(serverResponse),
  };
} 