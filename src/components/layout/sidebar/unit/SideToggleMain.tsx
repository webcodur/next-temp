'use client';

import { useAtom } from 'jotai';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { sidebarCollapsedAtom } from '@/store/sidebar';
import { getMainToggleStyles, toggleButtonIcon } from './sidebarStyles';

/**
 * 사이드바 메인 토글 버튼 컴포넌트
 * - 사이드바 전체의 숨김/표시를 제어하는 메인 버튼
 * - 사이드바 접힘 시에도 계속 표시되어야 함
 * - 단순한 토글 방식으로 즉시 반응
 */
export function SideToggleMain() {
	const [isMainCollapsed, setIsMainCollapsed] = useAtom(sidebarCollapsedAtom);

	const handleMainToggle = () => {
		setIsMainCollapsed(!isMainCollapsed);
	};

	return (
		<div
			style={{
				position: 'fixed',
				left: '0px',
				top: '0px',
				width: '50px',
				height: '30px',
				zIndex: 50,
			}}
			className={getMainToggleStyles()}
			onClick={handleMainToggle}
			title={isMainCollapsed ? '사이드바 열기' : '사이드바 닫기'}>
			{isMainCollapsed ? (
				<ChevronRight className={toggleButtonIcon} />
			) : (
				<ChevronLeft className={toggleButtonIcon} />
			)}
		</div>
	);
}
