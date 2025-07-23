import { atomWithStorage } from 'jotai/utils';

// 인증 상태
export const isAuthenticatedAtom = atomWithStorage<boolean>( 'isAuthenticated', false );

// 사용자 정보
export interface User {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	role?: string;
}
export const userAtom = atomWithStorage<User | null>('user', null);

// 주차장 정보 - API 응답 형식에 맞춤
export interface ParkingLot extends Record<string, unknown> {
	id: number;
	code: string;
	name: string;
	description: string;
}

export const parkingLotsAtom = atomWithStorage<ParkingLot[]>('parkinglots', []);

// 선택된 주차장 ID - API 헤더용
export const selectedParkingLotIdAtom = atomWithStorage<number | null>('selected-parkinglot-id', null);
