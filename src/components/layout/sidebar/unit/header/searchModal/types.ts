/**
 * 검색 모달 관련 타입 정의
 */

export type SiteResult = {
	id: string;
	name: string;
	address: string;
	description?: string;
	accessedAt?: number;
};

export type MenuResult = {
	type: 'mid' | 'bot';
	topKey: string;
	midKey: string;
	item: {
		key: string;
		href?: string;
	};
};

export interface SearchModalProps {
	isOpen: boolean;
	onClose: () => void;
}

// PanelForSite 관련 타입들
export interface PanelForSiteProps {
	onItemSelect: (item: SiteResult) => void;
}

export interface SiteSearchInputProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onSearchClear: () => void;
}

export interface SiteSearchResultsProps {
	results: SiteResult[];
	onItemSelect: (item: SiteResult) => void;
}

export interface SiteRecentListProps {
	recentSites: SiteResult[];
	onItemSelect: (item: SiteResult) => void;
}

// PanelForMenu 관련 타입들
export interface PanelForMenuProps {
	onItemSelect: (item: MenuResult) => void;
}

export interface MenuSearchInputProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onSearchClear: () => void;
}

export interface MenuSearchResultsProps {
	results: MenuResult[];
	onItemSelect: (item: MenuResult) => void;
}

export interface MenuRecentListProps {
	recentMenus: MenuResult[];
	onItemSelect: (item: MenuResult) => void;
}
