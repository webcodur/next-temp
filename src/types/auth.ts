/**
 * Auth 관련 타입 정의
 */

export interface AuthRequest {
  account: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
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