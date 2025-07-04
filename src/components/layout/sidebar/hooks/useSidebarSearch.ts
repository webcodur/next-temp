'use client';

import { useAtom } from 'jotai';
import {
	siteSearchQueryAtom,
	siteSearchResultsAtom,
	siteSearchActiveAtom,
	recentSitesAtom,
} from '@/store/sidebar';

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