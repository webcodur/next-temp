'use client';

import { useAtom } from 'jotai';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { sidebarCollapsedAtom } from '@/store/sidebar';
import { getMainToggleStyles, toggleButtonIcon } from '../../sidebarStyles';
import { useLocale } from '@/hooks/useI18n';
/**
 * 사이드바 메인 토글 버튼 컴포넌트
 * - 사이드바 전체의 숨김/표시를 제어하는 메인 버튼
 * - 사이드바 접힘 시에도 계속 표시되어야 함
 * - 단순한 토글 방식으로 즉시 반응
 */
export function SideToggleControl() {
	const [isMainCollapsed, setIsMainCollapsed] = useAtom(sidebarCollapsedAtom);
	const { isRTL } = useLocale();

	const handleMainToggle = () => {
		setIsMainCollapsed(!isMainCollapsed);
	};

	// RTL 모드에 따른 아이콘 결정
	const getToggleIcon = () => {
		if (isRTL) {
			// RTL: 사이드바가 오른쪽에서 나타남
			return isMainCollapsed ? <ChevronLeft className={toggleButtonIcon} /> : <ChevronRight className={toggleButtonIcon} />;
		} else {
			// LTR: 사이드바가 왼쪽에서 나타남
			return isMainCollapsed ? <ChevronRight className={toggleButtonIcon} /> : <ChevronLeft className={toggleButtonIcon} />;
		}
	};

	return (
		<div
			style={{
				position: 'fixed',
				insetInlineStart: '0px',  // 논리적 속성: RTL에서는 오른쪽, LTR에서는 왼쪽
				top: '0px',
				width: '50px',
				height: '30px',
				zIndex: 50,
			}}
			className={getMainToggleStyles()}
			onClick={handleMainToggle}
			title={isMainCollapsed ? '사이드바 열기' : '사이드바 닫기'}>
			{getToggleIcon()}
		</div>
	);
} 