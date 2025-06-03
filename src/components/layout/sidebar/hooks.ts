import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { singleOpenModeAtom } from '@/store/sidebar';
import { defaults } from '@/data/sidebarConfig';
import { menuData } from '@/data/menuData';

// #region 사이드바 상태 관리 훅
export function useSidebarMenu() {
	const [topMenu, setTopMenu] = useState<string>(defaults.topMenu);
	const [midMenu, setMidMenu] = useState<string>('');
	const [singleOpenMode, setSingleOpenMode] = useAtom(singleOpenModeAtom);

	// 기본적으로 현재 topMenu의 모든 midItems를 펼친 상태로 초기화
	const getDefaultExpandedMidItems = (topKey: string): Set<string> => {
		const topData = menuData[topKey];
		return topData
			? new Set<string>(Object.keys(topData.midItems) as string[])
			: new Set<string>();
	};

	const [midExpanded, setMidExpanded] = useState<Set<string>>(
		singleOpenMode
			? new Set<string>()
			: getDefaultExpandedMidItems(defaults.topMenu)
	);

	// 페이지 로드 시 singleOpenMode 값에 따라 midExpanded 상태 초기화
	useEffect(() => {
		if (singleOpenMode) {
			// 하나만 열기 모드에서는 초기에 모든 메뉴를 닫거나
			// 첫 번째 메뉴만 열기 (선택)
			setMidExpanded(new Set<string>());
		} else {
			// 일반 모드에서는 현재 topMenu의 모든 midItems 열기
			setMidExpanded(getDefaultExpandedMidItems(topMenu));
		}
	}, [singleOpenMode, topMenu]);

	// #region top 메뉴 클릭 핸들러
	const handleTopClick = (topKey: string) => {
		setTopMenu(topKey);
		// 새로운 topMenu 선택 시 singleOpenMode에 따라 초기 상태 설정
		if (singleOpenMode) {
			// 하나만 열기 모드에서는 모든 메뉴 닫기
			setMidExpanded(new Set<string>());
		} else {
			// 일반 모드에서는 새 topMenu의 모든 메뉴 열기
			const topData = menuData[topKey];
			if (topData) {
				setMidExpanded(new Set<string>(Object.keys(topData.midItems)));
			}
		}
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
		// handleSingleOpenToggle에서 midExpanded 상태 변경은 useEffect에서 자동으로 처리됨
	};
	// #endregion

	// #region 전체 접힘/펼침 핸들러
	const handleExpandAll = () => {
		if (singleOpenMode) {
			// 하나만 열기 모드에서는 첫 번째 메뉴만 열기
			const topData = menuData[topMenu];
			if (topData) {
				const midKeys = Object.keys(topData.midItems);
				if (midKeys.length > 0) {
					setMidExpanded(new Set<string>([midKeys[0]]));
				}
			}
		} else {
			// 일반 모드: 모든 메뉴 열기
			const topData = menuData[topMenu];
			if (topData) {
				setMidExpanded(new Set<string>(Object.keys(topData.midItems)));
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
