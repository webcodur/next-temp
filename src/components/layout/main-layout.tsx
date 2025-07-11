'use client';

import { ReactNode, useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { initThemeAtom } from '@/store/theme';
import { initPrimaryColorAtom } from '@/store/primary';
import { useLocale } from '@/hooks/useI18n';
// components
import { Sidebar } from './sidebar/Sidebar';
import { Header } from './header/Header';
import { SecondaryPanel } from './sidebar/unit/SecondaryPanel';
// hooks
import { useThemeKeyboard } from '@/hooks/useThemeKeyboard';
// data
import { sidebarCollapsedAtom } from '@/store/sidebar';

interface MainLayoutProps {
	children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
	const [, initTheme] = useAtom(initThemeAtom);
	const [, initPrimaryColor] = useAtom(initPrimaryColorAtom);
	const { isRTL } = useLocale();
	const isCollapsed = useAtomValue(sidebarCollapsedAtom);

	// 테마 초기화
	useEffect(() => {
		initTheme();
		initPrimaryColor();
	}, [initTheme, initPrimaryColor]);

	// 키보드 단축키 활성화
	useThemeKeyboard();

	return (
		<div className="flex h-screen bg-surface-3" dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
			<Sidebar />
			<div className="flex flex-col flex-1">
				<Header />
				<div className="flex overflow-hidden flex-1">
					{!isCollapsed && <SecondaryPanel />}
					<main className="w-[1440px] mx-auto py-4">{children}</main>
				</div>
			</div>
		</div>
	);
}