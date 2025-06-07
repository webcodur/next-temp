'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { useAtom } from 'jotai';
import { sidebarCollapsedAtom } from '@/store/sidebar';
import { Breadcrumb } from '@/components/layout/header/Breadcrumb';

export function Header() {
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);

	// 사이드바 상태에 따른 브레드크럼브 위치 조정
	const breadcrumbMargin = isCollapsed ? 'ml-[50px]' : 'ml-0';

	return (
		<header className="flex items-center justify-between h-16 px-6 border-b bg-card border-border">
			{/* Left Section */}
			<div
				className={`flex items-center gap-4 transition-all duration-300 ${breadcrumbMargin}`}>
				<button className="p-2 rounded-lg lg:hidden hover:bg-accent">
					<Menu className="w-5 h-5" />
				</button>
				<Breadcrumb />
			</div>

			{/* Right Section */}
			<div className="flex items-center gap-4"></div>
		</header>
	);
}
