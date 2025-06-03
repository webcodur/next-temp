'use client';

import Link from 'next/link';
import { useAtom } from 'jotai';
import { Building2 } from 'lucide-react';
import {
	currentTopMenuAtom,
	currentMidMenuAtom,
	currentBotMenuAtom,
} from '@/store/sidebar';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/layout/sidebar/unit/searchBar';

// #region side_header: 사이드바 헤더 컴포넌트
export function SideHeader() {
	const [, setCurrentTopMenu] = useAtom(currentTopMenuAtom);
	const [, setCurrentMidMenu] = useAtom(currentMidMenuAtom);
	const [, setCurrentBotMenu] = useAtom(currentBotMenuAtom);

	const handleLogoClick = () => {
		setCurrentTopMenu('');
		setCurrentMidMenu('');
		setCurrentBotMenu('');
	};

	return (
		<div className="p-5 pt-4 bg-gradient-to-r from-card/50 via-background/70 to-card/40 border-b border-border/60 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
			{/* 로고 영역 */}
			<div className="relative flex items-center justify-center px-2 mb-4">
				{/* 타이틀 영역 - 더 부각된 스타일링 */}
				<div className="flex-1 flex justify-center max-w-[250px]">
					<Button
						variant="ghost"
						className="w-full h-auto p-0 text-left hover:bg-transparent group"
						asChild>
						<Link
							href="/"
							onClick={handleLogoClick}
							className="block transition-all duration-200 group-hover:scale-105">
							<div className="flex items-center justify-center gap-4">
								<div className="flex items-center justify-center flex-shrink-0 w-14 h-14 transition-all duration-200 border-2 neumorphic rounded-xl group-hover:scale-110 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
									<Building2 className="w-9 h-9 font-bold text-primary drop-shadow-md" />
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
			<div className="px-1">
				<SearchBar />
			</div>
		</div>
	);
}
// #endregion
