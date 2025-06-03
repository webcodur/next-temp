'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { useAtom } from 'jotai';
import { sidebarCollapsedAtom } from '@/store/sidebar';
import { Breadcrumb } from '@/components/layout/header/Breadcrumb';
import { ThemeToggle } from '@/components/unit/theme-toggle';

export function Header() {
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);

	// #region 사이드바 상태에 따른 브레드크럼브 위치 조정
	const breadcrumbMargin = isCollapsed ? 'ml-[50px]' : 'ml-0';
	// #endregion

	return (
		<header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
			{/* #region Left Section */}
			<div
				className={`flex items-center gap-4 transition-all duration-300 ${breadcrumbMargin}`}>
				<button className="lg:hidden p-2 hover:bg-accent rounded-lg">
					<Menu className="w-5 h-5" />
				</button>
				<Breadcrumb />
			</div>
			{/* #endregion */}

			{/* #region Right Section */}
			<div className="flex items-center gap-4">
				{/* Search */}
				<div className="relative hidden md:block">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<input
						type="text"
						placeholder="검색..."
						className="pl-10 pr-4 py-2 w-64 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					/>
				</div>

				{/* Theme Toggle */}
				<ThemeToggle />

				{/* Notifications */}
				<button className="relative p-2 hover:bg-accent rounded-lg">
					<Bell className="w-5 h-5 text-muted-foreground" />
					<span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
				</button>

				{/* Profile */}
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
						<span className="text-primary-foreground text-sm font-medium">
							U
						</span>
					</div>
				</div>
			</div>
			{/* #endregion */}
		</header>
	);
}
