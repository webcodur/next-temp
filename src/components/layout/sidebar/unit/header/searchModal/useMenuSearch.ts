'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MenuResult } from './types';
import { menuData } from '@/data/menuData';
import { TopItem, MidMenu, BotMenu } from '@/components/layout/sidebar/types';

/**
 * 사이드바 메뉴 검색 훅
 * - 메뉴 검색 입력, 결과 표시, 최근 접속 메뉴 관리
 */
export const useMenuSearch = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<MenuResult[]>([]);
	const [recentMenus, setRecentMenus] = useState<MenuResult[]>([]);
	const router = useRouter();

	// 최근 접속 메뉴 초기화 (더미 데이터)
	useEffect(() => {
		const dummyRecentMenus: MenuResult[] = [
			{
				type: 'bot',
				topKey: '주차',
				midKey: '이용자관리',
				item: {
					key: '입출차관리',
					href: '/parking/users/entry-exit',
				},
			},
			{
				type: 'bot',
				topKey: '커뮤니티',
				midKey: '시설서비스',
				item: {
					key: '예약현황',
					href: '/community/facilities/reservations',
				},
			},
			{
				type: 'bot',
				topKey: '공지사항',
				midKey: '공지관리',
				item: {
					key: '일반공지',
					href: '/announcement/notices/general',
				},
			},
		];
		setRecentMenus(dummyRecentMenus);
	}, []);

	// 검색어 변경 시 검색 결과 업데이트
	useEffect(() => {
		if (searchQuery.trim()) {
			// 전체 메뉴 목록 생성
			const allMenus: MenuResult[] = [];

			Object.entries(menuData).forEach(([topKey, topItem]) => {
				const typedTopItem = topItem as TopItem;
				Object.entries(typedTopItem.midItems).forEach(([midKey, midItem]) => {
					const typedMidItem = midItem as MidMenu;
					typedMidItem.botItems.forEach((botItem: BotMenu) => {
						allMenus.push({
							type: 'bot',
							topKey,
							midKey,
							item: botItem,
						});
					});
				});
			});

			const filtered = allMenus.filter(
				(menu) =>
					menu.item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
					menu.midKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
					menu.topKey.toLowerCase().includes(searchQuery.toLowerCase())
			);
			setSearchResults(filtered);
		} else {
			setSearchResults([]);
		}
	}, [searchQuery]);

	// 검색어 변경 핸들러
	const handleSearchChange = (value: string) => {
		setSearchQuery(value);
	};

	// 검색어 지우기 핸들러
	const handleSearchClear = () => {
		setSearchQuery('');
		setSearchResults([]);
	};

	// 검색 결과 선택 핸들러
	const handleResultSelect = (menu: MenuResult) => {
		// 최근 접속 메뉴 목록 업데이트
		setRecentMenus((prev) => {
			const filtered = prev.filter((m) => m.item.key !== menu.item.key);
			return [menu, ...filtered].slice(0, 3);
		});

		// 페이지 이동
		if (menu.item.href) {
			router.push(menu.item.href);
		}
	};

	return {
		searchQuery,
		searchResults,
		recentMenus,
		handleSearchChange,
		handleSearchClear,
		handleResultSelect,
	};
};
