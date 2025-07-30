import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// #region 핵심 상태 (4개만)
// 인증 상태
export const isAuthenticatedAtom = atomWithStorage<boolean>('isAuthenticated', false);

// 사용자 프로필 (토큰에 없는 정보)
export interface UserProfile {
  account: string;
  name: string;
  email?: string;
  avatar?: string;
}

export const userProfileAtom = atomWithStorage<UserProfile | null>('user-profile', null);

// 주차장 목록
export interface ParkingLot extends Record<string, unknown> {
  id: number;
  code: string;
  name: string;
  description: string;
}
export const parkingLotsAtom = atomWithStorage<ParkingLot[]>('parkinglots', []);

// 선택된 주차장 ID (토큰 기반)
export const selectedParkingLotIdAtom = atom<number | null>(null);

// 최고관리자 수동 선택 주차장 ID  
export const manualParkingLotIdAtom = atomWithStorage<number | null>('manual-parking-lot-id', null);
// #endregion
