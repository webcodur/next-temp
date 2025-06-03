'use client';

import { ReactNode } from 'react';
import { useAtom } from 'jotai';
import { sidebarCollapsedAtom } from '@/store/sidebar';
import { Sidebar } from './sidebar/sidebar';
import { SidebarToggle } from './sidebarToggle';
import { Header } from './header/header';

interface MainLayoutProps {
	children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);

	return (
		<div className="flex h-screen bg-background">
			<Sidebar />
			<SidebarToggle />
			<main
				className={`flex-1 flex flex-col transition-all duration-300 ${
					isCollapsed ? 'ml-0' : 'ml-[350px]'
				}`}>
				<Header />
				<div className="flex-1 p-6 overflow-auto">{children}</div>
			</main>
		</div>
	);
}
