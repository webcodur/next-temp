import { atomWithStorage } from 'jotai/utils';

// 인증 상태
export const isAuthenticatedAtom = atomWithStorage<boolean>( 'isAuthenticated', false );

// 사용자 정보
interface User {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	role?: string;
}
export const userAtom = atomWithStorage<User | null>('user', null);
