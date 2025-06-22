'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { sidebarCollapsedAtom } from '@/store/sidebar';

// components
import { Sidebar } from './sidebar/Sidebar';
import { Header } from './header/Header';
import Footer from './footer/Footer';
import { SideToggleMain } from './sidebar/unit/SideToggleMain';
import { SideToggleHead } from './sidebar/unit/SideToggleHead';

// hooks
import { useSidebarKeyboard } from './sidebar/hooks';

// data
import { defaults, animations } from '@/data/sidebarConfig';

interface MainLayoutProps {
	children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);
	const pathname = usePathname();
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// 키보드 단축키 활성화
	useSidebarKeyboard();

	// 페이지 변경 시 스크롤 최상단으로 이동
	useEffect(() => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop = 0;
		}
	}, [pathname]);

	return (
		<div className="flex h-screen bg-background">
			<SideToggleMain />
			<SideToggleHead />
			<Sidebar />

			<main
				style={{
					marginLeft: isCollapsed ? '0px' : `${defaults.sidebarWidth}px`,
					transition: `margin-left ${animations.sidebarDuration}ms ease-in-out`,
				}}
				className="flex overflow-hidden flex-col flex-1 h-screen">
				<div
					ref={scrollContainerRef}
					className="overflow-y-scroll flex-1 bg-gray-50">
					<Header />
					<div className="flex flex-1 justify-center items-center px-6 py-8">
						<div className="container p-8 mx-auto w-full max-w-7xl bg-white rounded-lg border border-gray-100 shadow-sm min-h-96 min-w-96">
							{children}
						</div>
					</div>
					<Footer />
				</div>
			</main>
		</div>
	);
}
