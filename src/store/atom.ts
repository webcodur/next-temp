import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

// 사이드바 상태
export const sidebarCollapsedAtom = atom(false);
export const headerCollapsedAtom = atom(false);



// 사용자 정보
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export const userAtom = atomWithStorage<User | null>(
  'user',
  null,
  createJSONStorage(() => sessionStorage)
);

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

// 검색 상태
export const menuSearchQueryAtom = atom('');
export const menuSearchActiveAtom = atom(false); 