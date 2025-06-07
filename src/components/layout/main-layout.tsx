'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { sidebarCollapsedAtom } from '@/store/sidebar';

// components
import { Sidebar } from './sidebar/Sidebar';
import { Header } from './header/Header';
import Footer from './footer/Footer';
import { SidebarToggle } from './sidebar/unit/SidebarToggle';
import { HeaderToggle } from './sidebar/unit/HeaderToggle';

// data
import { defaults, animations } from '@/data/sidebarConfig';

interface MainLayoutProps {
	children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);
	const pathname = usePathname();
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// 페이지 변경 시 스크롤 최상단으로 이동
	useEffect(() => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop = 0;
		}
	}, [pathname]);

	return (
		<div className="flex h-screen bg-background">
			<SidebarToggle />
			<HeaderToggle />
			<Sidebar />

			<main
				style={{
					marginLeft: isCollapsed ? '0px' : `${defaults.sidebarWidth}px`,
					transition: `margin-left ${animations.sidebarDuration}ms ease-in-out`,
				}}
				className="flex flex-col flex-1 h-screen overflow-hidden">
				<div
					ref={scrollContainerRef}
					className="flex-1 overflow-y-scroll bg-gray-50">
					<Header />
					<div className="flex items-center justify-center flex-1 px-6 py-8">
						<div className="container w-full p-8 mx-auto bg-white border border-gray-100 rounded-lg shadow-sm max-w-7xl min-h-96 min-w-96">
							{children}
						</div>
					</div>
					<Footer />
				</div>
			</main>
		</div>
	);
}
