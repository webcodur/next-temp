/**
 * JWT 토큰 관련 유틸리티
 */

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
  iss?: string;
  aud?: string;
}

/**
 * JWT 토큰 디코딩 (서명 검증 없이)
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * 토큰 만료 여부 확인
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload?.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

/**
 * 토큰 유효성 검증 (클라이언트용)
 */
export function isValidToken(token: string | undefined | null): boolean {
  if (!token) return false;
  
  try {
    // 기본 구조 확인
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    // 만료 시간 확인
    return !isTokenExpired(token);
  } catch {
    return false;
  }
}

/**
 * 서버용 토큰 검증 (실제 환경에서는 JWT 라이브러리 사용)
 */
export async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  try {
    // 기본적인 토큰 구조 확인
    const payload = decodeToken(token);
    if (!payload) return false;

    // 만료 시간 확인
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }

    // TODO: 실제 환경에서는 JWT 서명 검증 추가
    // const secret = process.env.JWT_SECRET;
    // await jwtVerify(token, new TextEncoder().encode(secret));

    return true;
  } catch {
    return false;
  }
}

/**
 * 토큰에서 사용자 정보 추출
 */
export function getUserFromToken(token: string): JwtPayload | null {
  if (!isValidToken(token)) return null;
  return decodeToken(token);
} 