'use client';

import { useState, useEffect } from 'react';
import { SiteResult } from './types';

/**
 * 사이드바 사이트 검색 훅
 * - 사이트 검색 입력, 결과 표시, 최근 접속 현장 관리
 */
export const useSidebarSearch = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<SiteResult[]>([]);
	const [recentSites, setRecentSites] = useState<SiteResult[]>([]);

	// 최근 접속 현장 초기화
	useEffect(() => {
		const dummySites: SiteResult[] = [
			{
				id: 'site-1',
				name: '서울 강남구 테헤란로 아파트',
				address: '서울특별시 강남구 테헤란로 123',
				description: '강남구 주거단지',
				accessedAt: Date.now() - 3600000, // 1시간 전
			},
			{
				id: 'site-2',
				name: '부산 해운대구 센텀시티 아파트',
				address: '부산광역시 해운대구 센텀중앙로 456',
				description: '해운대구 고급 주거단지',
				accessedAt: Date.now() - 7200000, // 2시간 전
			},
			{
				id: 'site-3',
				name: '대구 수성구 수성로 오피스텔',
				address: '대구광역시 수성구 수성로 789',
				description: '수성구 비즈니스 단지',
				accessedAt: Date.now() - 86400000, // 1일 전
			},
			{
				id: 'site-4',
				name: '인천 송도 국제도시 아파트',
				address: '인천광역시 연수구 송도동 101',
				description: '송도 신도시 주거단지',
				accessedAt: Date.now() - 172800000, // 2일 전
			},
			{
				id: 'site-5',
				name: '광주 북구 용봉동 아파트',
				address: '광주광역시 북구 용봉동 202',
				description: '북구 교육 단지',
				accessedAt: Date.now() - 259200000, // 3일 전
			},
		];

		const sortedSites = dummySites
			.sort((a, b) => (b.accessedAt || 0) - (a.accessedAt || 0))
			.slice(0, 3);
		setRecentSites(sortedSites);
	}, []);

	// 검색어 변경 시 검색 결과 업데이트
	useEffect(() => {
		if (searchQuery.trim()) {
			const dummySites: SiteResult[] = [
				{
					id: 'site-1',
					name: '서울 강남구 테헤란로 아파트',
					address: '서울특별시 강남구 테헤란로 123',
					description: '강남구 주거단지',
					accessedAt: Date.now() - 3600000, // 1시간 전
				},
				{
					id: 'site-2',
					name: '부산 해운대구 센텀시티 아파트',
					address: '부산광역시 해운대구 센텀중앙로 456',
					description: '해운대구 고급 주거단지',
					accessedAt: Date.now() - 7200000, // 2시간 전
				},
				{
					id: 'site-3',
					name: '대구 수성구 수성로 오피스텔',
					address: '대구광역시 수성구 수성로 789',
					description: '수성구 비즈니스 단지',
					accessedAt: Date.now() - 86400000, // 1일 전
				},
				{
					id: 'site-4',
					name: '인천 송도 국제도시 아파트',
					address: '인천광역시 연수구 송도동 101',
					description: '송도 신도시 주거단지',
					accessedAt: Date.now() - 172800000, // 2일 전
				},
				{
					id: 'site-5',
					name: '광주 북구 용봉동 아파트',
					address: '광주광역시 북구 용봉동 202',
					description: '북구 교육 단지',
					accessedAt: Date.now() - 259200000, // 3일 전
				},
			];

			const filtered = dummySites.filter(
				(site) =>
					site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					site.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
					site.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
	const handleResultSelect = (site: SiteResult) => {
		// 최근 접속 현장 목록 업데이트
		const updatedSite = { ...site, accessedAt: Date.now() };
		setRecentSites((prev) => {
			const filtered = prev.filter((s) => s.id !== site.id);
			return [updatedSite, ...filtered].slice(0, 3);
		});

		// 실제 프로젝트에서는 사이트 변경 로직을 여기에 구현
		console.log('선택된 사이트:', site.name);

		// 사이트 변경 후 페이지 이동 예시
		// router.push(`/site/${site.id}`);
	};

	return {
		searchQuery,
		searchResults,
		recentSites,
		handleSearchChange,
		handleSearchClear,
		handleResultSelect,
	};
};
