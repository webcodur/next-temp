'use client';
import { fetchDefault } from '@/services/fetchClient';
import { UpdateHouseholdServiceConfigRequest, HouseholdServiceConfig } from '@/types/household';

// #region 서버 타입 정의 (내부 사용)
interface HouseholdServiceConfigServerResponse {
  id: number;
  household_instance_id: number;
  can_add_new_resident: boolean;
  is_common_entrance_subscribed: boolean;
  is_temporary_access: boolean;
  temp_car_limit: number;
  created_at: string;
  updated_at: string;
}

interface UpdateHouseholdServiceConfigServerRequest {
  household_instance_id: number;
  can_add_new_resident?: boolean;
  is_common_entrance_subscribed?: boolean;
  is_temporary_access?: boolean;
  temp_car_limit?: number;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: HouseholdServiceConfigServerResponse): HouseholdServiceConfig {
  return {
    id: server.id,
    householdInstanceId: server.household_instance_id,
    canAddNewResident: server.can_add_new_resident,
    isCommonEntranceSubscribed: server.is_common_entrance_subscribed,
    isTemporaryAccess: server.is_temporary_access,
    tempCarLimit: server.temp_car_limit,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
  };
}

function clientToServer(client: UpdateHouseholdServiceConfigRequest): UpdateHouseholdServiceConfigServerRequest {
  return {
    household_instance_id: client.householdInstanceId,
    can_add_new_resident: client.canAddNewResident,
    is_common_entrance_subscribed: client.isCommonEntranceSubscribed,
    is_temporary_access: client.isTemporaryAccess,
    temp_car_limit: client.tempCarLimit,
  };
}
// #endregion

/**
 * 세대 인스턴스의 서비스 설정을 수정한다
 * @param instance_id 인스턴스 ID
 * @param data 서비스 설정 데이터
 * @returns 수정된 서비스 설정 정보
 */
export async function updateHouseholdServiceConfig(instance_id: number, data: UpdateHouseholdServiceConfigRequest) {
  const serverRequest = clientToServer(data);
  const response = await fetchDefault(`/households/instances/${instance_id}/config/service`, {
    method: 'PUT',
    body: JSON.stringify(serverRequest),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `세대 서비스 설정 수정 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  const serverResponse = result as HouseholdServiceConfigServerResponse;
  return {
    success: true,
    data: serverToClient(serverResponse),
  };
} 