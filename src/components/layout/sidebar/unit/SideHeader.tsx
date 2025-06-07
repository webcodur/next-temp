'use client';

import Link from 'next/link';
import { useAtom } from 'jotai';
import { Building2 } from 'lucide-react';
import {
	currentTopMenuAtom,
	currentMidMenuAtom,
	currentBotMenuAtom,
	headerCollapsedAtom,
} from '@/store/sidebar';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/layout/sidebar/unit/searchBar';

/**
 * 사이드바 헤더 컴포넌트
 * - 사이드바 상단에 위치하는 헤더 영역
 * - 로고, 타이틀, 검색바를 포함
 * - 접힘/펼침 기능으로 공간 절약 가능
 */

// #region side_header: 사이드바 헤더 컴포넌트
export function SideHeader() {
	// 메뉴 상태 초기화를 위한 atom 관리
	const [, setCurrentTopMenu] = useAtom(currentTopMenuAtom);
	const [, setCurrentMidMenu] = useAtom(currentMidMenuAtom);
	const [, setCurrentBotMenu] = useAtom(currentBotMenuAtom);
	const [isHeaderCollapsed] = useAtom(headerCollapsedAtom);

	/**
	 * 로고 클릭 시 메뉴 상태 초기화
	 * - 홈으로 이동하면서 모든 메뉴 선택 해제
	 */
	const handleLogoClick = () => {
		setCurrentTopMenu('');
		setCurrentMidMenu('');
		setCurrentBotMenu('');
	};

	return (
		<div className="flex flex-col select-none pt-[36px]">
			{/* 헤더 콘텐츠 - 로고 및 검색 영역 */}
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
									{/* 로고 아이콘 */}
									<div className="flex items-center justify-center flex-shrink-0 transition-all duration-200 border-2 w-14 h-14 neumorphic rounded-xl group-hover:scale-110 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
										<Building2 className="font-bold w-9 h-9 text-primary drop-shadow-md" />
									</div>
									{/* 타이틀 텍스트 */}
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
