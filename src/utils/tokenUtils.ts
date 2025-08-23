/* 
  파일명: /utils/tokenUtils.ts
  기능: JWT 토큰 관리 유틸리티
  책임: 쿠키 기반 토큰 저장/조회/삭제, JWT 페이로드 디코딩 및 사용자 정보 추출
  백엔드 토큰 구조: { sub: 사용자ID, role: 역할ID, parkinglot: 주차장ID }
*/ // ------------------------------

// #region 상수 정의
const DEFAULT_TOKEN_MAX_AGE = 86400; // 24시간 (초 단위)
export const ACCESS_TOKEN_NAME = 'access-token';
export const REFRESH_TOKEN_NAME = 'refresh-token';

// JWT 페이로드 타입 (백엔드와 동일한 구조)
interface JwtPayload {
	sub: number; // 사용자 ID
	role: number; // 역할 ID (1: SuperAdmin, 2: Admin, 3: Normal)
	parkinglot: number; // 주차장 ID
	exp?: number; // 만료시간
	iat?: number; // 발급시간
	type?: string; // 토큰 타입 ('JWT' | 'REFRESH')
}
// #endregion

// #region JWT 토큰 디코딩
// JWT 토큰의 페이로드를 디코딩하는 함수
export const decodeJwtPayload = (token: string): JwtPayload | null => {
	try {
		// JWT는 header.payload.signature 형태
		const parts = token.split('.');
		if (parts.length !== 3) {
			console.warn('Invalid JWT token format');
			return null;
		}

		// 페이로드 부분을 base64 디코딩
		const payload = parts[1];
		// base64url 디코딩 (- _ 처리)
		const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
		return JSON.parse(decoded);
	} catch (error) {
		console.error('JWT 토큰 디코딩 실패:', error);
		return null;
	}
};

// 액세스 토큰에서 roleId 추출 (1: SuperAdmin, 2: Admin, 3: Normal)
export const getRoleIdFromToken = (): number | null => {
	if (typeof window === 'undefined') return null;

	const accessToken = getTokenFromCookie(ACCESS_TOKEN_NAME);
	if (!accessToken) return null;

	const payload = decodeJwtPayload(accessToken);
	if (!payload) return null;

	return payload.role || null;
};

// 액세스 토큰에서 사용자 ID 추출
export const getUserIdFromToken = (): number | null => {
	if (typeof window === 'undefined') return null;

	const accessToken = getTokenFromCookie(ACCESS_TOKEN_NAME);
	if (!accessToken) return null;

	const payload = decodeJwtPayload(accessToken);
	if (!payload) return null;

	return payload.sub;
};

// 액세스 토큰에서 주차장 ID 추출
export const getParkinglotIdFromToken = (): number | null => {
	if (typeof window === 'undefined') return null;

	const accessToken = getTokenFromCookie(ACCESS_TOKEN_NAME);
	if (!accessToken) return null;

	const payload = decodeJwtPayload(accessToken);
	if (!payload) return null;

	return payload.parkinglot;
};

// 모든 사용자 정보를 한 번에 추출
export const getUserInfoFromToken = () => {
	if (typeof window === 'undefined') return null;

	const accessToken = getTokenFromCookie(ACCESS_TOKEN_NAME);
	if (!accessToken) return null;

	const payload = decodeJwtPayload(accessToken);
	if (!payload) return null;

	return {
		userId: payload.sub,
		roleId: payload.role,
		parkinglotId: payload.parkinglot,
		tokenType: payload.type,
	};
};

// 디버깅용: 현재 액세스 토큰의 전체 페이로드 확인
export const debugTokenPayload = (): JwtPayload | null => {
	if (typeof window === 'undefined') return null;

	const accessToken = getTokenFromCookie(ACCESS_TOKEN_NAME);
	if (!accessToken) {
		return null;
	}

	const payload = decodeJwtPayload(accessToken);
	// JWT 토큰 디버깅 정보 출력 완료

	return payload;
};
// #endregion

// #region 쿠키 관리 유틸리티
// 쿠키에서 토큰 값 추출
export const getTokenFromCookie = (tokenName: string): string | null => {
	if (typeof document === 'undefined') return null;

	return (
		document.cookie
			.split('; ')
			.find((row) => row.startsWith(`${tokenName}=`))
			?.split('=')[1] || null
	);
};

// 쿠키에 토큰 저장
export const setTokenToCookie = (
	tokenName: string,
	token: string,
	maxAge: number = DEFAULT_TOKEN_MAX_AGE
) => {
	if (typeof document === 'undefined') return;

	document.cookie = `${tokenName}=${token}; path=/; max-age=${maxAge}`;
};

// 쿠키에서 토큰 삭제
export const removeTokenFromCookie = (tokenName: string) => {
	if (typeof document === 'undefined') return;

	document.cookie = `${tokenName}=; path=/; max-age=0`;
};

// 모든 토큰 쿠키 삭제
export const clearAllTokens = () => {
	removeTokenFromCookie(ACCESS_TOKEN_NAME);
	removeTokenFromCookie(REFRESH_TOKEN_NAME);
	// roleId는 토큰에서 자동 추출되므로 별도 정리 불필요
};
// #endregion
