'use client';

import { ReactNode, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { sidebarCollapsedAtom, rPanelWidthAtom, isResizingAtom } from '@/store/sidebar';
import { initThemeAtom } from '@/store/theme';
import { initBrandColorAtom } from '@/store/brand';
import { useLocale } from '@/hooks/useI18n';
// components
import { Sidebar } from './sidebar/Sidebar';
import { Header } from './header/Header';
import { SideToggleMain } from './sidebar/unit/SideToggleMain';
import Footer from './footer/Footer';

// hooks
import { useSidebarKeyboard } from './sidebar/hooks';
// data
import { defaults, animations } from '@/data/sidebarConfig';

interface MainLayoutProps {
	children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);
	const [rPanelWidth] = useAtom(rPanelWidthAtom);
	const [isResizing] = useAtom(isResizingAtom);
	const [, initTheme] = useAtom(initThemeAtom);
	const [, initBrandColor] = useAtom(initBrandColorAtom);
	const { isRTL } = useLocale();
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const sidebarWidth = defaults.leftColumnWidth + rPanelWidth;

	// 테마 초기화
	useEffect(() => {
		initTheme();
		initBrandColor();
	}, [initTheme, initBrandColor]);

	// 키보드 단축키 활성화
	useSidebarKeyboard();

	// 논리적 속성으로 마진 스타일 계산
	const mainStyle = {
		marginInlineStart: isCollapsed ? '0px' : `${sidebarWidth}px`,
		transition: isResizing ? 'none' : `margin-inline-start ${animations.sidebarDuration}ms ease-in-out`,
	};

	return (
		<div className="flex overflow-scroll h-screen bg-surface-2" dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
			<SideToggleMain />
			<Sidebar />
			<main
				style={mainStyle}
				className="flex flex-col flex-1 bg-surface-1">
				<Header />
				<div ref={scrollContainerRef} className="flex-1">
					<div className="max-w-[1440px] mx-auto px-6 w-full py-6">
						{children}
					</div>
				</div>
				<Footer />
			</main>
		</div>
	);
}
 