import { useState } from 'react';
import { defaults } from '@/data/sidebarConfig';
import { menuData } from '@/data/menuData';

// #region 사이드바 상태 관리 훅
export function useSidebarMenu() {
	const [topMenu, setTopMenu] = useState<string>(defaults.topMenu);
	const [midMenu, setMidMenu] = useState<string>('');

	// 기본적으로 현재 topMenu의 모든 midItems를 펼친 상태로 초기화
	const getDefaultExpandedMidItems = (topKey: string): Set<string> => {
		const topData = menuData[topKey];
		return topData
			? new Set<string>(Object.keys(topData.midItems) as string[])
			: new Set<string>();
	};

	const [midExpanded, setMidExpanded] = useState<Set<string>>(
		getDefaultExpandedMidItems(defaults.topMenu)
	);

	// #region top 메뉴 클릭 핸들러
	const handleTopClick = (topKey: string) => {
		setTopMenu(topKey);
		// 새로운 topMenu의 모든 midItems를 펼친 상태로 설정
		setMidExpanded(getDefaultExpandedMidItems(topKey));
	};
	// #endregion

	// #region mid 메뉴 클릭 핸들러
	const handleMidClick = (midKey: string) => {
		const newExpanded = new Set(midExpanded);
		if (midExpanded.has(midKey)) {
			newExpanded.delete(midKey);
		} else {
			newExpanded.add(midKey);
		}
		setMidExpanded(newExpanded);
		setMidMenu(midKey);
		// breadcrumb 업데이트 제거 - 페이지 이동 시에만 업데이트
	};
	// #endregion

	// #region 전체 접힘/펼침 핸들러
	const handleExpandAll = () => {
		const topData = menuData[topMenu];
		if (topData) {
			setMidExpanded(
				new Set<string>(Object.keys(topData.midItems) as string[])
			);
		}
	};

	const handleCollapseAll = () => {
		setMidExpanded(new Set<string>());
	};
	// #endregion

	return {
		topMenu,
		midMenu,
		midExpanded,
		handleTopClick,
		handleMidClick,
		handleExpandAll,
		handleCollapseAll,
	};
}
// #endregion

// #region 검색 상태 관리 훅
export function useSidebarSearch() {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [isSearchActive, setIsSearchActive] = useState<boolean>(false);

	const handleSearchChange = (value: string) => {
		setSearchQuery(value);
		setIsSearchActive(value.length > 0);
	};

	const handleSearchClear = () => {
		setSearchQuery('');
		setIsSearchActive(false);
	};

	const handleSearchSubmit = () => {
		if (searchQuery.trim()) {
			// 검색 실행 로직
			console.log('검색 실행:', searchQuery);
		}
	};

	return {
		searchQuery,
		isSearchActive,
		handleSearchChange,
		handleSearchClear,
		handleSearchSubmit,
	};
}
// #endregion
