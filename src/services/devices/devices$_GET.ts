'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SearchParkingDeviceRequest, ParkingDeviceListResponse, ParkingDevice } from '@/types/device';

// #region 서버 타입 정의 (내부 사용)
interface ParkingDeviceServerResponse {
  id: number;
  parkinglot_id: number;
  name: string;
  ip: string;
  port: string;
  server_port?: string | null;
  cctv_url: string;
  status: number;
  device_type: number;
  is_ticketing?: string | null;
  is_receipting?: string | null;
  representative_phone?: string | null;
  sequence: number;
  resident_permission?: number | null;
  regular_permission?: number | null;
  visitor_permission?: number | null;
  temp_permission?: number | null;
  business_permission?: number | null;
  commercial_permission?: number | null;
  taxi_permission?: number | null;
  ticket_machine_permission?: number | null;
  unregistered_permission?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface ParkingDeviceListServerResponse {
  data: ParkingDeviceServerResponse[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: ParkingDeviceServerResponse): ParkingDevice {
  return {
    id: server.id,
    parkinglotId: server.parkinglot_id,
    name: server.name,
    ip: server.ip,
    port: server.port,
    serverPort: server.server_port,
    cctvUrl: server.cctv_url,
    status: server.status,
    deviceType: server.device_type,
    isTicketing: server.is_ticketing,
    isReceipting: server.is_receipting,
    representativePhone: server.representative_phone,
    sequence: server.sequence,
    residentPermission: server.resident_permission,
    regularPermission: server.regular_permission,
    visitorPermission: server.visitor_permission,
    tempPermission: server.temp_permission,
    businessPermission: server.business_permission,
    commercialPermission: server.commercial_permission,
    taxiPermission: server.taxi_permission,
    ticketMachinePermission: server.ticket_machine_permission,
    unregisteredPermission: server.unregistered_permission,
    createdAt: server.created_at ? new Date(server.created_at) : null,
    updatedAt: server.updated_at ? new Date(server.updated_at) : null,
  };
}

function serverListToClient(serverResponse: ParkingDeviceListServerResponse): ParkingDeviceListResponse {
  return {
    data: serverResponse.data.map(serverToClient),
    total: serverResponse.total,
    page: serverResponse.page,
    limit: serverResponse.limit,
    totalPages: serverResponse.total_pages,
  };
}
// #endregion

export async function searchParkingDevices(params?: SearchParkingDeviceRequest) {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.name) searchParams.append('name', params.name);
  if (params?.deviceType) searchParams.append('device_type', params.deviceType.toString());
  if (params?.status) searchParams.append('status', params.status.toString());
  if (params?.ip) searchParams.append('ip', params.ip);
  if (params?.taxiPermission !== undefined) searchParams.append('taxi_permission', params.taxiPermission.toString());

  const url = `/devices${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  const response = await fetchDefault(url, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차단기 목록 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  const serverResponse = result as ParkingDeviceListServerResponse;
  return {
    success: true,
    data: serverListToClient(serverResponse),
  };
}
