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
  '관리자': 1,
  '현장 관리자': 2,
  '운영자': 3, 
  '근무자': 4,
  '상업자': 5,
} as const;

/**
 * 역할 ID → 역할명 매핑
 */
export const ROLE_NAME_MAP: Record<number, string> = {
  4: '근무자',
  3: '운영자',
  2: '현장 관리자',
  5: '상업자',
  1: '관리자', // Super Admin 추가
} as const;

/**
 * 권한 레벨 정의
 */
export const ROLE_HIERARCHY: Record<number, number> = {
  1: 100, // 관리자 (최고 권한)
  2: 80,  // 현장 관리자
  3: 60,  // 운영자
  5: 40,  // 상업자
  4: 20,  // 근무자
} as const;

/**
 * 비밀번호 재설정 권한 확인
 * - 본인만 자신의 비밀번호 재설정 가능
 */
export function canManagePassword(currentUserRoleId: number, targetUserRoleId: number): boolean {
  // 자기 자신만 비밀번호 재설정 가능
  return currentUserRoleId === targetUserRoleId;
}

/**
 * 비밀번호 초기화 권한 확인
 * - 관리자 (super_admin, admin): 직원의 비밀번호 초기화 가능
 * - 직원: 초기화 불가능
 */
export function canResetPassword(currentUserRoleId: number, targetUserRoleId: number): boolean {
  // 관리자 (roleId 1, 2)만 직원(roleId 3,4,5)의 비밀번호 초기화 가능
  const isCurrentAdmin = currentUserRoleId === 1 || currentUserRoleId === 2;
  const isTargetEmployee = targetUserRoleId >= 3; // 운영자, 근무자, 상업자
  
  return isCurrentAdmin && isTargetEmployee;
} 