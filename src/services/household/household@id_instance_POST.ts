'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CreateHouseholdInstanceRequest, HouseholdInstance } from '@/types/household';

// #region 서버 타입 정의 (내부 사용)
interface HouseholdInstanceServerResponse {
  id: number;
  household_id: number;
  instance_name?: string;
  password: string;
  start_date?: string;
  end_date?: string;
  memo?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

interface CreateHouseholdInstanceServerRequest {
  household_id: number;
  instance_name?: string;
  password: string;
  start_date?: string;
  end_date?: string;
  memo?: string;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: HouseholdInstanceServerResponse): HouseholdInstance {
  return {
    id: server.id,
    householdId: server.household_id,
    instanceName: server.instance_name,
    password: server.password,
    startDate: server.start_date,
    endDate: server.end_date,
    memo: server.memo,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
    deletedAt: server.deleted_at,
  };
}

function clientToServer(client: CreateHouseholdInstanceRequest): CreateHouseholdInstanceServerRequest {
  return {
    household_id: client.householdId,
    instance_name: client.instanceName,
    password: client.password,
    start_date: client.startDate,
    end_date: client.endDate,
    memo: client.memo,
  };
}
// #endregion

/**
 * 특정 세대에 새로운 인스턴스(거주 기간)를 생성한다
 * @param householdId 세대 ID
 * @param data 세대 인스턴스 생성 데이터
 * @returns 생성된 세대 인스턴스 정보
 */
export async function createHouseholdInstance(householdId: number, data: CreateHouseholdInstanceRequest) {
  const serverRequest = clientToServer(data);
  const response = await fetchDefault(`/households/${householdId}/instances`, {
    method: 'POST',
    body: JSON.stringify(serverRequest),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 인스턴스 생성 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  const serverResponse = result as HouseholdInstanceServerResponse;
  return {
    success: true,
    data: serverToClient(serverResponse),
  };
} 