import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { singleOpenModeAtom } from '@/store/sidebar';
import { defaults } from '@/data/sidebarConfig';
import { menuData } from '@/data/menuData';
import { usePathname } from 'next/navigation';

/**
 * 사이드바 관련 커스텀 훅 모음
 * - 메뉴 상태 관리 및 검색 기능 제공
 * - URL 기반 자동 메뉴 선택 및 확장 처리
 */

// #region 사이드바 상태 관리 훅
/**
 * 사이드바 메뉴 상태 및 동작을 관리하는 메인 훅
 * - Top/Mid 메뉴 선택 상태 관리
 * - 메뉴 확장/축소 상태 관리
 * - 단일/다중 열기 모드 지원
 * - URL 변경 시 자동 메뉴 선택
 */
export function useSidebarMenu() {
	const pathname = usePathname();
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

	// URL 및 모드 변경 시 topMenu, midMenu, midExpanded 초기화
	useEffect(() => {
		// 현재 URL과 일치하는 메뉴를 찾아서 자동 선택
		for (const [topKey, topData] of Object.entries(menuData)) {
			for (const midKey of Object.keys(topData.midItems)) {
				for (const botItem of topData.midItems[midKey].botItems) {
					if (botItem.href === pathname) {
						setTopMenu(topKey);
						setMidMenu(midKey);
						// midExpanded 설정: 단일 모드면 해당 메뉴만, 다중 모드면 모두 펼치기
						if (singleOpenMode) {
							setMidExpanded(new Set<string>([midKey]));
						} else {
							setMidExpanded(getDefaultExpandedMidItems(topKey));
						}
						return;
					}
				}
			}
		}
	}, [pathname, singleOpenMode]);

	// #region top 메뉴 클릭 핸들러
	/**
	 * Top 메뉴 클릭 시 처리
	 * - 선택된 Top 메뉴 변경
	 * - 모드에 따른 Mid 메뉴 확장 상태 초기화
	 */
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
	/**
	 * Mid 메뉴 클릭 시 처리
	 * - 단일 모드: 하나만 열고 나머지 닫기
	 * - 다중 모드: 토글 방식으로 개별 제어
	 */
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
	/**
	 * 단일/다중 열기 모드 전환
	 * - 모드 변경 시 확장 상태는 useEffect에서 자동 처리
	 */
	const handleSingleOpenToggle = () => {
		setSingleOpenMode(!singleOpenMode);
		// handleSingleOpenToggle에서 midExpanded 상태 변경은 useEffect에서 자동으로 처리됨
	};
	// #endregion

	// #region 전체 접힘/펼침 핸들러
	/**
	 * 전체 메뉴 펼치기
	 * - 단일 모드: 첫 번째 메뉴만 열기
	 * - 다중 모드: 모든 메뉴 열기
	 */
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

	/**
	 * 전체 메뉴 접기
	 * - 모든 Mid 메뉴를 닫음
	 */
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
/**
 * 사이드바 검색 기능을 관리하는 훅
 * - 검색 쿼리 입력 상태 관리
 * - 검색 실행 및 초기화 기능 제공
 */
export function useSidebarSearch() {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [isSearchActive, setIsSearchActive] = useState<boolean>(false);

	/**
	 * 검색 입력값 변경 처리
	 * - 입력값에 따른 활성화 상태 자동 업데이트
	 */
	const handleSearchChange = (value: string) => {
		setSearchQuery(value);
		setIsSearchActive(value.length > 0);
	};

	/**
	 * 검색 입력 초기화
	 * - 검색어와 활성화 상태 모두 리셋
	 */
	const handleSearchClear = () => {
		setSearchQuery('');
		setIsSearchActive(false);
	};

	/**
	 * 검색 실행
	 * - 현재는 콘솔 로그만 출력 (추후 실제 검색 로직 구현 예정)
	 */
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
