'use client';

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import {
	singleOpenModeAtom,
	sidebarCollapsedAtom,
	menuSearchQueryAtom,
	menuSearchResultsAtom,
	menuSearchActiveAtom,
	recentMenusAtom,
	siteSearchQueryAtom,
	siteSearchResultsAtom,
	siteSearchActiveAtom,
	recentSitesAtom,
} from '@/store/sidebar';
import { defaults } from '@/data/sidebarConfig';
import { menuData } from '@/data/menuData';
import { BotMenu } from './types';
import { usePathname } from 'next/navigation';

/**
 * 사이드바 관련 커스텀 훅 모음
 * - 메뉴 상태 관리 및 검색 기능 제공
 * - URL 기반 자동 메뉴 선택 및 확장 처리
 * - 키보드 단축키 지원
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

	// 초기에는 모든 메뉴 닫힌 상태로 시작 (사용자가 필요한 것만 열도록)
	const [midExpanded, setMidExpanded] = useState<Set<string>>(
		new Set<string>()
	);

	// URL 변경 시 topMenu, midMenu, midExpanded 처리
	useEffect(() => {
		// 현재 URL과 일치하는 메뉴를 찾아서 자동 선택
		for (const [topKey, topData] of Object.entries(menuData)) {
			for (const midKey of Object.keys(topData.midItems)) {
				for (const botItem of topData.midItems[midKey].botItems) {
					if (botItem.href === pathname) {
						setTopMenu(topKey);
						setMidMenu(midKey);

						// midExpanded 설정: 현재 상태를 최대한 보존
						setMidExpanded((prev) => {
							if (singleOpenMode) {
								return new Set<string>([midKey]);
							} else {
								// 다중 모드: 기존 펼쳐진 상태 보존 + 현재 메뉴만 추가
								const newExpanded = new Set(prev);
								newExpanded.add(midKey);
								return newExpanded;
							}
						});
						return;
					}
				}
			}
		}
	}, [pathname, singleOpenMode]);

	// 모드 변경 시 별도 처리
	useEffect(() => {
		if (singleOpenMode) {
			// 다중 → 단일 모드: 현재 선택된 midMenu만 유지
			if (midMenu) {
				setMidExpanded(new Set<string>([midMenu]));
			} else {
				setMidExpanded(new Set<string>());
			}
		}
		// 단일 → 다중 모드: 기존 상태 유지 (별도 처리 불필요)
	}, [singleOpenMode, midMenu]);

	// #region top 메뉴 클릭 핸들러
	/**
	 * Top 메뉴 클릭 시 처리
	 * - 선택된 Top 메뉴 변경
	 * - 모드에 따른 Mid 메뉴 확장 상태 처리
	 */
	const handleTopClick = (topKey: string) => {
		setTopMenu(topKey);
		// 새로운 topMenu 선택 시 모든 Mid 메뉴 닫기 (사용자가 필요한 것만 열도록)
		setMidExpanded(new Set<string>());
		setMidMenu(''); // midMenu도 초기화
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
		const topData = menuData[topMenu];
		if (!topData) return;

		const midKeys = Object.keys(topData.midItems);
		if (midKeys.length === 0) return;

		if (singleOpenMode) {
			// 하나만 열기 모드에서는 첫 번째 메뉴만 열기
			setMidExpanded(new Set<string>([midKeys[0]]));
		} else {
			// 다중 모드: 모든 메뉴 열기
			setMidExpanded(new Set<string>(midKeys));
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
 * 현장 검색 기능을 관리하는 훅
 * - 현장 검색 및 결과 관리
 * - 최근 접속 현장 관리
 * - 드롭다운 기능 제공
 */
export function useSidebarSearch() {
	const [searchQuery, setSearchQuery] = useAtom(siteSearchQueryAtom);
	const [searchResults, setSearchResults] = useAtom(siteSearchResultsAtom);
	const [isSearchActive, setIsSearchActive] = useAtom(siteSearchActiveAtom);
	const [recentSites, setRecentSites] = useAtom(recentSitesAtom);

	// 더미 현장 데이터 (실제 프로젝트에서는 API에서 가져와야 함)
	const dummySites = [
		{
			id: 'site1',
			name: '삼성타워',
			address: '서울시 강남구 테헤란로 123',
			description: '오피스 빌딩',
		},
		{
			id: 'site2',
			name: 'LG트윈타워',
			address: '서울시 영등포구 여의도동 456',
			description: '기업 본사',
		},
		{
			id: 'site3',
			name: '롯데월드타워',
			address: '서울시 송파구 신천동 789',
			description: '복합 상업시설',
		},
		{
			id: 'site4',
			name: '코엑스몰',
			address: '서울시 강남구 삼성동 101',
			description: '쇼핑몰',
		},
		{
			id: 'site5',
			name: '63빌딩',
			address: '서울시 영등포구 여의도동 112',
			description: '랜드마크 빌딩',
		},
	];

	/**
	 * 최근 접속 현장에 추가하는 함수
	 */
	const addToRecentSites = (site: {
		id: string;
		name: string;
		address: string;
		description?: string;
	}) => {
		console.log('현장 검색 결과 클릭 기록:', site); // 디버깅용

		const newRecentSite = {
			...site,
			accessedAt: Date.now(),
		};

		// 기존 항목 중에서 같은 id를 가진 항목 제거
		const filteredRecents = recentSites.filter(
			(recent) => recent.id !== site.id
		);

		// 새 항목을 맨 앞에 추가하고 최대 10개까지만 유지
		const updatedRecents = [newRecentSite, ...filteredRecents].slice(0, 10);

		console.log('업데이트된 최근 현장:', updatedRecents); // 디버깅용

		setRecentSites(updatedRecents);
	};

	/**
	 * 현장 검색 실행
	 * - 현장 이름과 주소에서 검색
	 */
	const performSearch = (query: string) => {
		if (!query.trim()) {
			setSearchResults([]);
			return;
		}

		const results = dummySites.filter((site) => {
			const searchText =
				`${site.name} ${site.address} ${site.description || ''}`.toLowerCase();
			return searchText.includes(query.toLowerCase());
		});

		setSearchResults(results);
	};

	/**
	 * 검색 입력값 변경 처리
	 * - 입력값에 따른 활성화 상태 자동 업데이트
	 */
	const handleSearchChange = (value: string) => {
		setSearchQuery(value);
		setIsSearchActive(value.length > 0);
		performSearch(value);
	};

	/**
	 * 검색 입력 초기화
	 * - 검색어와 활성화 상태 모두 리셋
	 */
	const handleSearchClear = () => {
		setSearchQuery('');
		setSearchResults([]);
		setIsSearchActive(false);
	};

	/**
	 * 검색 실행
	 */
	const handleSearchSubmit = () => {
		if (searchQuery.trim()) {
			performSearch(searchQuery);
		}
	};

	/**
	 * 검색 결과 또는 최근 접속 현장 선택 처리
	 */
	const handleResultSelect = (site: {
		id: string;
		name: string;
		address: string;
		description?: string;
	}) => {
		// 최근 접속 현장에 추가
		addToRecentSites(site);

		// 현장 선택 시 추가 처리 (예: 현장 변경, 페이지 이동 등)
		console.log('현장 선택:', site);

		// 검색 초기화
		handleSearchClear();
	};

	return {
		searchQuery,
		searchResults,
		isSearchActive,
		recentSites,
		handleSearchChange,
		handleSearchClear,
		handleSearchSubmit,
		handleResultSelect,
	};
}
// #endregion

// #region 키보드 단축키 훅
/**
 * 사이드바 키보드 단축키를 관리하는 훅
 * - Ctrl+B: 사이드바 토글
 */
export function useSidebarKeyboard() {
	const [, setSidebarCollapsed] = useAtom(sidebarCollapsedAtom);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// Ctrl+B 조합 확인
			if (event.ctrlKey && event.key === 'b') {
				event.preventDefault();
				setSidebarCollapsed((prev) => !prev);
			}
		};

		// 전역 키보드 이벤트 리스너 등록
		window.addEventListener('keydown', handleKeyDown);

		// 클린업 함수
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [setSidebarCollapsed]);
}
// #endregion

// #region 메뉴 검색 상태 관리 훅
/**
 * 메뉴 검색 기능을 관리하는 훅
 * - botMenu 검색 및 결과 관리
 * - 검색 결과 필터링 및 정렬
 */
export function useMenuSearch() {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useAtom(menuSearchQueryAtom);
	const [searchResults, setSearchResults] = useAtom(menuSearchResultsAtom);
	const [isSearchActive, setIsSearchActive] = useAtom(menuSearchActiveAtom);
	const [recentMenus, setRecentMenus] = useAtom(recentMenusAtom);

	/**
	 * 최근 접속 메뉴에 추가하는 함수
	 */
	const addToRecentMenus = (result: {
		type: 'bot';
		topKey: string;
		midKey: string;
		item: BotMenu;
	}) => {
		console.log('메뉴 검색 결과 클릭 기록:', result); // 디버깅용

		const newRecentItem = {
			type: 'bot' as const,
			topKey: result.topKey,
			midKey: result.midKey,
			item: {
				key: result.item.key,
				'kor-name': result.item['kor-name'],
				'eng-name': result.item['eng-name'],
				href: result.item.href,
				description: result.item.description,
			},
			accessedAt: Date.now(),
		};

		// 기존 항목 중에서 같은 href를 가진 항목 제거
		const filteredRecents = recentMenus.filter(
			(recent) => recent.item.href !== result.item.href
		);

		// 새 항목을 맨 앞에 추가하고 최대 10개까지만 유지
		const updatedRecents = [newRecentItem, ...filteredRecents].slice(0, 10);

		console.log('업데이트된 최근 메뉴 (검색):', updatedRecents); // 디버깅용

		setRecentMenus(updatedRecents);
	};

	/**
	 * 메뉴 검색 실행
	 * - 모든 midMenu와 botMenu 항목에서 kor-name과 description을 검색
	 */
	const performSearch = (query: string) => {
		if (!query.trim()) {
			setSearchResults([]);
			return;
		}

		const results: Array<{
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
		}> = [];

		// 모든 메뉴 데이터를 순회하며 검색
		Object.entries(menuData).forEach(([topKey, topData]) => {
			Object.entries(topData.midItems).forEach(([midKey, midData]) => {
				// midMenu 검색
				const midSearchText = midData['kor-name'].toLowerCase();
				if (midSearchText.includes(query.toLowerCase())) {
					results.push({
						type: 'mid',
						topKey,
						midKey,
						item: {
							key: midData.key,
							'kor-name': midData['kor-name'],
							'eng-name': midData['eng-name'],
							description: `${topData['kor-name']} 카테고리`,
						},
					});
				}

				// botMenu 검색
				midData.botItems.forEach((botItem) => {
					const botSearchText =
						`${botItem['kor-name']} ${botItem.description || ''}`.toLowerCase();
					if (botSearchText.includes(query.toLowerCase())) {
						results.push({
							type: 'bot',
							topKey,
							midKey,
							item: {
								key: botItem.key,
								'kor-name': botItem['kor-name'],
								'eng-name': botItem['eng-name'],
								href: botItem.href,
								description: botItem.description,
							},
						});
					}
				});
			});
		});

		// 검색 결과를 타입별로 정렬 (mid가 먼저, 그 다음 bot)
		results.sort((a, b) => {
			if (a.type !== b.type) {
				return a.type === 'mid' ? -1 : 1;
			}
			return a.item['kor-name'].localeCompare(b.item['kor-name']);
		});
		setSearchResults(results);
	};

	/**
	 * 검색어 변경 처리
	 */
	const handleSearchChange = (query: string) => {
		setSearchQuery(query);
		setIsSearchActive(query.length > 0);
		performSearch(query);
	};

	/**
	 * 검색 초기화
	 */
	const handleSearchClear = () => {
		setSearchQuery('');
		setSearchResults([]);
		setIsSearchActive(false);
	};

	/**
	 * 검색 결과 선택 처리
	 */
	const handleResultSelect = (result: (typeof searchResults)[0]) => {
		// 검색 결과 클릭 시 해당 페이지로 이동
		if (result.type === 'bot' && result.item.href) {
			// 최근 접속 메뉴에 추가 (bot 타입만)
			const botResult = {
				type: 'bot' as const,
				topKey: result.topKey,
				midKey: result.midKey,
				item: result.item as BotMenu,
			};
			addToRecentMenus(botResult);

			// Next.js 라우터를 사용하여 클라이언트 사이드 네비게이션
			// URL 변경 시 useSidebarMenu의 useEffect가 자동으로 사이드바 상태를 업데이트
			router.push(result.item.href);
		} else if (result.type === 'mid') {
			// midMenu 클릭 시 해당 카테고리의 첫 번째 botMenu로 이동
			const midData = menuData[result.topKey].midItems[result.midKey];
			if (midData.botItems.length > 0) {
				const firstBotItem = midData.botItems[0];

				// 첫 번째 botMenu를 최근 접속 메뉴에 추가
				const botResult = {
					type: 'bot' as const,
					topKey: result.topKey,
					midKey: result.midKey,
					item: firstBotItem,
				};
				addToRecentMenus(botResult);

				// Next.js 라우터를 사용하여 클라이언트 사이드 네비게이션
				// URL 변경 시 useSidebarMenu의 useEffect가 자동으로 사이드바 상태를 업데이트
				router.push(firstBotItem.href);
			}
		}
	};

	return {
		searchQuery,
		searchResults,
		isSearchActive,
		recentMenus,
		handleSearchChange,
		handleSearchClear,
		handleResultSelect,
	};
}
// #endregion
