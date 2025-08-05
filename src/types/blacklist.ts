// 블랙리스트 관련 타입 정의

// 블랙리스트 유형
export type BlacklistType = 'AUTO' | 'MANUAL';

// 블랙리스트 등록 사유
export type BlacklistRegistrationReason = 
  | 'VIOLATION_ACCUMULATION'
  | 'SERIOUS_VIOLATION'
  | 'REPEATED_OFFENDER'
  | 'SECURITY_THREAT'
  | 'CIVIL_COMPLAINT'
  | 'COURT_ORDER'
  | 'ADMIN_DISCRETION'
  | 'OTHER';

// 수동 블랙리스트 등록 요청
export interface CreateManualBlacklistRequest {
  carNumber: string;
  registrationReason: BlacklistRegistrationReason;
  blockPeriodDays?: number;
  description?: string;
}

// 블랙리스트 응답
export interface BlacklistResponse {
  id: number;
  carNumber: string;
  blacklistType: BlacklistType;
  registrationReason: BlacklistRegistrationReason;
  blockPeriodDays?: number;
  description?: string;
  isActive: boolean;
  registeredAt: string;
  expiresAt?: string;
  unblockReason?: string;
  unblockedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 블랙리스트 수정 요청
export interface UpdateBlacklistRequest {
  registrationReason: BlacklistRegistrationReason;
  blockedUntil: string; // ISO 8601 형식
  description?: string;
  unblockReason?: string;
}

// 블랙리스트 해제 요청
export interface UnblockBlacklistRequest {
  unblockReason: string;
}

// 차량 블랙리스트 상태
export interface BlacklistStatusResponse {
  carNumber: string;
  isBlacklisted: boolean;
  blacklistInfo?: {
    id: number;
    blacklistType: BlacklistType;
    registrationReason: BlacklistRegistrationReason;
    registeredAt: string;
    expiresAt?: string;
    description?: string;
  };
}

// 블랙리스트 목록 검색 요청
export interface SearchBlacklistRequest {
  carNumber?: string;
  blacklistType?: BlacklistType;
  registrationReason?: BlacklistRegistrationReason;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// 페이지네이션 응답
export interface PageResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}