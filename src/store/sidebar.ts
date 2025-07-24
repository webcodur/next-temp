'use client';

import { atom } from 'jotai';
import { defaults } from '@/data/sidebarConfig';

// #region localStorage 유틸리티 함수들
// localStorage에서 저장된 패널 폭을 가져오는 함수
const getSavedPanelWidth = () => {
  if (typeof window === 'undefined') return defaults.expandedWidth;
  try {
    const saved = localStorage.getItem('sidebarEndPanelWidth');
    return saved ? parseInt(saved, 10) : defaults.expandedWidth;
  } catch {
    return defaults.expandedWidth;
  }
};

// localStorage에서 사이드바 접힘 상태 가져오기
const getSavedCollapsedState = () => {
  if (typeof window === 'undefined') return false;
  try {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  } catch {
    return false;
  }
};

// localStorage에서 활성 탑 메뉴 가져오기
const getSavedActiveTopMenu = () => {
  if (typeof window === 'undefined') return '주차';
  try {
    const saved = localStorage.getItem('sidebarActiveTopMenu');
    return saved || '주차';
  } catch {
    return '주차';
  }
};

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
// 사이드바의 접힘/펼침 상태 (localStorage 연동)
export const sidebarCollapsedAtom = atom(
  getSavedCollapsedState(),
  (get, set, newValue: boolean) => {
    set(sidebarCollapsedAtom, newValue);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(newValue));
      } catch {
        // localStorage 저장 실패 시 무시
      }
    }
  }
);

// 사이드바 끝 패널 너비 (localStorage 연동)
export const endPanelWidthAtom = atom(
  getSavedPanelWidth(),
  (get, set, newWidth: number) => {
    set(endPanelWidthAtom, newWidth);
    // localStorage에 저장
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sidebarEndPanelWidth', newWidth.toString());
      } catch {
        // localStorage 저장 실패 시 무시
      }
    }
  }
);

// 현재 활성화된 Top 메뉴를 관리하는 atom (localStorage 연동)
export const activeTopMenuAtom = atom(
  getSavedActiveTopMenu(),
  (get, set, newValue: string) => {
    set(activeTopMenuAtom, newValue);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sidebarActiveTopMenu', newValue);
      } catch {
        // localStorage 저장 실패 시 무시
      }
    }
  }
);

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
