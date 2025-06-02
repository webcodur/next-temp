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
		<div
			className="
			p-4 pt-3 
			bg-gradient-to-r from-white/50 via-gray-50/70 to-white/40
			border-b border-gray-300/60 
			shadow-[0_2px_4px_rgba(0,0,0,0.08)]
		">
			{/* 로고 영역 */}
			<div className="flex items-center justify-center mb-3 px-16">
				{/* 타이틀 영역 */}
				<div className="flex-1 flex justify-center max-w-[200px]">
					<Button
						variant="ghost"
						className="h-auto p-0 text-left hover:bg-transparent group w-full"
						asChild>
						<Link
							href="/"
							onClick={handleLogoClick}
							className="block transition-all duration-200 group-hover:scale-105">
							<div className="flex items-center gap-3 justify-center">
								<div
									className="
									flex items-center justify-center w-8 h-8 flex-shrink-0
									bg-gradient-to-br from-white/90 to-gray-100/70
									shadow-[2px_2px_4px_rgba(0,0,0,0.1),_-2px_-2px_4px_rgba(255,255,255,0.8)]
									border border-white/60 rounded-xl
									transition-all duration-200
									group-hover:shadow-[1px_1px_2px_rgba(0,0,0,0.12),_-1px_-1px_2px_rgba(255,255,255,0.9)]
									group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-gray-50/80
								">
									<Building2 className="w-5 h-5 text-gray-600 drop-shadow-sm" />
								</div>
								<div className="text-sm transition-colors text-muted-foreground group-hover:text-muted-foreground/80 truncate max-w-[120px]">
									건물 타이틀
								</div>
							</div>
						</Link>
					</Button>
				</div>
			</div>

			{/* 검색대 영역 */}
			<div className="px-1">
				<SearchBar />
			</div>
		</div>
	);
}
// #endregion
