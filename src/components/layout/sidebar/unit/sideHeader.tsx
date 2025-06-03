'use client';

import Link from 'next/link';
import { useAtom } from 'jotai';
import { Building2, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
	currentTopMenuAtom,
	currentMidMenuAtom,
	currentBotMenuAtom,
} from '@/store/sidebar';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/layout/sidebar/unit/searchBar';
import { MenuSearch } from '@/components/layout/sidebar/unit/menuSearch';

interface SideHeaderProps {
	onMenuNavigate?: (result: {
		topKey: string;
		midKey: string;
		botLabel?: string;
		href?: string;
	}) => void;
}

// #region side_header: 사이드바 헤더 컴포넌트
export function SideHeader({ onMenuNavigate }: SideHeaderProps) {
	const [, setCurrentTopMenu] = useAtom(currentTopMenuAtom);
	const [, setCurrentMidMenu] = useAtom(currentMidMenuAtom);
	const [, setCurrentBotMenu] = useAtom(currentBotMenuAtom);
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// 클라이언트에서만 테마 관련 UI 렌더링
	useEffect(() => {
		setMounted(true);
	}, []);

	const handleLogoClick = () => {
		setCurrentTopMenu('');
		setCurrentMidMenu('');
		setCurrentBotMenu('');
	};

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};

	const handleMenuSelect = (result: {
		topKey: string;
		midKey: string;
		botLabel?: string;
		href?: string;
	}) => {
		// breadcrumb 상태 업데이트
		setCurrentTopMenu(result.topKey);
		setCurrentMidMenu(result.midKey);
		if (result.botLabel) {
			setCurrentBotMenu(result.botLabel);
		}

		// 부모 컴포넌트에 메뉴 이동 알림
		onMenuNavigate?.(result);
	};

	return (
		<div className="p-4 pt-3 bg-gradient-to-r from-card/50 via-background/70 to-card/40 border-b border-border/60 shadow-[0_2px_4px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
			{/* 로고 영역 */}
			<div className="relative flex items-center justify-center px-2 mb-3">
				{/* 다크모드 토글 버튼 - 절대 위치로 우측 상단에 배치 */}
				{mounted && (
					<Button
						variant="ghost"
						size="sm"
						onClick={toggleTheme}
						className="absolute p-0 rounded-lg neumorphic-button -top-1 -right-2 h-7 w-7 hover:scale-105 text-muted-foreground hover:text-foreground"
						title={
							theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'
						}>
						{theme === 'dark' ? (
							<Sun className="w-4 h-4" />
						) : (
							<Moon className="w-4 h-4" />
						)}
					</Button>
				)}

				{/* 타이틀 영역 - 더 부각된 스타일링 */}
				<div className="flex-1 flex justify-center max-w-[220px]">
					<Button
						variant="ghost"
						className="w-full h-auto p-0 text-left hover:bg-transparent group"
						asChild>
						<Link
							href="/"
							onClick={handleLogoClick}
							className="block transition-all duration-200 group-hover:scale-105">
							<div className="flex items-center justify-center gap-3">
								<div className="flex items-center justify-center flex-shrink-0 w-10 h-10 transition-all duration-200 border-2 neumorphic rounded-xl group-hover:scale-110 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
									<Building2 className="w-6 h-6 font-bold text-primary drop-shadow-md" />
								</div>
								<div className="text-base font-semibold transition-colors text-foreground/90 group-hover:text-primary/90 truncate max-w-[140px] drop-shadow-sm">
									건물 타이틀
								</div>
							</div>
						</Link>
					</Button>
				</div>
			</div>

			{/* 현장검색 영역 */}
			<div className="px-1 mb-3">
				<SearchBar />
			</div>

			{/* 메뉴검색 영역 */}
			<div className="px-1">
				<MenuSearch onMenuSelect={handleMenuSelect} />
			</div>
		</div>
	);
}
// #endregion
