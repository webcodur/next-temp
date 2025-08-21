'use client';
import returnFetch from 'return-fetch';
import {
	getParkinglotIdFromToken,
	getRoleIdFromToken,
} from '@/utils/tokenUtils';

// 동적 import로 토스트 사용 (SSR 문제 방지)
let toastInstance: typeof import('@/components/ui/ui-effects/toast/Toast').customToast | null = null;

const loadToast = async () => {
	if (!toastInstance && typeof window !== 'undefined') {
		const { customToast } = await import('@/components/ui/ui-effects/toast/Toast');
		toastInstance = customToast;
	}
	return toastInstance;
};

const URL_PROD = process.env.NEXT_PUBLIC_API_PROD_URL;
const URL_TEST = process.env.NEXT_PUBLIC_API_TEST_URL;
const deployMode = process.env.NEXT_PUBLIC_NODE_ENV;
const baseUrl = deployMode === 'production' ? URL_PROD : URL_TEST;

/**
 * 쿠키에서 토큰 가져오기
 */
const getTokenFromCookie = (tokenName: string): string | null => {
	if (typeof document === 'undefined') return null;
	return (
		document.cookie
			.split('; ')
			.find((row) => row.startsWith(`${tokenName}=`))
			?.split('=')[1] || null
	);
};

/**
 * 로컬스토리지에서 수동 선택된 주차장 ID 가져오기 (최고관리자용)
 */
const getManualParkingLotId = (): number | null => {
	if (typeof window === 'undefined') return null;
	try {
		const stored = localStorage.getItem('manual-parking-lot-id');
		return stored ? JSON.parse(stored) : null;
	} catch {
		return null;
	}
};

/**
 * 효과적인 주차장 ID 계산 (토큰 + 수동선택 조합)
 * - 최고관리자(roleId: 1, parkinglot: 0)인 경우: 수동 선택된 주차장 ID 사용
 * - 일반 사용자인 경우: 토큰의 주차장 ID 사용
 */
const getEffectiveParkingLotId = (): number | null => {
	const tokenParkingLotId = getParkinglotIdFromToken();
	const roleId = getRoleIdFromToken();

	// 최고관리자(roleId: 1)이고 토큰 주차장 ID가 0인 경우
	if (roleId === 1 && tokenParkingLotId === 0) {
		const manualId = getManualParkingLotId();
		return manualId;
	}

	// 일반 사용자는 토큰 기반
	return tokenParkingLotId;
};

//#region 전역 에러 처리


/**
 * 에러 데이터 타입 정의
 */
interface ErrorData {
	errorCode?: string;
	code?: string;
	message?: string;
	[key: string]: unknown;
}

/**
 * 전역 에러 처리 함수
 */
const handleGlobalError = async (errorData: ErrorData, statusCode: number): Promise<void> => {
	const toast = await loadToast();
	if (!toast) return;

	// 에러 코드 추출
	const errorCode = errorData.errorCode || errorData.code;
	
	// 서버 메시지를 그대로 사용 (매핑하지 않음)
	const userMessage = errorData.message || '오류가 발생했습니다';
	
	// 개발 환경에서는 콘솔에 상세 정보 로깅
	if (process.env.NODE_ENV === 'development') {
		console.group('🚨 Global Error Handler - Developer Info');
		if (errorCode) {
			console.log('🔍 Server Error Code:', errorCode);
		}
		console.log('📊 HTTP Status:', statusCode);
		console.log('📝 Server Message:', userMessage);
		console.log('📦 Full Error Data:', errorData);
		console.groupEnd();
	}
	
	// 에러 코드가 있으면 뱃지 형태로 함께 표시
	if (errorCode) {
		// React.createElement를 사용한 뱃지 형태 토스트
		const React = await import('react');
		
		toast.custom(() => 
			React.createElement('div', {
				style: {
					display: 'flex',
					alignItems: 'center',
					gap: '8px',
					fontFamily: 'var(--font-multilang)',
					fontSize: '16px',
					fontWeight: '700',
					color: 'hsl(var(--destructive-foreground))'
				}
			}, [
				React.createElement('span', {
					key: 'badge',
					style: {
						display: 'inline-block',
						padding: '3px 8px',
						fontSize: '12px',
						fontWeight: '700',
						letterSpacing: '0.5px',
						backgroundColor: 'rgba(255, 255, 255, 0.9)',
						color: 'rgb(185, 28, 28)',
						border: '1px solid rgba(185, 28, 28, 0.3)',
						borderRadius: '6px',
						textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
					}
				}, errorCode),
				React.createElement('span', { 
					key: 'message',
					style: { fontWeight: '700' }
				}, userMessage)
			]), 
			{ 
				duration: 5000,
				style: {
					background: 'hsl(var(--destructive))',
					borderColor: 'hsl(var(--destructive))',
					color: 'hsl(var(--destructive-foreground))',
					fontFamily: 'var(--font-multilang)',
					fontSize: '16px',
					fontWeight: '700'
				}
			}
		);
	} else {
		// 에러 코드가 없으면 일반 메시지만
		toast.error(userMessage);
	}
	
	// 토큰 만료 처리 (401 상태코드 기준)
	if (statusCode === 401) {
		// 토큰 만료 시 로그아웃 처리 (필요시)
		setTimeout(() => {
			// 로그아웃 로직 추가 가능
		}, 2000);
	}
};
//#endregion

export const fetchDefault = returnFetch({
	baseUrl: baseUrl,
	interceptors: {
		request: async (args) => {
			if (args[1]) {
				const accessToken = getTokenFromCookie('access-token');
				const parkingLotId = getEffectiveParkingLotId();

				// 헤더 설정
				args[1].headers = {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken || ''}`,
					...(parkingLotId && { 'x-parkinglot-id': parkingLotId.toString() }),
					...args[1].headers, // 기존 헤더 보존
				};
			}
			return args;
		},
		response: async (response) => {
			// 에러 응답 처리
			if (!response.ok) {
				try {
					const errorData = await response.clone().json();
					if (errorData && typeof errorData === 'object') {
						// 전역 에러 처리 트리거
						handleGlobalError(errorData, response.status);
					}
				} catch {
					// JSON 파싱 실패 시 기본 에러 처리
					handleGlobalError({
						errorCode: `HTTP_${response.status}`,
						message: response.statusText || '알 수 없는 오류가 발생했습니다',
						statusCode: response.status
					}, response.status);
				}
			}
			return response;
		},
	},
});

export const fetchForm = returnFetch({
	baseUrl: baseUrl,
	interceptors: {
		request: async (args) => {
			if (args[1]) {
				const accessToken = getTokenFromCookie('access-token');
				const parkingLotId = getEffectiveParkingLotId();

				args[1].headers = {
					...args[1].headers,
					Authorization: `Bearer ${accessToken || ''}`,
					...(parkingLotId && { 'x-parkinglot-id': parkingLotId.toString() }),
				};
			}
			return args;
		},
		response: async (response) => {
			// 에러 응답 처리
			if (!response.ok) {
				try {
					const errorData = await response.clone().json();
					if (errorData && typeof errorData === 'object') {
						// 전역 에러 처리 트리거
						handleGlobalError(errorData, response.status);
					}
				} catch {
					// JSON 파싱 실패 시 기본 에러 처리
					handleGlobalError({
						errorCode: `HTTP_${response.status}`,
						message: response.statusText || '알 수 없는 오류가 발생했습니다',
						statusCode: response.status
					}, response.status);
				}
			}
			return response;
		},
	},
});
