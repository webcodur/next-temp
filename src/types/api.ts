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
  role_id: number;
  name?: string;
  email?: string;
  password: string;
  phone?: string;
}

export interface UpdateAdminRequest {
  role_id?: number;
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
}

export interface SearchAdminRequest {
  account?: string;
  name?: string;
  role_id?: number;
  email?: string;
  page?: number;
  limit?: number;
}
// #endregion

// #region 시스템 설정 타입
export interface SystemConfig {
  key: string;
  value: string | number | boolean | object;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  updatedAt: string;
  updatedBy: number;
}

export interface UpdateSystemConfigRequest {
  value: string | number | boolean | object;
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
  blockType?: string;
  userAgent?: string;
  requestMethod?: string;
  requestUrl?: string;
  blockReason?: string;
  matchedPattern?: string;
  blockDuration?: number;
  isActive?: number;
  unblockedStartDate?: string;
  unblockedEndDate?: string;
  unblockedBy?: string;
  startDate?: string;
  endDate?: string;
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

// #region 거주자 관련 타입
export interface Resident {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  gender?: 'M' | 'F';
  isHouseholder: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResidentRequest {
  name: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  gender?: 'M' | 'F';
  isHouseholder?: boolean;
}

export interface UpdateResidentRequest {
  name?: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  gender?: 'M' | 'F';
  isHouseholder?: boolean;
}

export interface SearchResidentRequest {
  name?: string;
  phone?: string;
  email?: string;
  isHouseholder?: boolean;
  page?: number;
  limit?: number;
}
// #endregion

// #region 세대 관련 타입
export interface Household {
  id: number;
  dong: string;
  ho: string;
  householderName?: string;
  phone?: string;
  email?: string;
  moveInDate?: string;
  moveOutDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHouseholdRequest {
  dong: string;
  ho: string;
  householderName?: string;
  phone?: string;
  email?: string;
  moveInDate?: string;
}

export interface UpdateHouseholdRequest {
  dong?: string;
  ho?: string;
  householderName?: string;
  phone?: string;
  email?: string;
  moveInDate?: string;
  moveOutDate?: string;
  isActive?: boolean;
}

export interface SearchHouseholdRequest {
  dong?: string;
  ho?: string;
  householderName?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}
// #endregion 