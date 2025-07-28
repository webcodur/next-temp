import { atom } from 'jotai';

// 사이드바 상태
export const sidebarCollapsedAtom = atom(false);
export const headerCollapsedAtom = atom(false);

// 관리자 모드
export const isAdminModeAtom = atom(false);

// API 문서 상태
export interface ApiEndpoint {
  method: string;
  path: string;
  description?: string;
}

export interface ApiDocState {
  apiName: string;
  endpoints: ApiEndpoint[];
  targetMethod: string;
}

export const apiDocStateAtom = atom<ApiDocState>({
  apiName: '',
  endpoints: [],
  targetMethod: '전체',
});

// 메뉴 상태
export const currentTopMenuAtom = atom('');
export const currentMidMenuAtom = atom('');
export const currentBotMenuAtom = atom('');

// 페이지 라벨 상태
export interface PageLabelState {
  label: string;
  href: string;
}

export const currentPageLabelAtom = atom<PageLabelState | null>(null);

// 검색 상태
export const menuSearchQueryAtom = atom('');
export const menuSearchActiveAtom = atom(false); 