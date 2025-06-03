'use client';

import Link from 'next/link';
import { useAtom } from 'jotai';
import { Building2, Minus } from 'lucide-react';
import {
	currentTopMenuAtom,
	currentMidMenuAtom,
	currentBotMenuAtom,
	headerCollapsedAtom,
} from '@/store/sidebar';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/layout/sidebar/unit/searchBar';

// #region side_header: 사이드바 헤더 컴포넌트
export function SideHeader() {
	const [, setCurrentTopMenu] = useAtom(currentTopMenuAtom);
	const [, setCurrentMidMenu] = useAtom(currentMidMenuAtom);
	const [, setCurrentBotMenu] = useAtom(currentBotMenuAtom);
	const [isHeaderCollapsed, setIsHeaderCollapsed] =
		useAtom(headerCollapsedAtom);

	const handleLogoClick = () => {
		setCurrentTopMenu('');
		setCurrentMidMenu('');
		setCurrentBotMenu('');
	};

	const toggleHeaderCollapse = () => {
		setIsHeaderCollapsed(!isHeaderCollapsed);
	};

	return (
		<div className="flex flex-col select-none">
			{/* 헤더 토글 바 */}
			<div
				className="h-[18px] w-full bg-muted/60 border-y border-border flex items-center justify-center cursor-pointer hover:bg-primary/20 group"
				onClick={toggleHeaderCollapse}>
				<Minus className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:scale-110" />
			</div>

			{/* 헤더 콘텐츠 */}
			<div
				className={`bg-gradient-to-r from-card/50 via-background/70 to-card/40 border-b border-border/60 shadow-[0_2px_4px_rgba(0,0,0,0.08)] transition-all duration-300 ${
					isHeaderCollapsed
						? 'max-h-0 p-0 overflow-hidden opacity-0 border-b-0'
						: 'max-h-[200px] p-5 pt-4 opacity-100'
				}`}>
				{/* 로고 영역 */}
				<div
					className={`relative flex items-center justify-center px-2 mb-4 ${isHeaderCollapsed ? 'h-0' : ''}`}>
					{/* 타이틀 영역 */}
					<div className="flex-1 flex justify-center max-w-[250px]">
						<Button
							variant="ghost"
							className="w-full h-auto p-0 text-left hover:bg-transparent group select-none"
							asChild>
							<Link
								href="/"
								onClick={handleLogoClick}
								className="block transition-all duration-200 group-hover:scale-105 select-none">
								<div className="flex items-center justify-center gap-4">
									<div className="flex items-center justify-center flex-shrink-0 transition-all duration-200 border-2 w-14 h-14 neumorphic rounded-xl group-hover:scale-110 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
										<Building2 className="font-bold w-9 h-9 text-primary drop-shadow-md" />
									</div>
									<div className="text-xl font-semibold transition-colors text-foreground/90 group-hover:text-primary/90 truncate max-w-[160px] drop-shadow-sm">
										건물 타이틀
									</div>
								</div>
							</Link>
						</Button>
					</div>
				</div>

				{/* 현장검색 영역 */}
				<div className={`px-1 ${isHeaderCollapsed ? 'h-0' : ''}`}>
					<SearchBar />
				</div>
			</div>
		</div>
	);
}
// #endregion
