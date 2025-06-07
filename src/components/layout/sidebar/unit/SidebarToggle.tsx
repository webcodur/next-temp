'use client';

import { useAtom } from 'jotai';
import {} from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { sidebarCollapsedAtom, headerToggleVisibleAtom } from '@/store/sidebar';
import { animations } from '@/data/sidebarConfig';

/**
 * 사이드바 전체 토글 버튼 컴포넌트
 * - 사이드바 전체의 숨김/표시를 제어하는 버튼
 * - 헤더 토글 영역의 좌측에 위치하여 시각적 일체감 제공
 * - 사이드바 접힘 시에도 계속 표시되어야 함
 */
export function SidebarToggle() {
	const [isCollapsed, setIsCollapsed] = useAtom(sidebarCollapsedAtom);
	const [, setHeaderToggleVisible] = useAtom(headerToggleVisibleAtom);

	// 지연 함수
	const delay = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	const handleToggle = async () => {
		if (isCollapsed) {
			// 오프닝 시퀀스: 사이드바 펼치기 → 대기 → 헤더 토글 표시
			setIsCollapsed(false);
			await delay(animations.sidebarDuration);
			setHeaderToggleVisible(true);
		} else {
			// 클로징 시퀀스: 헤더 토글 숨기기 → 대기 → 사이드바 접기
			setHeaderToggleVisible(false);
			await delay(animations.headerToggleDuration);
			setIsCollapsed(true);
		}
	};

	return (
		<div
			style={{
				position: 'fixed',
				left: '0px',
				top: '0px',
				width: '50px',
				height: '36px',
				zIndex: 50,
			}}
			className="flex items-center justify-center transition-all duration-300 border-r-2 rounded-bl-lg rounded-br-lg cursor-pointer bg-muted border-y border-border border-r-border hover:bg-primary/20 group"
			onClick={() => {
				void handleToggle();
			}}
			title={isCollapsed ? '사이드바 열기' : '사이드바 닫기'}>
			{isCollapsed ? (
				<ChevronRight className="w-5 h-5 transition-all duration-200 text-muted-foreground group-hover:text-primary group-hover:scale-110" />
			) : (
				<ChevronLeft className="w-5 h-5 transition-all duration-200 text-muted-foreground group-hover:text-primary group-hover:scale-110" />
			)}
		</div>
	);
}
