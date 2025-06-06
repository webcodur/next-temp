'use client';

import { ReactNode } from 'react';
import { useAtom } from 'jotai';
import { sidebarCollapsedAtom } from '@/store/sidebar';

// components
import { Sidebar } from './sidebar/sidebar';
import { Header } from './header/Header';
import Footer from './footer/Footer';
import { SidebarToggle } from './sidebar/unit/sidebarToggle';
import { HeaderToggle } from './sidebar/unit/headerToggle';

// data
import { defaults } from '@/data/sidebarConfig';

interface MainLayoutProps {
	children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);

	return (
		<div className="flex h-screen bg-background">
			<SidebarToggle />
			<HeaderToggle />
			<Sidebar />

			<main
				style={{
					marginLeft: isCollapsed ? '50px' : `${defaults.sidebarWidth}px`,
				}}
				className="flex flex-col flex-1 h-screen overflow-hidden transition-all duration-300">
				<div className="flex-1 overflow-y-scroll">
					<Header />
					<div className="container p-6 mx-auto">{children}</div>
					<Footer />
				</div>
			</main>
		</div>
	);
}
