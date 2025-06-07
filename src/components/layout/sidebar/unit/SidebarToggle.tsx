'use client';

import { useAtom } from 'jotai';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { sidebarCollapsedAtom } from '@/store/sidebar';
import { defaults } from '@/data/sidebarConfig';

/**
 * 사이드바 전체 토글 버튼 컴포넌트
 * - 사이드바 전체의 숨김/표시를 제어하는 버튼
 * - 헤더 토글 영역의 좌측에 위치하여 시각적 일체감 제공
 * - 사이드바 접힘 시에도 계속 표시되어야 함
 */
export function SidebarToggle() {
	const [isCollapsed, setIsCollapsed] = useAtom(sidebarCollapsedAtom);

	const handleToggle = () => {
		setIsCollapsed(!isCollapsed);
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
			onClick={handleToggle}
			title={isCollapsed ? '사이드바 열기' : '사이드바 닫기'}>
			{isCollapsed ? (
				<ChevronRight className="w-5 h-5 transition-all duration-200 text-muted-foreground group-hover:text-primary group-hover:scale-110" />
			) : (
				<ChevronLeft className="w-5 h-5 transition-all duration-200 text-muted-foreground group-hover:text-primary group-hover:scale-110" />
			)}
		</div>
	);
}
