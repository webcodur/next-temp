/**
 * API 공통 타입 정의
 */

// #region 공통 응답 타입
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  errorMsg?: string;
  code?: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  code: number;
  message: string;
  details?: unknown;
}
// #endregion

// #region 인증 관련 타입
export interface SigninRequest {
  account: string;
  password: string;
}

export interface SigninResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: number;
    account: string;
    name?: string;
    email?: string;
    role: {
      id: number;
      name: string;
    };
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
// #endregion

// #region 관리자 관련 타입
export interface Admin {
  id: number;
  account: string;
  name?: string;
  email?: string;
  phone?: string;
  roleId: number;
  role: {
    id: number;
    name: string;
    permissions: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminRequest {
  account: string;
  roleId: number;
  name?: string;
  email?: string;
  password: string;
  phone?: string;
}

export interface UpdateAdminRequest {
  roleId?: number;
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
}

export interface SearchAdminRequest {
  account?: string;
  name?: string;
  roleId?: number;
  email?: string;
  page?: number;
  limit?: number;
}
// #endregion

// #region 시스템 설정 타입
export interface SystemConfig {
  id: number;
  key: string;
  value: string | number | boolean | object;
  title?: string | null;
  description?: string | null;
  type: string;
  isActive: boolean;
  category?: string | null;
  group?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateSystemConfigRequest {
  value: string | number | boolean | object;
}

export interface SystemConfigSearchRequest {
  page?: number;
  limit?: number;
  config_key?: string;
  config_type?: string;
  title?: string;
  description?: string;
  category?: string;
}
// #endregion

// #region IP 차단 관련 타입
export interface IpBlock {
  ip: string;
  blockType: 'MANUAL' | 'AUTO';
  blockReason: string;
  blockedAt: string;
  unblockedAt?: string;
  unblockedBy?: number;
  isActive: boolean;
}

export interface IpBlockHistory {
  id: number;
  ip: string;
  blockType: 'MANUAL' | 'AUTO';
  userAgent?: string;
  requestMethod?: string;
  requestUrl?: string;
  blockReason: string;
  matchedPattern?: string;
  blockDuration?: number;
  blockedAt: string;
  unblockedAt?: string;
  unblockedBy?: number;
  isActive: boolean;
}

export interface SearchIpBlockHistoryRequest {
  page?: number;
  limit?: number;
  ip?: string;
  reason?: string;
  date_from?: string;
  date_to?: string;
}
// #endregion

// #region 캐시 관련 타입
export interface CacheStats {
  totalKeys: number;
  totalMemory: number;
  hitRate: number;
  missRate: number;
  namespaces: {
    [namespace: string]: {
      keys: number;
      memory: number;
    };
  };
}

export interface CacheNamespaceStats {
  namespace: string;
  keys: number;
  memory: number;
  keyList: string[];
}
// #endregion

// #region 메뉴 관련 타입
export interface Menu {
  id: string;
  name: string;
  url: string;
  icon?: string;
  parentId?: string;
  order: number;
  isActive: boolean;
  permissions: string[];
  children?: Menu[];
}

export interface MenuBreadcrumb {
  id: string;
  name: string;
  url: string;
  level: number;
}

export interface UpdateMenuOrderRequest {
  order: number;
}

export interface BatchUpdateMenuOrderRequest {
  menuOrders: Array<{
    menuId: string;
    order: number;
  }>;
}

export interface AssignMenuToParkingLotRequest {
  menuIds: string[];
}

export interface BulkAssignMenuRequest {
  parkingLotIds: string[];
  menuIds: string[];
}

export interface AssignAdminToParkingLotRequest {
  adminIds: number[];
}
// #endregion

// #region 사용자 관련 타입
export interface User {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  birthDate?: Date;
  gender?: string;
  emergencyContact?: string;
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  // userHouseholds?: unknown[];
}

export interface CreateUserRequest {
  name: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  gender?: 'M' | 'F';
  emergencyContact?: string;
  memo?: string;
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  gender?: 'M' | 'F';
  emergencyContact?: string;
  memo?: string;
}

export interface SearchUserRequest {
  name?: string;
  phone?: string;
  email?: string;
  gender?: 'M' | 'F';
  parkinglotId?: number;
  address1Depth?: string;
  address2Depth?: string;
  address3Depth?: string;
  page?: number;
  limit?: number;
}
// #endregion