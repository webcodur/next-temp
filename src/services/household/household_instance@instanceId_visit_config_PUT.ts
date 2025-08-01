'use client';
import { fetchDefault } from '@/services/fetchClient';
import { UpdateHouseholdVisitConfigRequest, HouseholdVisitConfig } from '@/types/household';

// #region 서버 타입 정의 (내부 사용)
interface HouseholdVisitConfigServerResponse {
  id: number;
  household_instance_id: number;
  available_visit_time: number;
  purchased_visit_time: number;
  visit_request_limit: number;
  created_at: string;
  updated_at: string;
}

interface UpdateHouseholdVisitConfigServerRequest {
  available_visit_time?: number;
  purchased_visit_time?: number;
  visit_request_limit?: number;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: HouseholdVisitConfigServerResponse): HouseholdVisitConfig {
  return {
    id: server.id,
    householdInstanceId: server.household_instance_id,
    availableVisitTime: server.available_visit_time,
    purchasedVisitTime: server.purchased_visit_time,
    visitRequestLimit: server.visit_request_limit,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
  };
}

function clientToServer(client: UpdateHouseholdVisitConfigRequest): UpdateHouseholdVisitConfigServerRequest {
  return {
    available_visit_time: client.availableVisitTime,
    purchased_visit_time: client.purchasedVisitTime,
    visit_request_limit: client.visitRequestLimit,
  };
}
// #endregion

/**
 * 세대 인스턴스의 방문 시간 설정을 수정한다
 * @param instance_id 인스턴스 ID
 * @param data 방문 설정 데이터
 * @returns 수정된 방문 설정 정보
 */
export async function updateHouseholdVisitConfig(instance_id: number, data: UpdateHouseholdVisitConfigRequest) {
  const serverRequest = clientToServer(data);
  const response = await fetchDefault(`/households/instances/${instance_id}/config/visit`, {
    method: 'PUT',
    body: JSON.stringify(serverRequest),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 방문 설정 수정 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  const serverResponse = result as HouseholdVisitConfigServerResponse;
  return {
    success: true,
    data: serverToClient(serverResponse),
  };
} 