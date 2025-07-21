// Admin API 관련 공통 타입 정의 (DTO 기반)

/**
 * Admin 기본 타입 (AdminListDto 기준)
 */
export interface Admin {
  id: number;
  account: string;
  roleId: number;
  parkinglotId?: number;
  name?: string;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  role?: {
    id: number;
    code: string;
    name: string;
    description?: string;
  };
  parkinglot?: {
    id: number;
    code: string;
    name: string;
    description?: string;
  };
  [key: string]: unknown; // BaseTable 호환을 위한 인덱스 시그니처
}

/**
 * Admin 생성 요청 타입 (CreateAdminDto 기준)
 */
export interface CreateAdminRequest {
  account: string;
  password: string;
  name: string;
  roleId: number;
  email?: string;
  phone?: string;
  parkinglotId?: number;
}

/**
 * Admin 수정 요청 타입 (UpdateAdminDto 기준)
 */
export interface UpdateAdminRequest {
  id: number;
  roleId?: number;
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
}

/**
 * Admin 검색 요청 타입 (SearchAdminDto 기준)
 */
export interface SearchAdminRequest {
  page?: number;
  limit?: number;
  account?: string;
  name?: string;
  email?: string;
  roleId?: number;
}

/**
 * 역할명 → ID 매핑
 */
export const ROLE_ID_MAP: Record<string, number> = {
  '근무자': 4,
  '운영자': 3, 
  '현장 관리자': 2,
  '상업자': 5,
} as const; 