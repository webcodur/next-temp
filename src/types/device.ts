// 차단기 관리 관련 타입 정의

// #region 기본 차단기 타입
export interface ParkingDevice {
  id: number;
  parkinglotId: number;
  name: string;
  ip: string;
  port: string;
  serverPort?: string | null;
  cctvUrl: string;
  status: number; // 1: 자동운행, 2: 항시열림, 3: 바이패스
  deviceType: number; // 1: 라즈베리파이, 2: 통합보드
  isTicketing?: string | null;
  isReceipting?: string | null;
  representativePhone?: string | null;
  sequence: number;
  residentPermission?: number | null;
  regularPermission?: number | null;
  visitorPermission?: number | null;
  tempPermission?: number | null;
  businessPermission?: number | null;
  commercialPermission?: number | null;
  taxiPermission?: number | null;
  ticketMachinePermission?: number | null;
  unregisteredPermission?: number | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
// #endregion

// #region 요청 타입
export interface CreateParkingDeviceRequest {
  name: string;
  ip: string;
  port: string;
  serverPort?: string;
  cctvUrl: string;
  status?: number;
  deviceType?: number;
  isTicketing?: string;
  isReceipting?: string;
  representativePhone?: string;
  sequence?: number;
  residentPermission?: number;
  regularPermission?: number;
  visitorPermission?: number;
  tempPermission?: number;
  businessPermission?: number;
  commercialPermission?: number;
  taxiPermission?: number;
  ticketMachinePermission?: number;
  unregisteredPermission?: number;
}

export interface UpdateParkingDeviceRequest {
  name?: string;
  ip?: string;
  port?: string;
  serverPort?: string;
  cctvUrl?: string;
  status?: number;
  deviceType?: number;
  isTicketing?: string;
  isReceipting?: string;
  representativePhone?: string;
  sequence?: number;
  residentPermission?: number;
  regularPermission?: number;
  visitorPermission?: number;
  tempPermission?: number;
  businessPermission?: number;
  commercialPermission?: number;
  taxiPermission?: number;
  ticketMachinePermission?: number;
  unregisteredPermission?: number;
}

export interface SearchParkingDeviceRequest {
  page?: number;
  limit?: number;
  name?: string;
  deviceType?: number;
  status?: number;
  ip?: string;
  taxiPermission?: number;
}

export interface UpdateParkingDeviceStatusRequest {
  status?: number;
}

export interface UpdateParkingDeviceBasicInfoRequest {
  name?: string;
  cctvUrl?: string;
  representativePhone?: string;
  sequence?: number;
}

export interface UpdateParkingDeviceNetworkRequest {
  ip?: string;
  port?: string;
  serverPort?: string;
}

export interface UpdateParkingDevicePermissionsRequest {
  residentPermission?: number;
  regularPermission?: number;
  visitorPermission?: number;
  tempPermission?: number;
  businessPermission?: number;
  commercialPermission?: number;
  taxiPermission?: number;
  ticketMachinePermission?: number;
  unregisteredPermission?: number;
}

export interface UpdateParkingDeviceOperationRequest {
  deviceType?: number;
  isTicketing?: string;
  isReceipting?: string;
}
// #endregion

// #region 응답 타입
export interface ParkingDeviceListResponse {
  data: ParkingDevice[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VehicleAccessResponse {
  allowed: boolean;
  carType: string;
  reason?: string;
  timeRestriction?: string;
}
// #endregion

// #region 로그 관련 타입
export interface ParkingDeviceCommandLog {
  id: number;
  deviceId: number;
  adminId?: number | null;
  command: string;
  status: number; // 0: 대기, 1: 성공, 2: 실패
  requestData?: Record<string, unknown>;
  responseData?: Record<string, unknown>;
  errorMessage?: string | null;
  createdAt: Date;
}

export interface ParkingDeviceHistory {
  id: number;
  parkingDeviceId: number;
  actionType: 'CREATED' | 'UPDATED' | 'DELETED';
  beforeData?: Record<string, unknown>;
  afterData?: Record<string, unknown>;
  changedFields?: string;
  adminId?: number;
  changedByType: 'ADMIN' | 'SYSTEM' | 'API';
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  admin?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface SearchParkingDeviceCommandLogRequest {
  page?: number;
  limit?: number;
}

export interface SearchParkingDeviceHistoryRequest {
  page?: number;
  limit?: number;
  actionType?: string;
  changedFields?: string;
  startDate?: string;
  endDate?: string;
}

export interface ParkingDeviceCommandLogListResponse {
  data: ParkingDeviceCommandLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ParkingDeviceHistoryListResponse {
  data: ParkingDeviceHistory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
// #endregion

// #region 차량 유형 상수
export type VehicleType = 
  | 'resident' 
  | 'regular' 
  | 'visitor' 
  | 'temp' 
  | 'business' 
  | 'commercial' 
  | 'taxi' 
  | 'ticket_machine' 
  | 'unregistered';
// #endregion
