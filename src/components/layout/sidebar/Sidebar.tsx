/* 
  파일명: /components/layout/sidebar/Sidebar.tsx
  기능: 메인 레이아웃의 사이드바 컨테이너 컴포넌트
  책임: PrimaryBar를 포함한 사이드바 렌더링과 키보드 단축키 처리
*/ // ------------------------------
'use client';

import { useSidebarKeyboard } from './unit/control/useSidebarKeyboard';
import { PrimaryBar } from './unit/PrimaryBar';

import { defaults } from '@/data/sidebarConfig';

export function Sidebar() {
	// #region 훅
	useSidebarKeyboard();
	// #endregion

	// #region 렌더링
	return (
		<aside
			style={{
				width: `${defaults.startColumnWidth}px`,
			}}
			className="flex h-screen bg-surface-2">
			<PrimaryBar />
		</aside>
	);
	// #endregion
}
