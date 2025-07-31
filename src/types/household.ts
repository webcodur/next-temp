/**
 * Household 관련 타입 정의 (camelCase 기준)
 */

// #region 세대 기본 타입
/**
 * 세대 타입 ENUM
 */
export type HouseholdType = 'GENERAL' | 'TEMP' | 'COMMERCIAL';

/**
 * 세대 기본 정보 타입
 */
export interface Household {
  id: number;
  address1Depth: string;
  address2Depth: string;
  address3Depth?: string;
  householdType: HouseholdType;
  memo?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  // 인스턴스 관련
  instances?: HouseholdInstance[];
}

/**
 * 세대 생성 요청 타입
 */
export interface CreateHouseholdRequest {
  address1Depth: string;
  address2Depth: string;
  address3Depth?: string;
  householdType: HouseholdType;
  memo?: string;
}

/**
 * 세대 수정 요청 타입
 */
export interface UpdateHouseholdRequest {
  address1Depth?: string;
  address2Depth?: string;
  address3Depth?: string;
  householdType?: HouseholdType;
  memo?: string;
}

/**
 * 세대 검색 요청 타입
 */
export interface SearchHouseholdRequest {
  page?: number;
  limit?: number;
  householdType?: HouseholdType;
  address1Depth?: string;
  address2Depth?: string;
  address3Depth?: string;
}
// #endregion

// #region 세대 인스턴스 타입
/**
 * 세대 인스턴스 (거주 기간) 타입
 */
export interface HouseholdInstance {
  id: number;
  householdId: number;
  instanceName?: string;
  password: string;
  startDate?: string;
  endDate?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  // 관련 정보
  household?: Household;
  serviceConfig?: HouseholdServiceConfig;
  visitConfig?: HouseholdVisitConfig;
}

/**
 * 세대 인스턴스 생성 요청 타입
 */
export interface CreateHouseholdInstanceRequest {
  instanceName?: string;
  password: string;
  startDate?: string;
  endDate?: string;
  memo?: string;
}

/**
 * 세대 인스턴스 수정 요청 타입
 */
export interface UpdateHouseholdInstanceRequest {
  instanceName?: string;
  password?: string;
  startDate?: string;
  endDate?: string;
  memo?: string;
}

/**
 * 세대 인스턴스 검색 요청 타입
 */
export interface SearchHouseholdInstanceRequest {
  page?: number;
  limit?: number;
  householdId?: number;
  instanceName?: string;
}
// #endregion

// #region 서비스 설정 타입
/**
 * 세대 서비스 설정 타입
 */
export interface HouseholdServiceConfig {
  id: number;
  householdInstanceId: number;
  canAddNewResident?: boolean;
  isCommonEntranceSubscribed?: boolean;
  isTemporaryAccess?: boolean;
  tempCarLimit?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 세대 서비스 설정 수정 요청 타입
 */
export interface UpdateHouseholdServiceConfigRequest {
  householdInstanceId: number;
  canAddNewResident?: boolean;
  isCommonEntranceSubscribed?: boolean;
  isTemporaryAccess?: boolean;
  tempCarLimit?: number;
}
// #endregion

// #region 방문 설정 타입
/**
 * 세대 방문 설정 타입
 */
export interface HouseholdVisitConfig {
  id: number;
  householdInstanceId: number;
  availableVisitTime?: number;
  purchasedVisitTime?: number;
  visitRequestLimit?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 세대 방문 설정 수정 요청 타입
 */
export interface UpdateHouseholdVisitConfigRequest {
  householdInstanceId: number;
  availableVisitTime?: number;
  purchasedVisitTime?: number;
  visitRequestLimit?: number;
}
// #endregion

// #region 응답 타입
/**
 * 페이지네이션된 응답의 공통 구조
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * API 응답의 기본 구조
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  errorMsg?: string;
}

/**
 * 세대 목록 응답 타입
 */
export type HouseholdListResponse = ApiResponse<PaginatedResponse<Household>>;

/**
 * 세대 인스턴스 목록 응답 타입
 */
export type HouseholdInstanceListResponse = ApiResponse<PaginatedResponse<HouseholdInstance>>;

/**
 * 세대 상세 응답 타입 (단일 객체)
 */
export type HouseholdDetailResponse = ApiResponse<Household>;

/**
 * 세대 인스턴스 상세 응답 타입 (단일 객체)
 */
export type HouseholdInstanceDetailResponse = ApiResponse<HouseholdInstance>;

/**
 * 세대의 인스턴스 목록 응답 타입
 */
export type HouseholdInstanceListByHouseholdResponse = ApiResponse<PaginatedResponse<HouseholdInstance>>;
// #endregion 