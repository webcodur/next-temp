'use client';

import { useAtom } from 'jotai';
import { Minus } from 'lucide-react';
import { headerCollapsedAtom, sidebarCollapsedAtom } from '@/store/sidebar';
import { defaults } from '@/data/sidebarConfig';

/**
 * 헤더 토글 버튼 컴포넌트
 * - 사이드바 헤더 영역의 접힘/펼침을 제어하는 버튼
 * - 헤더 상단에 가로 바 형태로 배치 (우측 부분만)
 * - 좌측 96px 영역은 전체 토글 버튼을 위해 비워둠
 */
export function HeaderToggle() {
	const [isHeaderCollapsed, setIsHeaderCollapsed] =
		useAtom(headerCollapsedAtom);
	const [isSidebarCollapsed] = useAtom(sidebarCollapsedAtom);

	const handleToggle = () => {
		setIsHeaderCollapsed(!isHeaderCollapsed);
	};

	// 사이드바가 접혀있으면 헤더 토글도 숨김
	if (isSidebarCollapsed) {
		return null;
	}

	return (
		<div
			style={{
				position: 'fixed',
				left: '0px',
				top: '0px',
				width: `${defaults.sidebarWidth}px`,
				height: '36px',
				zIndex: 45,
			}}
			className="bg-muted border-y border-border flex">
			{/* 좌측 영역 - 전체 토글 버튼 공간 (비워둠) */}
			<div className="w-[50px] border-r-2 border-r-border"></div>

			{/* 우측 영역 - 헤더 토글 버튼 */}
			<div
				className="flex-1 flex items-center justify-center cursor-pointer hover:bg-primary/20 group transition-all duration-300 rounded-bl-lg rounded-br-lg"
				onClick={handleToggle}
				title={isHeaderCollapsed ? '헤더 펼치기' : '헤더 접기'}>
				<Minus className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-200" />
			</div>
		</div>
	);
}
