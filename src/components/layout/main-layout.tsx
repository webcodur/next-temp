'use client';

import { ReactNode, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { sidebarCollapsedAtom, rPanelWidthAtom, isResizingAtom } from '@/store/sidebar';
import { initThemeAtom } from '@/store/theme';
// components
import { Sidebar } from './sidebar/Sidebar';
import { Header } from './header/Header';
import { SideToggleMain } from './sidebar/unit/SideToggleMain';
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
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const sidebarWidth = defaults.leftColumnWidth + rPanelWidth;

	// 테마 초기화
	useEffect(() => {
		initTheme();
	}, [initTheme]);

	// 키보드 단축키 활성화
	useSidebarKeyboard();

	return (
		<div className="flex h-screen bg-background overflow-hidden" suppressHydrationWarning>
			<SideToggleMain />
			<Sidebar />

			<main
				style={{
					marginLeft: isCollapsed ? '0px' : `${sidebarWidth}px`,
					transition: isResizing ? 'none' : `margin-left ${animations.sidebarDuration}ms ease-in-out`,
				}}
				className="flex flex-col flex-1">

      <Header />
				<div
					ref={scrollContainerRef}
					className="flex-1 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto px-6 w-full py-6">
            {children}
          </div>
				</div>
			</main>
		</div>
	);
}
