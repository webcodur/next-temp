'use client';

import Link from 'next/link';
import { useAtom } from 'jotai';
import { ChevronUp, ChevronDown } from 'lucide-react';
import {
	currentTopMenuAtom,
	currentMidMenuAtom,
	currentBotMenuAtom,
} from '@/store/sidebar';
import { Button } from '@/components/ui/button';

// #region side_header: 사이드바 헤더 컴포넌트
interface SideHeaderProps {
	onExpandAll?: () => void;
	onCollapseAll?: () => void;
}

export function SideHeader({ onExpandAll, onCollapseAll }: SideHeaderProps) {
	const [, setCurrentTopMenu] = useAtom(currentTopMenuAtom);
	const [, setCurrentMidMenu] = useAtom(currentMidMenuAtom);
	const [, setCurrentBotMenu] = useAtom(currentBotMenuAtom);

	const handleLogoClick = () => {
		setCurrentTopMenu('');
		setCurrentMidMenu('');
		setCurrentBotMenu('');
	};

	return (
		<div className="p-6 pt-4 border-b border-border/60 bg-gradient-to-r from-background/60 to-background/40 backdrop-blur-sm">
			<div className="flex items-center gap-6">
				<div className="flex-shrink-0 w-12 h-10"></div>{' '}
				{/* 토글 버튼 공간 확보 */}
				<div className="flex-1">
					<Button
						variant="ghost"
						className="h-auto p-0 text-left hover:bg-transparent group"
						asChild>
						<Link
							href="/"
							onClick={handleLogoClick}
							className="block transition-all duration-200 group-hover:scale-105">
							<div className="leading-tight">
								<div className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
									서비스 로고
								</div>
								<div className="mt-1 text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
									top/mid/bot 3단 템플릿
								</div>
							</div>
						</Link>
					</Button>
				</div>
				{/* 전체 접힘/펼침 버튼 */}
				<div className="flex gap-1">
					<Button
						variant="ghost"
						size="sm"
						onClick={onExpandAll}
						className="h-8 w-8 p-0 hover:bg-muted/60 transition-colors"
						title="전체 펼치기">
						<ChevronUp className="w-4 h-4" />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={onCollapseAll}
						className="h-8 w-8 p-0 hover:bg-muted/60 transition-colors"
						title="전체 접기">
						<ChevronDown className="w-4 h-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
// #endregion
