'use client';

import { ReactNode } from 'react';
import { useAtom } from 'jotai';
import { sidebarCollapsedAtom } from '@/store/sidebar';
import { Sidebar } from './sidebar/sidebar';
import { Header } from './header/header';
import { defaults } from '@/data/sidebarConfig';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface MainLayoutProps {
	children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
	const [isCollapsed, setIsCollapsed] = useAtom(sidebarCollapsedAtom);

	return (
		<div className="flex h-screen bg-background">
			{/* 세로 스트립 토글 - 사이드바 왼쪽에 배치 */}
			<div
				onClick={() => setIsCollapsed(!isCollapsed)}
				className={`fixed top-0 h-full w-4 z-50 cursor-pointer border-r border-border bg-muted/60 hover:bg-primary/20 group left-0`}
				title={isCollapsed ? '사이드바 열기' : '사이드바 닫기'}>
				<div className="absolute flex items-center justify-center w-full -translate-y-1/2 top-1/2 opacity-70 group-hover:opacity-100">
					{isCollapsed ? (
						<ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:scale-110" />
					) : (
						<ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:scale-110" />
					)}
				</div>
			</div>

			<Sidebar />

			<main
				style={{
					marginLeft: isCollapsed ? '4px' : `${defaults.sidebarWidth + 4}px`,
				}}
				className="flex flex-col flex-1 transition-all duration-300">
				<Header />
				<div className="flex-1 p-6 overflow-auto">{children}</div>
			</main>
		</div>
	);
}
