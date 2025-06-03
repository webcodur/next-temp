'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import {
	currentTopMenuAtom,
	currentMidMenuAtom,
	currentBotMenuAtom,
} from '@/store/sidebar';
import { menuData } from '@/data/menuData';
import { siteData } from '@/data/siteData';

export function Breadcrumb() {
	const [currentTopMenu, setCurrentTopMenu] = useAtom(currentTopMenuAtom);
	const [currentMidMenu, setCurrentMidMenu] = useAtom(currentMidMenuAtom);
	const [currentBotMenu, setCurrentBotMenu] = useAtom(currentBotMenuAtom);
	const pathname = usePathname();

	// #region 페이지 경로 변경 시 breadcrumb 업데이트
	useEffect(() => {
		// 실제 페이지 이동이 발생했을 때만 breadcrumb 업데이트
		// pathname을 기반으로 적절한 breadcrumb 설정
		const updateBreadcrumbFromPath = () => {
			// 예시: /dashboard/analytics/reports 같은 경로에서 breadcrumb 추출
			const pathSegments = pathname.split('/').filter(Boolean);

			if (pathSegments.length === 0) {
				// 홈 페이지인 경우 breadcrumb 초기화
				setCurrentTopMenu('');
				setCurrentMidMenu('');
				setCurrentBotMenu('');
				return;
			}

			// 경로에서 메뉴 정보를 찾아서 breadcrumb 업데이트
			// 실제 프로젝트에서는 경로와 메뉴 구조의 매핑이 필요
			// 여기서는 예시로 구현
			for (const [topKey, topItem] of Object.entries(menuData)) {
				for (const [midKey, midItem] of Object.entries(topItem.midItems)) {
					for (const botItem of midItem.botItems) {
						// href와 현재 pathname이 일치하는지 확인
						if (botItem.href === pathname) {
							setCurrentTopMenu(topKey);
							setCurrentMidMenu(midKey);
							setCurrentBotMenu(botItem.label);
							return;
						}
					}
				}
			}
		};

		updateBreadcrumbFromPath();
	}, [pathname, setCurrentTopMenu, setCurrentMidMenu, setCurrentBotMenu]);
	// #endregion

	// #region breadcrumb 아이템 생성
	const breadcrumbItems = [
		// 현장명칭은 항상 첫 번째
		{
			label: siteData.name,
			href: '/',
			isHome: true,
		},
	];

	if (currentTopMenu && menuData[currentTopMenu]) {
		breadcrumbItems.push({
			label: menuData[currentTopMenu].label,
			href: '#',
			isHome: false,
		});

		if (currentMidMenu && menuData[currentTopMenu].midItems[currentMidMenu]) {
			breadcrumbItems.push({
				label: menuData[currentTopMenu].midItems[currentMidMenu].label,
				href: '#',
				isHome: false,
			});

			if (currentBotMenu) {
				breadcrumbItems.push({
					label: currentBotMenu,
					href: '#',
					isHome: false,
				});
			}
		}
	}
	// #endregion

	// breadcrumb 아이템이 없으면 전역 페이지 표시
	if (breadcrumbItems.length === 0) {
		return (
			<div className="flex items-center gap-2">
				<h2 className="text-lg font-semibold text-foreground">홈</h2>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<h2 className="text-lg font-semibold text-foreground">
				{breadcrumbItems[0].label}
			</h2>
			{breadcrumbItems.length > 1 && (
				<>
					<ChevronRight className="w-4 h-4 text-muted-foreground" />
					<div className="flex items-center gap-1 text-sm text-muted-foreground">
						{breadcrumbItems.slice(1).map((item, index) => (
							<div key={index} className="flex items-center gap-1">
								{index > 0 && <span>/</span>}
								<span className="hover:text-foreground transition-colors cursor-pointer">
									{item.label}
								</span>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
}
