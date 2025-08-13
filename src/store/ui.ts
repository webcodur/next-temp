'use client';

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// #region 사이드바 상태
// 사이드바 접힘/펼침 상태
export const sidebarCollapsedAtom = atomWithStorage<boolean>('sidebar-collapsed', true);

// 사이드바 끝 패널 너비
export const endPanelWidthAtom = atomWithStorage<number>('sidebar-width', 320);

// 활성 탑 메뉴 (간소화)
export const activeTopMenuAtom = atomWithStorage<string>('active-top-menu', '주차');

// 리사이징 상태 (메모리만)
export const isResizingAtom = atom<boolean>(false);
export const isSideResizeControlHoveredAtom = atom<boolean>(false);
// #endregion

// #region 모달 상태
// 검색 모달
export const searchModalOpenAtom = atom<boolean>(false);

// 주차장 선택 모달
export const parkingLotSelectionModalOpenAtom = atom<boolean>(false);
// #endregion

// #region 페이지 상태


// 메뉴 상태
export const currentTopMenuAtom = atom<string>('');
export const currentMidMenuAtom = atom<string>('');
export const currentBotMenuAtom = atom<string>('');
export const menuSearchQueryAtom = atom<string>('');
export const menuSearchActiveAtom = atom<boolean>(false);
// #endregion

// #region 색상 상태 (간소화)
// 프라이머리 색상
export const primaryColorAtom = atomWithStorage<string>('primary-color', '220 90% 55%');

// 프라이머리 색상 설정
export const setPrimaryColorAtom = atom(null, (get, set, newColor: string) => {
  set(primaryColorAtom, newColor);
  if (typeof window !== 'undefined') {
    document.documentElement.style.setProperty('--primary', newColor);
  }
});

// 프라이머리 색상 초기화
export const initPrimaryColorAtom = atom(null, (get) => {
  if (typeof window !== 'undefined') {
    const primaryColor = get(primaryColorAtom);
    document.documentElement.style.setProperty('--primary', primaryColor);
  }
});
// #endregion
