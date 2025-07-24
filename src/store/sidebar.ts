'use client';

import { atom } from 'jotai';
import { defaults } from '@/data/sidebarConfig';

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

// 사이드바의 접힘/펼침 상태 (메인 토글)
export const sidebarCollapsedAtom = atom<boolean>(false);
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
// 리사이징 상태
export const isResizingAtom = atom(false);
export const isSideResizeControlHoveredAtom = atom(false);

// 현재 활성화된 Top 메뉴를 관리하는 atom
export const activeTopMenuAtom = atom('주차');

export const headerCollapsedAtom = atom<boolean>(false);

// 헤더 토글 표시 상태 (애니메이션 제어용)
export const headerToggleVisibleAtom = atom<boolean>(true);

export const currentTopMenuAtom = atom<string>('');
export const currentMidMenuAtom = atom<string>('');
export const currentBotMenuAtom = atom<string>('');

// Hydration-safe: 초기화 시 localStorage 읽지 않음
export const singleOpenModeAtom = atom<boolean>(false);

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
