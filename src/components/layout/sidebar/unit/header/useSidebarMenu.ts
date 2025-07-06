'use client';

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { singleOpenModeAtom } from '@/store/sidebar';
import { defaults } from '@/data/sidebarConfig';
import { menuData } from '@/data/menuData';

/**
 * 사이드바 메뉴 상태 및 동작을 관리하는 메인 훅
 * - Top/Mid 메뉴 선택 상태 관리
 * - 메뉴 확장/축소 상태 관리
 * - 단일/다중 열기 모드 지원
 * - URL 변경 시 자동 메뉴 선택
 * - Hydration 에러 방지를 위한 클라이언트 전용 렌더링
 */
export function useSidebarMenu() {
	const pathname = usePathname();
	const [topMenu, setTopMenu] = useState<string>(defaults.topMenu);
	const [midMenu, setMidMenu] = useState<string>('');
	const [singleOpenMode, setSingleOpenMode] = useAtom(singleOpenModeAtom);

	// Hydration 에러 방지: 클라이언트 렌더링 완료 후에만 localStorage 기반 상태 활성화
	const [isMounted, setIsMounted] = useState(false);

	// 초기에는 모든 메뉴 닫힌 상태로 시작 (사용자가 필요한 것만 열도록)
	const [midExpanded, setMidExpanded] = useState<Set<string>>(
		new Set<string>()
	);

	// 클라이언트 마운트 감지 및 localStorage 값 로드
	useEffect(() => {
		setIsMounted(true);

		// localStorage에서 값 읽어와서 atom 업데이트
		try {
			const savedSingleOpenMode = localStorage.getItem('singleOpenMode');
			if (savedSingleOpenMode !== null) {
				const parsedValue = JSON.parse(savedSingleOpenMode);
				if (typeof parsedValue === 'boolean') {
					setSingleOpenMode(parsedValue);
				}
			}
		} catch (error) {
			console.warn('[사이드바] localStorage 읽기 실패:', error);
		}
	}, [setSingleOpenMode]);

	// URL 변경 시 topMenu, midMenu, midExpanded 처리
	useEffect(() => {
		// 마운트되지 않았으면 기본값 유지 (Hydration 방지)
		if (!isMounted) return;

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
	}, [pathname, isMounted, singleOpenMode]);

	// 모드 변경 시 상태 전환 처리
	useEffect(() => {
		// 마운트되지 않았으면 기본값 유지 (Hydration 방지)
		if (!isMounted) return;

		console.log(
			`[사이드바] 모드 변경 감지: ${singleOpenMode ? '단일' : '다중'} 모드, 현재 midMenu: ${midMenu}`
		);

		if (singleOpenMode) {
			// 다중 → 단일 모드: 현재 선택된 midMenu만 유지하거나 가장 최근에 펼쳐진 메뉴 하나만 유지
			const currentExpanded = Array.from(midExpanded);
			if (currentExpanded.length > 1) {
				// 여러 메뉴가 펼쳐져 있다면 현재 선택된 것 우선, 없으면 첫 번째 유지
				const keepMenu =
					midMenu && currentExpanded.includes(midMenu)
						? midMenu
						: currentExpanded[0];

				setMidExpanded(new Set<string>([keepMenu]));
				setMidMenu(keepMenu);
				console.log(`[사이드바] 단일 모드 전환: ${keepMenu} 메뉴만 유지`);
			} else if (currentExpanded.length === 1) {
				// 이미 하나만 열려있다면 그대로 유지
				const openMenu = currentExpanded[0];
				setMidMenu(openMenu);
				console.log(`[사이드바] 단일 모드 전환: 기존 ${openMenu} 메뉴 유지`);
			}
		} else {
			// 단일 → 다중 모드: 기존 상태 유지 (별도 처리 불필요)
			console.log(`[사이드바] 다중 모드 전환: 기존 상태 유지`);
		}
	}, [singleOpenMode, midExpanded, midMenu, isMounted]);

	/**
	 * Top 메뉴 클릭 시 처리
	 * - 선택된 Top 메뉴 변경
	 * - 모드에 따른 Mid 메뉴 확장 상태 처리
	 */
	const handleTopClick = (topKey: string) => {
		console.log(`[사이드바] Top 메뉴 클릭: ${topMenu} → ${topKey}`);
		setTopMenu(topKey);
		// 새로운 topMenu 선택 시 모든 Mid 메뉴 닫기 (사용자가 필요한 것만 열도록)
		setMidExpanded(new Set<string>());
		setMidMenu(''); // midMenu도 초기화
		console.log(`[사이드바] Top 메뉴 변경 완료: 모든 Mid 메뉴 초기화`);
	};

	/**
	 * Mid 메뉴 클릭 시 처리
	 * - 단일 모드: 하나만 열고 나머지 닫기
	 * - 다중 모드: 토글 방식으로 개별 제어
	 */
	const handleMidClick = (midKey: string) => {
		console.log(
			`[사이드바] Mid 메뉴 클릭: ${midKey}, 모드: ${singleOpenMode ? '단일' : '다중'}, 현재 펼쳐진 메뉴:`,
			Array.from(midExpanded)
		);

		if (singleOpenMode) {
			// 단일 열기 모드: 클릭한 메뉴만 열고 나머지는 닫기
			const isCurrentlyOpen = midExpanded.has(midKey);
			if (isCurrentlyOpen) {
				// 이미 열린 메뉴를 클릭하면 완전히 닫기
				setMidExpanded(new Set<string>());
				setMidMenu(''); // 선택된 midMenu도 초기화
				console.log(`[사이드바] 단일 모드 - 메뉴 닫기: ${midKey}`);
			} else {
				// 새로운 메뉴 클릭 시 해당 메뉴만 열기
				setMidExpanded(new Set<string>([midKey]));
				setMidMenu(midKey);
				console.log(`[사이드바] 단일 모드 - 메뉴 열기: ${midKey}`);
			}
		} else {
			// 다중 열기 모드: 여러 메뉴를 동시에 열 수 있음
			const newExpanded = new Set(midExpanded);
			if (midExpanded.has(midKey)) {
				newExpanded.delete(midKey);
				// 마지막으로 닫힌 메뉴가 현재 선택된 메뉴라면 초기화
				if (midMenu === midKey) {
					const remainingKeys = Array.from(newExpanded);
					setMidMenu(
						remainingKeys.length > 0
							? remainingKeys[remainingKeys.length - 1]
							: ''
					);
				}
				console.log(`[사이드바] 다중 모드 - 메뉴 닫기: ${midKey}`);
			} else {
				newExpanded.add(midKey);
				setMidMenu(midKey); // 새로 열린 메뉴를 현재 선택으로 설정
				console.log(`[사이드바] 다중 모드 - 메뉴 열기: ${midKey}`);
			}
			setMidExpanded(newExpanded);
		}

		console.log(
			`[사이드바] 처리 완료 - 선택된 midMenu: ${midKey}, 펼쳐진 메뉴:`,
			Array.from(midExpanded)
		);
	};

	/**
	 * 단일/다중 열기 모드 전환
	 * - 모드 변경 시 확장 상태는 useEffect에서 자동 처리
	 */
	const handleSingleOpenToggle = () => {
		const newMode = !singleOpenMode;
		console.log(
			`[사이드바] 모드 토글: ${singleOpenMode ? '단일' : '다중'} → ${newMode ? '단일' : '다중'}`
		);
		setSingleOpenMode(newMode);
		// 상태 변경은 useEffect에서 자동으로 처리됨
	};

	/**
	 * 전체 메뉴 펼치기
	 * - 단일 모드: 첫 번째 메뉴만 열기 (현재 선택된 메뉴 우선)
	 * - 다중 모드: 순차적으로 모든 메뉴 열기 (애니메이션 효과)
	 */
	const handleExpandAll = async () => {
		const topData = menuData[topMenu];
		if (!topData) return;

		const midKeys = Object.keys(topData.midItems);
		if (midKeys.length === 0) return;

		console.log(
			`[사이드바] 전체 펼치기 실행: ${singleOpenMode ? '단일' : '다중'} 모드, 메뉴 수: ${midKeys.length}`
		);

		if (singleOpenMode) {
			// 단일 모드: 현재 선택된 메뉴가 있으면 그것을, 없으면 첫 번째 메뉴 열기
			const targetMenu =
				midMenu && midKeys.includes(midMenu) ? midMenu : midKeys[0];
			setMidExpanded(new Set<string>([targetMenu]));
			setMidMenu(targetMenu);
			console.log(`[사이드바] 단일 모드 - 펼치기 완료: ${targetMenu}`);
		} else {
			// 다중 모드: 애니메이션 효과를 위해 순차적으로 열기
			const newExpanded = new Set<string>();
			for (const midKey of midKeys) {
				newExpanded.add(midKey);
				setMidExpanded(new Set(newExpanded));
				// 100ms 간격으로 애니메이션 효과
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
			// 마지막 메뉴를 현재 선택으로 설정
			setMidMenu(midKeys[midKeys.length - 1]);
			console.log(
				`[사이드바] 다중 모드 - 펼치기 완료: ${midKeys.length}개 메뉴`
			);
		}
	};

	/**
	 * 전체 메뉴 접기
	 * - 모든 확장된 메뉴를 닫기
	 */
	const handleCollapseAll = async () => {
		const currentExpanded = Array.from(midExpanded);
		if (currentExpanded.length === 0) return;

		console.log(`[사이드바] 전체 접기 실행: ${currentExpanded.length}개 메뉴`);

		if (singleOpenMode) {
			// 단일 모드: 즉시 모든 메뉴 닫기
			setMidExpanded(new Set<string>());
			setMidMenu('');
			console.log(`[사이드바] 단일 모드 - 접기 완료`);
		} else {
			// 다중 모드: 애니메이션 효과를 위해 순차적으로 닫기 (역순)
			const newExpanded = new Set(midExpanded);
			for (let i = currentExpanded.length - 1; i >= 0; i--) {
				const midKey = currentExpanded[i];
				newExpanded.delete(midKey);
				setMidExpanded(new Set(newExpanded));
				// 100ms 간격으로 애니메이션 효과
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
			// 모든 메뉴가 닫혔으므로 현재 선택 초기화
			setMidMenu('');
			console.log(`[사이드바] 다중 모드 - 접기 완료`);
		}
	};

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
