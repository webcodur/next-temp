'use client';

import { useAtom } from 'jotai';
import { Minus } from 'lucide-react';
import { headerCollapsedAtom } from '@/store/sidebar';

/**
 * 헤더 토글 버튼 컴포넌트
 * - 사이드바 헤더 영역의 접힘/펼침을 제어하는 버튼
 * - 헤더 상단에 가로 바 형태로 배치
 * - 공간 절약을 위한 헤더 숨김 기능 제공
 */
export function HeaderToggle() {
	const [isHeaderCollapsed, setIsHeaderCollapsed] =
		useAtom(headerCollapsedAtom);

	const handleToggle = () => {
		setIsHeaderCollapsed(!isHeaderCollapsed);
	};

	return (
		<div
			className="h-[18px] w-full bg-muted/60 border-y border-border flex items-center justify-center cursor-pointer hover:bg-primary/20 group"
			onClick={handleToggle}
			title={isHeaderCollapsed ? '헤더 펼치기' : '헤더 접기'}>
			<Minus className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:scale-110" />
		</div>
	);
}
