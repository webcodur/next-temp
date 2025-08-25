'use client';
import returnFetch from 'return-fetch';
import {
	getParkinglotIdFromToken,
	getRoleIdFromToken,
} from '@/utils/tokenUtils';
import { API_ERRORS, type ApiErrorKey } from '@/constants/apiErrors';

// 동적 import로 토스트 사용 (SSR 문제 방지)
let toastInstance:
	| typeof import('@/components/ui/ui-effects/toast/Toast').customToast
	| null = null;

const loadToast = async () => {
	if (!toastInstance && typeof window !== 'undefined') {
		const { customToast } = await import(
			'@/components/ui/ui-effects/toast/Toast'
		);
		toastInstance = customToast;
	}
	return toastInstance;
};

/**
 * URL을 기반으로 API 키 추론
 */
const inferApiKeyFromUrl = (url: string): ApiErrorKey => {
	// URL에서 패스만 추출 (baseUrl 제거)
	const path = url.replace(baseUrl || '', '').replace(/^\//, '');
	
	// API 패스를 서비스_액션 형태로 변환
	const segments = path.split('/');
	const service = segments[0];
	
	// HTTP 메서드별 액션 매핑 (기본값)
	let action = 'unknown';
	
	// 일반적인 RESTful 패턴 추론
	if (segments.length === 1) {
		action = 'search'; // GET /admin -> admin_search
	} else if (segments.length === 2) {
		if (segments[1] === 'status' || segments[1] === 'stats' || segments[1] === 'history') {
			action = segments[1]; // GET /cache/stats -> cache_stats
		} else {
			action = 'detail'; // GET /admin/123 -> admin_detail
		}
	} else if (segments.length === 3) {
		action = segments[2]; // POST /admin/123/password_reset -> admin_password_reset
	}
	
	const apiKey = `${service}_${action}` as ApiErrorKey;
	
	// API_ERRORS에 해당 키가 있는지 확인
	if (API_ERRORS[apiKey]) {
		return apiKey;
	}
	
	// 기본값 반환
	return 'unknown_error';
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
const handleGlobalError = async (
	errorData: ErrorData,
	statusCode: number,
	url?: string
): Promise<void> => {
	const toast = await loadToast();
	if (!toast) return;

	// React 동적 임포트
	const React = await import('react');

	// 에러 코드 추출
	const errorCode = errorData.errorCode || errorData.code;

	// URL에서 API 키 추론하여 커스텀 메시지 사용
	let userMessage: string;
	if (url) {
		const apiKey = inferApiKeyFromUrl(url);
		const baseMessage = API_ERRORS[apiKey] || API_ERRORS['unknown_error'];
		userMessage = `${baseMessage}: ${statusCode}`;
	} else {
		userMessage = errorData.message || '오류가 발생했습니다';
	}

	// 에러 코드가 있으면 뱃지 형태로 함께 표시
	if (errorCode) {
		// 에러코드가 있는 경우 뱃지 형태로 표시

		toast.custom(
			() =>
				React.createElement(
					'div',
					{
						style: {
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							fontFamily: 'var(--font-multilang)',
							fontSize: '16px',
							fontWeight: '700',
							color: 'hsl(var(--destructive-foreground))',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						},
					},
					[
						React.createElement(
							'span',
							{
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
									textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
								},
							},
							errorCode
						),
						React.createElement(
							'span',
							{
								key: 'message',
								style: { fontWeight: '700' },
							},
							userMessage
						),
					]
				),
			{
				duration: 5000,
				style: {
					background: 'hsl(var(--destructive))',
					borderColor: 'hsl(var(--destructive))',
					color: 'hsl(var(--destructive-foreground))',
					fontFamily: 'var(--font-multilang)',
					fontSize: '16px',
					fontWeight: '700',
					maxWidth: '400px',
					whiteSpace: 'nowrap',
				},
			}
		);
	} else {
		// 에러 코드가 없어도 커스텀 토스트 사용 (줄바꿈 방지)
		toast.custom(
			() =>
				React.createElement(
					'div',
					{
						style: {
							fontFamily: 'var(--font-multilang)',
							fontSize: '16px',
							fontWeight: '700',
							color: 'hsl(var(--destructive-foreground))',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						},
					},
					userMessage
				),
			{
				duration: 5000,
				style: {
					background: 'hsl(var(--destructive))',
					borderColor: 'hsl(var(--destructive))',
					color: 'hsl(var(--destructive-foreground))',
					fontFamily: 'var(--font-multilang)',
					fontSize: '16px',
					fontWeight: '700',
					maxWidth: '400px',
				},
			}
		);
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
						handleGlobalError(errorData, response.status, response.url);
					}
				} catch {
					// JSON 파싱 실패 시 기본 에러 처리
					handleGlobalError(
						{
							errorCode: `HTTP_${response.status}`,
							message: response.statusText || '알 수 없는 오류가 발생했습니다',
							statusCode: response.status,
						},
						response.status,
						response.url
					);
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
						handleGlobalError(errorData, response.status, response.url);
					}
				} catch {
					// JSON 파싱 실패 시 기본 에러 처리
					handleGlobalError(
						{
							errorCode: `HTTP_${response.status}`,
							message: response.statusText || '알 수 없는 오류가 발생했습니다',
							statusCode: response.status,
						},
						response.status,
						response.url
					);
				}
			}
			return response;
		},
	},
});
