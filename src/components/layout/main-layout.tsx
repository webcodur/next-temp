'use client';

import { ReactNode } from 'react';
import { useAtom } from 'jotai';
import { sidebarCollapsedAtom } from '@/store/sidebar';
import { Sidebar } from './sidebar/sidebar';
import { Header } from './header/header';

interface MainLayoutProps {
	children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);

	return (
		<div className="flex h-screen bg-background">
			<Sidebar />
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
