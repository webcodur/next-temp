import { LucideIcon } from 'lucide-react';

// #region 사이드바 메뉴 타입 정의
export interface BotItem {
	label: string;
	href: string;
	description?: string;
}

export interface MidItem {
	label: string;
	botItems: BotItem[];
}

export interface TopItem {
	icon: LucideIcon;
	label: string;
	color: string;
	midItems: Record<string, MidItem>;
}

export interface MenuData {
	[key: string]: TopItem;
}
// #endregion

// #region 사이드바 상태 타입
export interface SidebarState {
	topMenu: string;
	midMenu: string;
	midExpanded: Set<string>;
	isCollapsed: boolean;
}
// #endregion

// #region 검색 타입 정의
export interface SearchState {
	query: string;
	isActive: boolean;
}
// #endregion
