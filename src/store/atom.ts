import { atom } from 'jotai';

// 사이드바 상태
export const sidebarCollapsedAtom = atom(false);
export const headerCollapsedAtom = atom(false);

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



// 검색 상태
export const menuSearchQueryAtom = atom('');
export const menuSearchActiveAtom = atom(false); 