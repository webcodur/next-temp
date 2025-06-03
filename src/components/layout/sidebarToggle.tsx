'use client';

import { Menu } from 'lucide-react';
import { useAtom } from 'jotai';
import { sidebarCollapsedAtom } from '@/store/sidebar';
import { Button } from '@/components/ui/button';

// #region 사이드바 토글 버튼: 사이드바와 독립적으로 작동하는 토글 버튼
export function SidebarToggle() {
	const [isCollapsed, setIsCollapsed] = useAtom(sidebarCollapsedAtom);

	const toggleSidebar = () => {
		setIsCollapsed(!isCollapsed);
	};

	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={toggleSidebar}
			className="fixed top-3 left-2 z-50 h-7 w-7 p-0 rounded-lg neumorphic-button hover:scale-105 text-muted-foreground hover:text-foreground transition-all duration-200"
			title={isCollapsed ? '사이드바 열기' : '사이드바 닫기'}>
			<Menu className="w-4 h-4" />
		</Button>
	);
}
// #endregion
