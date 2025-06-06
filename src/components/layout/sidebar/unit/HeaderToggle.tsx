'use client';

import { useAtom } from 'jotai';
import { Minus } from 'lucide-react';
import { headerCollapsedAtom, headerToggleVisibleAtom } from '@/store/sidebar';
import { defaults, animations } from '@/data/sidebarConfig';

/**
 * 헤더 토글 버튼 컴포넌트
 * - 사이드바 헤더 영역의 접힘/펼침을 제어하는 버튼
 * - 헤더 상단에 가로 바 형태로 배치 (우측 부분만)
 * - 좌측 96px 영역은 전체 토글 버튼을 위해 비워둠
 */
export function HeaderToggle() {
	const [isHeaderCollapsed, setIsHeaderCollapsed] =
		useAtom(headerCollapsedAtom);
	const [isVisible] = useAtom(headerToggleVisibleAtom);

	const handleToggle = () => {
		setIsHeaderCollapsed(!isHeaderCollapsed);
	};

	return (
		<div
			style={{
				position: 'fixed',
				left: '0px',
				top: '0px',
				width: `${defaults.sidebarWidth}px`,
				height: '36px',
				zIndex: 45,
				transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
				opacity: isVisible ? 1 : 0,
				transition: `transform ${animations.headerToggleDuration}ms ease-in-out, opacity ${animations.headerToggleDuration}ms ease-in-out`,
				pointerEvents: isVisible ? 'auto' : 'none',
			}}
			className="flex bg-muted border-y border-border">
			{/* 좌측 영역 - 전체 토글 버튼 공간 (비워둠) */}
			<div className="w-[50px] border-r-2 border-r-border"></div>

			{/* 우측 영역 - 헤더 토글 버튼 */}
			<div
				className="flex items-center justify-center flex-1 transition-all duration-300 rounded-bl-lg rounded-br-lg cursor-pointer hover:bg-primary/20 group"
				onClick={handleToggle}
				title={isHeaderCollapsed ? '헤더 펼치기' : '헤더 접기'}>
				<Minus className="w-5 h-5 transition-all duration-200 text-muted-foreground group-hover:text-primary group-hover:scale-110" />
			</div>
		</div>
	);
}
