// #region MainLayout 구조
/*
 * [레이아웃 구조]
 * 이 컴포넌트는 '사이드바 + 헤더 + 콘텐츠'의 3단 구조를 가진다.
 * 전체 화면을 차지하는 최상위 div는 좌우로 Sidebar와 메인 콘텐츠 영역을 나눈다.
 * 메인 콘텐츠 영역은 상하로 Header와 실제 페이지 콘텐츠(children)로 구성된다.
 *
 * <div (h-screen, flex)>
 *   ├── <Sidebar />
 *   └── <div (flex-1, flex-col)>
 *         ├── <Header />
 *         └── <div (flex-1, flex)>
 *               ├── <SecondaryPanel />
 *               └── <main (flex-1)>
 *                     └── {children}
 *
 * [Overflow 관리 전략]
 * 레이아웃의 핵심은 스크롤 제어에 있다.
 * 1. 부모 컨테이너 (`overflow-hidden`): Header와 Main 영역을 감싸는 컨테이너들에 `overflow-hidden`을 적용하여,
 *    해당 영역 자체에서는 스크롤바가 생기지 않도록 막는다. 이는 스크롤 제어권을 자식 요소로 넘기기 위함이다.
 * 2. 콘텐츠 영역 (`overflow-y-auto`): 실제 페이지 콘텐츠가 렌더링되는 `<main>` 태그에 `overflow-y-auto`를 적용한다.
 *    이를 통해 콘텐츠의 양이 많아져도 페이지 전체가 아닌 `<main>` 영역 내부에서만 스크롤이 발생한다.
 *
 * 이 방식은 Header와 Sidebar를 화면에 고정한 채 콘텐츠 영역만 독립적으로 스크롤할 수 있게 하여
 * 안정적인 사용자 경험을 제공한다.
 */
// #endregion
'use client';

import { ReactNode, useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { initThemeAtom } from '@/store/theme';
import { initPrimaryColorAtom } from '@/store/primary';
import { useLocale } from '@/hooks/useI18n';
// components
import PageHeader from '@/components/layout/PageHeader';
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
			<div className="flex overflow-hidden flex-col flex-1 h-screen">
				<Header />
				<div className="flex overflow-hidden flex-1">
					{!isCollapsed && <SecondaryPanel />}
					<main className="overflow-y-auto flex-1 py-10">
						<div className="p-10 mx-auto max-w-7xl bg-surface-1 rounded-10">
							<div className="mb-6">
								<PageHeader />
							</div>
                {children}
						</div>  
					</main>
				</div>
			</div>
		</div>
	);
}