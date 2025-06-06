'use client';

import { useAtom } from 'jotai';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { sidebarCollapsedAtom } from '@/store/sidebar';

/**
 * 사이드바 토글 버튼 컴포넌트
 * - 사이드바 전체의 숨김/표시를 제어하는 세로 스트립 버튼
 * - 화면 왼쪽 고정 위치에 배치
 * - 호버 시 시각적 피드백 제공
 */
export function SidebarToggle() {
	const [isCollapsed, setIsCollapsed] = useAtom(sidebarCollapsedAtom);

	const handleToggle = () => {
		setIsCollapsed(!isCollapsed);
	};

	return (
		<div
			onClick={handleToggle}
			className={`fixed top-0 h-full w-4 z-50 cursor-pointer border-r border-border bg-muted/60 hover:bg-primary/20 group left-0`}
			title={isCollapsed ? '사이드바 열기' : '사이드바 닫기'}>
			<div className="absolute flex items-center justify-center w-full -translate-y-1/2 top-1/2 opacity-70 group-hover:opacity-100">
				{isCollapsed ? (
					<ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:scale-110" />
				) : (
					<ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:scale-110" />
				)}
			</div>
		</div>
	);
}
