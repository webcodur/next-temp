import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { defaults } from '@/data/sidebarConfig';

export const R_PANEL_MIN_WIDTH = 180;
export const R_PANEL_MAX_WIDTH = 500;

export const rPanelWidthAtom = atom(defaults.sidebarWidth - defaults.leftColumnWidth);
export const isResizingAtom = atom(false);
export const isResizeHandleHoveredAtom = atom(false);

export const sidebarCollapsedAtom = atom<boolean>(false);
export const headerCollapsedAtom = atom<boolean>(false);

// 헤더 토글 표시 상태 (애니메이션 제어용)
export const headerToggleVisibleAtom = atom<boolean>(true);

export const currentTopMenuAtom = atom<string>('');
export const currentMidMenuAtom = atom<string>('');
export const currentBotMenuAtom = atom<string>('');

// Hydration-safe: 초기화 시 localStorage 읽지 않음
export const singleOpenModeAtom = atomWithStorage<boolean>(
	'singleOpenMode',
	false,
	undefined,
	{ getOnInit: false }
);

// 메뉴 검색 관련 atom들
export const menuSearchQueryAtom = atom<string>('');
export const menuSearchResultsAtom = atom<
	Array<{
		type: 'mid' | 'bot';
		topKey: string;
		midKey: string;
		item: {
			key: string;
			'kor-name': string;
			'eng-name': string;
			href?: string;
			description?: string;
		};
	}>
>([]);
export const menuSearchActiveAtom = atom<boolean>(false);

// 최근 접속 메뉴 관련 atom들 - Hydration-safe
export const recentMenusAtom = atomWithStorage<
	Array<{
		type: 'bot';
		topKey: string;
		midKey: string;
		item: {
			key: string;
			'kor-name': string;
			'eng-name': string;
			href: string;
			description?: string;
		};
		accessedAt: number;
	}>
>('recentMenus', [], undefined, { getOnInit: false });

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
export const recentSitesAtom = atomWithStorage<
	Array<{
		id: string;
		name: string;
		address: string;
		description?: string;
		accessedAt: number;
	}>
>('recentSites', [], undefined, { getOnInit: false });
