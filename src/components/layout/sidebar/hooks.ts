import { useState } from 'react';
import { defaults } from '@/data/sidebarConfig';
import { menuData } from '@/data/menuData';

// #region 사이드바 상태 관리 훅
export function useSidebarMenu() {
	const [topMenu, setTopMenu] = useState<string>(defaults.topMenu);
	const [midMenu, setMidMenu] = useState<string>('');
	const [singleOpenMode, setSingleOpenMode] = useState<boolean>(false);

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
		// 새로운 topMenu 선택 시 모든 midItems를 닫힌 상태로 설정
		setMidExpanded(new Set<string>());
	};
	// #endregion

	// #region mid 메뉴 클릭 핸들러
	const handleMidClick = (midKey: string) => {
		if (singleOpenMode) {
			// 하나만 열기 모드: 클릭한 메뉴만 열고 나머지는 닫기
			const isCurrentlyOpen = midExpanded.has(midKey);
			if (isCurrentlyOpen) {
				// 이미 열린 메뉴를 클릭하면 닫기
				setMidExpanded(new Set<string>());
			} else {
				// 새로운 메뉴 클릭 시 해당 메뉴만 열기
				setMidExpanded(new Set<string>([midKey]));
			}
		} else {
			// 기존 방식: 여러 메뉴를 동시에 열 수 있음
			const newExpanded = new Set(midExpanded);
			if (midExpanded.has(midKey)) {
				newExpanded.delete(midKey);
			} else {
				newExpanded.add(midKey);
			}
			setMidExpanded(newExpanded);
		}
		setMidMenu(midKey);
		// breadcrumb 업데이트 제거 - 페이지 이동 시에만 업데이트
	};
	// #endregion

	// #region 하나만 열기 모드 토글 핸들러
	const handleSingleOpenToggle = () => {
		setSingleOpenMode(!singleOpenMode);
		// 하나만 열기 모드로 전환 시 현재 열린 메뉴 중 첫 번째만 유지
		if (!singleOpenMode && midExpanded.size > 1) {
			const firstOpenKey = Array.from(midExpanded)[0];
			setMidExpanded(new Set<string>([firstOpenKey]));
		}
	};
	// #endregion

	// #region 전체 접힘/펼침 핸들러
	const handleExpandAll = () => {
		if (singleOpenMode) {
			// 하나만 열기 모드에서는 첫 번째 메뉴만 열기
			const topData = menuData[topMenu];
			if (topData) {
				const firstMidKey = Object.keys(topData.midItems)[0];
				if (firstMidKey) {
					setMidExpanded(new Set<string>([firstMidKey]));
				}
			}
		} else {
			// 기존 방식: 모든 메뉴 열기
			const topData = menuData[topMenu];
			if (topData) {
				setMidExpanded(
					new Set<string>(Object.keys(topData.midItems) as string[])
				);
			}
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
		singleOpenMode,
		handleTopClick,
		handleMidClick,
		handleSingleOpenToggle,
		handleExpandAll,
		handleCollapseAll,
	};
}
// #endregion

// #region 현장 검색 상태 관리 훅
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
			console.log('현장 검색 실행:', searchQuery);
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

// #region 메뉴검색 상태 관리 훅
export function useMenuSearch() {
	const [menuSearchQuery, setMenuSearchQuery] = useState<string>('');
	const [isMenuSearchActive, setIsMenuSearchActive] = useState<boolean>(false);
	const [searchResults, setSearchResults] = useState<
		Array<{
			topKey: string;
			topLabel: string;
			midKey: string;
			midLabel: string;
			botLabel?: string;
			href?: string;
		}>
	>([]);

	const handleMenuSearchChange = (value: string) => {
		setMenuSearchQuery(value);
		setIsMenuSearchActive(value.length > 0);

		if (value.trim()) {
			// 메뉴 검색 로직
			const results: Array<{
				topKey: string;
				topLabel: string;
				midKey: string;
				midLabel: string;
				botLabel?: string;
				href?: string;
			}> = [];

			Object.entries(menuData).forEach(([topKey, topItem]) => {
				Object.entries(topItem.midItems).forEach(([midKey, midItem]) => {
					// mid 메뉴 검색
					if (midItem.label.toLowerCase().includes(value.toLowerCase())) {
						results.push({
							topKey,
							topLabel: topItem.label,
							midKey,
							midLabel: midItem.label,
						});
					}

					// bot 메뉴 검색
					midItem.botItems.forEach((botItem) => {
						if (botItem.label.toLowerCase().includes(value.toLowerCase())) {
							results.push({
								topKey,
								topLabel: topItem.label,
								midKey,
								midLabel: midItem.label,
								botLabel: botItem.label,
								href: botItem.href,
							});
						}
					});
				});
			});

			setSearchResults(results);
		} else {
			setSearchResults([]);
		}
	};

	const handleMenuSearchClear = () => {
		setMenuSearchQuery('');
		setIsMenuSearchActive(false);
		setSearchResults([]);
	};

	const handleMenuSearchSelect = (result: {
		topKey: string;
		midKey: string;
		botLabel?: string;
		href?: string;
	}) => {
		// 메뉴 위치로 이동하는 콜백을 위한 함수
		return {
			topKey: result.topKey,
			midKey: result.midKey,
			botLabel: result.botLabel,
			href: result.href,
		};
	};

	return {
		menuSearchQuery,
		isMenuSearchActive,
		searchResults,
		handleMenuSearchChange,
		handleMenuSearchClear,
		handleMenuSearchSelect,
	};
}
// #endregion
