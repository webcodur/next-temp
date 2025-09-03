/**
 * Household 관련 타입 정의 (백엔드 DTO와 일치)
 */

// #region 세대 기본 타입
/**
 * 세대 타입 ENUM (백엔드 household_type enum과 일치)
 */
export type ENUM_HouseholdType = 'GENERAL' | 'TEMP' | 'COMMERCIAL';

/**
 * 세대 기본 정보 타입 (백엔드 HouseholdDto 기준)
 */
export interface Household {
	id: number;
	parkinglotId: number;
	address1Depth: string;
	address2Depth: string;
	address3Depth?: string;
	householdType: ENUM_HouseholdType;
	memo?: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
	// 관련 정보
	parkinglot?: {
		id: number;
		name: string;
	};
	instances?: HouseholdInstance[];
	householdInstance?: HouseholdInstance[]; // 실제 API 응답에서 사용하는 필드명
}

/**
 * 세대 생성 요청 타입 (백엔드 CreateHouseholdDto 기준)
 */
export interface CreateHouseholdRequest {
	address1Depth: string; // address_1depth
	address2Depth: string; // address_2depth
	address3Depth?: string; // address_3depth
	householdType: ENUM_HouseholdType; // household_type
	memo?: string; // memo
}

/**
 * 세대 수정 요청 타입 (백엔드 UpdateHouseholdDto 기준 - PartialType)
 */
export interface UpdateHouseholdRequest {
	address1Depth?: string;
	address2Depth?: string;
	address3Depth?: string;
	householdType?: ENUM_HouseholdType;
	memo?: string;
}

/**
 * 세대 검색 요청 타입 (백엔드 SearchHouseholdDto 기준)
 */
export interface SearchHouseholdRequest {
	page?: number;
	limit?: number;
	householdType?: ENUM_HouseholdType; // household_type
	address1Depth?: string; // address_1depth
	address2Depth?: string; // address_2depth
	address3Depth?: string; // address_3depth
}
// #endregion

// #region 세대 인스턴스 타입
/**
 * 세대 인스턴스 (거주 기간) 타입 (백엔드 InstanceDto 기준)
 */
export interface HouseholdInstance {
	id: number;
	householdId: number; // household_id
	instanceName?: string; // instance_name
	password: string; // password (4자리)
	startDate?: string; // start_date
	endDate?: string; // end_date
	memo?: string; // memo
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
	// 관련 정보 (백엔드 InstanceDetailDto 기준)
	household?: Household;
	userHouseholds?: unknown[]; // 사용자 목록
	serviceConfig?: HouseholdServiceConfig;
	visitConfig?: HouseholdVisitConfig;
}

/**
 * 세대 인스턴스 생성 요청 타입 (백엔드 CreateInstanceDto 기준)
 */
export interface CreateHouseholdInstanceRequest {
	householdId: number; // 세대 ID (생성 시 필요)
	instanceName?: string; // instance_name
	password: string; // password (4자리 숫자)
	startDate?: string; // start_date
	endDate?: string; // end_date
	memo?: string; // memo
}

/**
 * 세대 인스턴스 수정 요청 타입 (백엔드 UpdateInstanceDto 기준 - PartialType)
 */
export interface UpdateHouseholdInstanceRequest {
	instanceName?: string; // instance_name
	password?: string; // password
	startDate?: string; // start_date
	endDate?: string; // end_date
	memo?: string; // memo
}

/**
 * 세대 인스턴스 검색 요청 타입 (백엔드 SearchInstanceDto 기준)
 */
export interface SearchHouseholdInstanceRequest {
	page?: number;
	limit?: number;
	householdId?: number; // household_id
	instanceName?: string; // instance_name
}
// #endregion

// #region 서비스 설정 타입
/**
 * 세대 서비스 설정 타입 (백엔드 HouseholdServiceConfigDto 기준)
 */
export interface HouseholdServiceConfig {
	id: number;
	householdInstanceId: number; // household_instance_id
	canAddNewUser: boolean; // can_add_new_user (기본값: false)
	isCommonEntranceSubscribed: boolean; // is_common_entrance_subscribed (기본값: false)
	isTemporaryAccess: boolean; // is_temporary_access (기본값: false)
	tempCarLimit: number; // temp_car_limit (기본값: 0)
	createdAt: string;
	updatedAt: string;
}

/**
 * 세대 서비스 설정 생성 요청 타입 (백엔드 HouseholdServiceConfigDto 기준)
 */
export interface CreateHouseholdServiceConfigRequest {
	householdInstanceId: number; // household_instance_id
	canAddNewUser?: boolean; // can_add_new_user (기본값: false)
	isCommonEntranceSubscribed?: boolean; // is_common_entrance_subscribed (기본값: false)
	isTemporaryAccess?: boolean; // is_temporary_access (기본값: false)
	tempCarLimit?: number; // temp_car_limit (기본값: 0)
}

/**
 * 세대 서비스 설정 수정 요청 타입 (백엔드 UpdateHouseholdServiceConfigDto 기준)
 */
export interface UpdateHouseholdServiceConfigRequest {
	householdInstanceId: number; // household_instance_id
	canAddNewUser?: boolean; // can_add_new_user
	isCommonEntranceSubscribed?: boolean; // is_common_entrance_subscribed
	isTemporaryAccess?: boolean; // is_temporary_access
	tempCarLimit?: number; // temp_car_limit
}
// #endregion

// #region 방문 설정 타입
/**
 * 세대 방문 설정 타입 (백엔드 HouseholdVisitConfigDto 기준)
 */
export interface HouseholdVisitConfig {
	id: number;
	householdInstanceId: number; // household_instance_id
	availableVisitTime: number; // available_visit_time (기본값: 0)
	purchasedVisitTime: number; // purchased_visit_time (기본값: 0)
	visitRequestLimit: number; // visit_request_limit (기본값: 0)
	createdAt: string;
	updatedAt: string;
}

/**
 * 세대 방문 설정 생성 요청 타입 (백엔드 HouseholdVisitConfigDto 기준)
 */
export interface CreateHouseholdVisitConfigRequest {
	householdInstanceId: number; // household_instance_id
	availableVisitTime?: number; // available_visit_time (기본값: 0)
	purchasedVisitTime?: number; // purchased_visit_time (기본값: 0)
	visitRequestLimit?: number; // visit_request_limit (기본값: 0)
}

/**
 * 세대 방문 설정 수정 요청 타입 (백엔드 UpdateHouseholdVisitConfigDto 기준)
 */
export interface UpdateHouseholdVisitConfigRequest {
	availableVisitTime?: number; // available_visit_time
	purchasedVisitTime?: number; // purchased_visit_time
	visitRequestLimit?: number; // visit_request_limit
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
export type HouseholdInstanceListResponse = ApiResponse<
	PaginatedResponse<HouseholdInstance>
>;

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
export type HouseholdInstanceListByHouseholdResponse = ApiResponse<
	PaginatedResponse<HouseholdInstance>
>;
// #endregion
