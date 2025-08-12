'use client';
import { fetchDefault } from '@/services/fetchClient';
import { InstanceDetail, InstanceServiceConfig, InstanceVisitConfig, InstanceType, CarInstanceWithCar, ResidentInstanceWithResident } from '@/types/instance';


// #region 서버 타입 정의 (내부 사용)
interface InstanceServiceConfigServerResponse {
  id: number;
  instance_id: number;
  can_add_new_resident: boolean;
  is_common_entrance_subscribed: boolean;
  is_temporary_access: boolean;
  temp_car_limit: number;
  created_at: string;
  updated_at: string;
}

interface InstanceVisitConfigServerResponse {
  id: number;
  instance_id: number;
  available_visit_time: number;
  purchased_visit_time: number;
  visit_request_limit: number;
  created_at: string;
  updated_at: string;
}

interface InstanceDetailServerResponse {
  id: number;
  parkinglot_id: number;
  name: string;
  owner_name?: string | null;
  phone: string;
  address_1depth: string;
  address_2depth: string;
  address_3depth?: string | null;
  instance_type: string;
  password: string;
  memo?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  resident_instance: unknown[];
  car_instance?: unknown[];
  instance_service_config?: InstanceServiceConfigServerResponse | null;
  instance_visit_config?: InstanceVisitConfigServerResponse | null;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serviceConfigServerToClient(server: InstanceServiceConfigServerResponse): InstanceServiceConfig {
  return {
    id: server.id,
    instanceId: server.instance_id,
    canAddNewResident: server.can_add_new_resident,
    isCommonEntranceSubscribed: server.is_common_entrance_subscribed,
    isTemporaryAccess: server.is_temporary_access,
    tempCarLimit: server.temp_car_limit,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
  };
}

function visitConfigServerToClient(server: InstanceVisitConfigServerResponse): InstanceVisitConfig {
  return {
    id: server.id,
    instanceId: server.instance_id,
    availableVisitTime: server.available_visit_time,
    purchasedVisitTime: server.purchased_visit_time,
    visitRequestLimit: server.visit_request_limit,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
  };
}

function serverToClient(server: InstanceDetailServerResponse): InstanceDetail {
  return {
    id: server.id,
    parkinglotId: server.parkinglot_id,
    name: server.name,
    ownerName: server.owner_name,
    phone: server.phone,
    address1Depth: server.address_1depth,
    address2Depth: server.address_2depth,
    address3Depth: server.address_3depth,
    instanceType: server.instance_type as InstanceType,
    password: server.password,
    memo: server.memo,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
    deletedAt: server.deleted_at,
    residentInstance: server.resident_instance as ResidentInstanceWithResident[],
    carInstance: server.car_instance as CarInstanceWithCar[],
    instanceServiceConfig: server.instance_service_config 
      ? serviceConfigServerToClient(server.instance_service_config)
      : null,
    instanceVisitConfig: server.instance_visit_config
      ? visitConfigServerToClient(server.instance_visit_config)
      : null,
  };
}
// #endregion

export async function getInstanceDetail(id: number) {
  const response = await fetchDefault(`/instances/${id}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `인스턴스 상세 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  const serverResponse = result as InstanceDetailServerResponse;
  return {
    success: true,
    data: serverToClient(serverResponse),
  };
}
