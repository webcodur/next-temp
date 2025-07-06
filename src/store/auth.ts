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
		{ username, password }: { username: string; password: string }
	) => {
		try {
			console.log('로그인 시도:', { username, password });

			// 임시 로그인 처리 (1초 지연)
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// 운영진 계정 확인
			const isAdmin = username === 'admin' && password === '1234';

			// 기본 로그인 검증 (데모용)
			if (isAdmin || (username.length >= 2 && password.length >= 4)) {
				// 사용자 데이터 설정
				const userData: User = {
					id: isAdmin ? 'admin' : username,
					name: isAdmin ? '관리자' : `${username}님`,
					email: isAdmin ? 'admin@system.com' : `${username}@example.com`,
					avatar: undefined,
					role: isAdmin ? 'admin' : 'user',
				};

				const token = 'token-' + Date.now();

				// 상태 업데이트
				set(isAuthenticatedAtom, true);
				set(userAtom, userData);
				set(accessTokenAtom, token);

				return { success: true, user: userData };
			} else {
				return {
					success: false,
					error: '아이디 또는 비밀번호가 올바르지 않습니다.',
				};
			}
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
