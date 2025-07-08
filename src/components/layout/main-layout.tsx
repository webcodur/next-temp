'use client';

import { ReactNode, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { sidebarCollapsedAtom, endPanelWidthAtom, isResizingAtom } from '@/store/sidebar';
import { initThemeAtom } from '@/store/theme';
import { initPrimaryColorAtom } from '@/store/primary';
import { useLocale } from '@/hooks/useI18n';
// components
import { Sidebar } from './sidebar/Sidebar';
import { Header } from './header/Header';
import PageHeader from './PageHeader';
import { SideToggleControl } from './sidebar/unit/control/SideToggleControl';

// hooks
import { useSidebarKeyboard } from './sidebar/unit/control/useSidebarKeyboard';
import { useThemeKeyboard } from '@/hooks/useThemeKeyboard';
// data
import { defaults, animations } from '@/data/sidebarConfig';

interface MainLayoutProps {
	children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);
	const [endPanelWidth] = useAtom(endPanelWidthAtom);
	const [isResizing] = useAtom(isResizingAtom);
	const [, initTheme] = useAtom(initThemeAtom);
	const [, initPrimaryColor] = useAtom(initPrimaryColorAtom);
	const { isRTL } = useLocale();
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const sidebarWidth = defaults.startColumnWidth + endPanelWidth;

	// 테마 초기화
	useEffect(() => {
		initTheme();
		initPrimaryColor();
	}, [initTheme, initPrimaryColor]);

	// 키보드 단축키 활성화
	useSidebarKeyboard();
	useThemeKeyboard();

	// 논리적 속성으로 마진 스타일 계산
	const mainStyle = {
		marginInlineStart: isCollapsed ? '0px' : `${sidebarWidth}px`,
		transition: isResizing ? 'none' : `margin-inline-start ${animations.sidebarDuration}ms ease-in-out`,
	};

	return (
		<div className="flex h-screen" dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
			<SideToggleControl />
			<Sidebar />
			<main
				style={mainStyle}
				className="flex overflow-hidden flex-col flex-1 bg-surface-3">
        {/* 헤더 */}
				<Header />

        {/* 콘텐츠 컨테이너 */}
				<div ref={scrollContainerRef} className="overflow-auto flex-1">
          {/* 1440 규격 컨테이너 */}
					<div className="w-full max-w-full 2xl:max-w-[1440px] px-4 sm:px-6 lg:px-8 mx-auto py-10">
						{/* 콘텐츠 카드 */}
						<div className="flex flex-col gap-6 p-8 mx-auto rounded-lg bg-surface-1 neu-elevated">
              <PageHeader />
              {children}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}