/**
 * Auth 관련 타입 정의
 * 
 * 사용자 역할 구조:
 * 1 - SUPER_ADMIN: 최고 관리자 (모든 시스템 권한, admin 계정 생성 가능)
 * 2 - ADMIN: 현장 관리자 (대부분의 관리 권한, admin 계정 생성 불가)
 * 3 - OPERATOR: 운영자 (세대/거주자 관리 및 주차장 운영 업무)
 * 4 - WORKER: 근무자 (현장 업무 및 기본적인 조회/수정 업무)
 * 5 - MERCHANT: 상업자 (상업 시설 관리 및 상가 관련 업무)
 */

export interface AuthRequest {
  account: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  roleId?: number;
  parkingLotId?: number;
  parkinglots?: { id: number; code: string; name: string; description: string }[];
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ApiMessageResponse {
  message?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
} 