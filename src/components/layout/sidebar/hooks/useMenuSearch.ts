'use client';

import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import {
	menuSearchQueryAtom,
	menuSearchResultsAtom,
	menuSearchActiveAtom,
	recentMenusAtom,
} from '@/store/sidebar';
import { menuData } from '@/data/menuData';
import { BotMenu } from '../types';

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