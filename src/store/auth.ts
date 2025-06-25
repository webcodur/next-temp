import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// 사용자 정보 타입
export interface User {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	role?: string;
}

// 인증 상태 atom들
export const isAuthenticatedAtom = atomWithStorage<boolean>(
	'isAuthenticated',
	false
);
export const userAtom = atomWithStorage<User | null>('user', null);
export const accessTokenAtom = atomWithStorage<string | null>(
	'accessToken',
	null
);

// 로그인 함수
export const loginAtom = atom(
	null,
	async (
		get,
		set,
		{ email, password }: { email: string; password: string }
	) => {
		try {
			// TODO: 실제 API 호출로 교체
			console.log('로그인 시도:', { email, password });

			// 임시 로그인 처리 (2초 지연)
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// 임시 사용자 데이터
			const userData: User = {
				id: '1',
				name: '김개발자',
				email: email,
				avatar: undefined,
				role: 'admin',
			};

			const token = 'dummy-token-' + Date.now();

			// 상태 업데이트
			set(isAuthenticatedAtom, true);
			set(userAtom, userData);
			set(accessTokenAtom, token);

			return { success: true, user: userData };
		} catch (error) {
			console.error('로그인 실패:', error);
			return { success: false, error: '로그인에 실패했습니다.' };
		}
	}
);

// 로그아웃 함수
export const logoutAtom = atom(null, async (get, set) => {
	try {
		// TODO: 실제 로그아웃 API 호출 (토큰 무효화 등)
		console.log('로그아웃 처리');

		// 상태 초기화
		set(isAuthenticatedAtom, false);
		set(userAtom, null);
		set(accessTokenAtom, null);

		return { success: true };
	} catch (error) {
		console.error('로그아웃 실패:', error);
		return { success: false, error: '로그아웃에 실패했습니다.' };
	}
});
