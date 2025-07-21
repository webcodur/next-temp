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

// 주차장 정보 - 실제 API 응답에 맞춰 수정
export interface ParkingLot {
	id: string;
	code: string;
	name: string;
	description: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

export const parkingLotsAtom = atomWithStorage<ParkingLot[]>('parkinglots', []);
