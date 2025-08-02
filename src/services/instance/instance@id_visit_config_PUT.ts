'use client';
import { fetchDefault } from '@/services/fetchClient';
import { UpdateVisitConfigRequest, VisitConfig } from '@/types/instance';

// #region 서버 타입 정의 (내부 사용)
interface VisitConfigServerResponse {
  id: number;
  household_instance_id: number;
  available_visit_time: number;
  purchased_visit_time: number;
  visit_request_limit: number;
  created_at: string;
  updated_at: string;
}

interface UpdateVisitConfigServerRequest {
  available_visit_time?: number;
  purchased_visit_time?: number;
  visit_request_limit?: number;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: VisitConfigServerResponse): VisitConfig {
  return {
    id: server.id,
    instanceId: server.household_instance_id,
    availableVisitTime: server.available_visit_time,
    purchasedVisitTime: server.purchased_visit_time,
    visitRequestLimit: server.visit_request_limit,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
  };
}

function clientToServer(client: UpdateVisitConfigRequest): UpdateVisitConfigServerRequest {
  return {
    available_visit_time: client.availableVisitTime,
    purchased_visit_time: client.purchasedVisitTime,
    visit_request_limit: client.visitRequestLimit,
  };
}
// #endregion

/**
 * 인스턴스의 방문 시간 설정을 수정한다
 * @param id 인스턴스 ID
 * @param data 방문 설정 데이터
 * @returns 수정된 방문 설정 정보
 */
export async function updateVisitConfig(id: number, data: UpdateVisitConfigRequest) {
  const serverRequest = clientToServer(data);
  const response = await fetchDefault(`/households/instances/${id}/config/visit`, {
    method: 'PUT',
    body: JSON.stringify(serverRequest),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `방문 설정 수정 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  const serverResponse = result as VisitConfigServerResponse;
  return {
    success: true,
    data: serverToClient(serverResponse),
  };
}