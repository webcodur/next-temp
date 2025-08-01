'use client';
import { fetchDefault } from '@/services/fetchClient';
import { HouseholdInstance } from '@/types/household';

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
// #endregion

/**
 * 특정 세대 인스턴스의 상세 정보를 조회한다 (삭제된 세대 포함)
 * @param instance_id 인스턴스 ID
 * @returns 세대 인스턴스 상세 정보
 */
export async function getHouseholdInstanceDetail(instance_id: number) {
  const response = await fetchDefault(`/households/instances/${instance_id}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 인스턴스 상세 조회 실패(코드): ${response.status}`;
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