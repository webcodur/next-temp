'use client';

import { atom } from 'jotai';
import { defaults } from '@/data/sidebarConfig';

// #region localStorage 유틸리티 함수들
// localStorage에서 단일 열기 모드 상태 가져오기
const getSavedSingleOpenMode = () => {
  if (typeof window === 'undefined') return false;
  try {
    const saved = localStorage.getItem('sidebarSingleOpenMode');
    return saved ? JSON.parse(saved) : false;
  } catch {
    return false;
  }
};
// #endregion

// #region 사이드바 상태 atom들
// 중복 정의 방지: sidebarCollapsedAtom, endPanelWidthAtom, activeTopMenuAtom은 
// src/store/ui.ts에서 정의되어 있으므로 이곳에서는 제거

// 사이드바 접힘/펼침 상태는 src/store/ui.ts에서 관리
// export const sidebarCollapsedAtom = ...

// 사이드바 끝 패널 너비는 src/store/ui.ts에서 관리  
// export const endPanelWidthAtom = ...

// 활성 탑 메뉴는 src/store/ui.ts에서 관리
// export const activeTopMenuAtom = ...

// 단일 열기 모드 상태 (localStorage 연동)
export const singleOpenModeAtom = atom(
  getSavedSingleOpenMode(),
  (get, set, newValue: boolean) => {
    set(singleOpenModeAtom, newValue);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sidebarSingleOpenMode', JSON.stringify(newValue));
      } catch {
        // localStorage 저장 실패 시 무시
      }
    }
  }
);
// #endregion

// #region 기타 상태 atom들
// 리사이징 상태
export const isResizingAtom = atom(false);
export const isSideResizeControlHoveredAtom = atom(false);

export const headerCollapsedAtom = atom<boolean>(false);

// 헤더 토글 표시 상태 (애니메이션 제어용)
export const headerToggleVisibleAtom = atom<boolean>(true);

export const currentTopMenuAtom = atom<string>('');
export const currentMidMenuAtom = atom<string>('');
export const currentBotMenuAtom = atom<string>('');
// #endregion

// #region 검색 관련 atom들
// 메뉴 검색 관련 atom들 - 언어팩 시스템 사용
export const menuSearchQueryAtom = atom<string>('');
export const menuSearchResultsAtom = atom<
	Array<{
		type: 'mid' | 'bot';
		topKey: string;
		midKey: string;
		item: {
			key: string;
			href?: string;
		};
	}>
>([]);
export const menuSearchActiveAtom = atom<boolean>(false);

// 최근 접속 메뉴 관련 atom들 - Hydration-safe, 언어팩 시스템 사용
export const recentMenusAtom = atom<
	Array<{
		type: 'bot';
		topKey: string;
		midKey: string;
		botKey: string;
		label: string;
		href: string;
	}>
>([]);

// 현장 검색 관련 atom들
export const siteSearchQueryAtom = atom<string>('');
export const siteSearchResultsAtom = atom<
	Array<{
		id: string;
		name: string;
		address: string;
		description?: string;
		accessedAt?: number;
	}>
>([]);
export const siteSearchActiveAtom = atom<boolean>(false);

// 최근 접속 현장 관련 atom들 - Hydration-safe
export const recentSitesAtom = atom<
	Array<{
		id: string;
		name: string;
	}>
>([]);
// #endregion
