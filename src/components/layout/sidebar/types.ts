import { LucideIcon } from 'lucide-react';

// #region 사이드바 메뉴 타입 정의
export interface BotMenu {
	label: string;
	href: string;
	description?: string;
	icon?: LucideIcon;
}

export interface MidMenu {
	label: string;
	icon?: LucideIcon;
	botItems: BotMenu[];
}

export interface TopItem {
	icon: LucideIcon;
	label: string;
	color: string;
	midItems: Record<string, MidMenu>;
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
