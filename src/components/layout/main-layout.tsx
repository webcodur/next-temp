'use client';

import { ReactNode, useEffect } from 'react';
import { useAtom } from 'jotai';
import { sidebarCollapsedAtom } from '@/store/sidebar';
import { initThemeAtom } from '@/store/theme';
import { initPrimaryColorAtom } from '@/store/primary';
import { useLocale } from '@/hooks/useI18n';
// components
import { Sidebar } from './sidebar/Sidebar';
import { Header } from './header/Header';
// hooks
import { useThemeKeyboard } from '@/hooks/useThemeKeyboard';
// data
import { defaults, animations } from '@/data/sidebarConfig';

interface MainLayoutProps {
	children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);
	const [, initTheme] = useAtom(initThemeAtom);
	const [, initPrimaryColor] = useAtom(initPrimaryColorAtom);
	const { isRTL } = useLocale();

	const sidebarWidth = isCollapsed
		? defaults.startColumnWidth
		: defaults.startColumnWidth + defaults.expandedWidth;

	// 테마 초기화
	useEffect(() => {
		initTheme();
		initPrimaryColor();
	}, [initTheme, initPrimaryColor]);

	// 키보드 단축키 활성화
	useThemeKeyboard();

	// 논리적 속성으로 마진 스타일 계산
	const mainStyle = {
		marginInlineStart: `${sidebarWidth}px`,
		transition: `margin-inline-start ${animations.sidebarDuration}ms ease-in-out`,
	};

	return (
		<div className="flex h-screen" dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
			<Sidebar />
			<main
				style={mainStyle}
				className="flex overflow-hidden flex-col flex-1 bg-surface-3">
				{/* 헤더 */}
				<Header />

				{/* 콘텐츠 컨테이너 */}
				<div className="overflow-auto flex-1">
					{/* 1440 규격 컨테이너 */}
					<div className="w-full max-w-full 2xl:max-w-[1440px] px-4 sm:px-6 lg:px-8 mx-auto py-10">
						{/* 콘텐츠 카드 */}
						<div className="flex flex-col gap-6 p-8 mx-auto rounded-lg bg-surface-1 neu-elevated">
							{children}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}