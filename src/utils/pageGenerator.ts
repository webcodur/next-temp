import { menuData } from '@/data/menuData';

/**
 * bot 메뉴 경로 정보 타입
 */
export interface BotMenuPath {
	topKey: string;
	midKey: string;
	botLabel: string;
	href: string;
	description?: string;
	topLabel: string;
	midLabel: string;
}

/**
 * 모든 bot 메뉴 경로 추출
 */
export function getAllBotMenuPaths(): BotMenuPath[] {
	const paths: BotMenuPath[] = [];

	Object.entries(menuData).forEach(([topKey, topItem]) => {
		Object.entries(topItem.midItems).forEach(([midKey, midItem]) => {
			midItem.botItems.forEach((botItem) => {
				paths.push({
					topKey,
					midKey,
					botLabel: botItem.label,
					href: botItem.href,
					description: botItem.description || '',
					topLabel: topItem.label,
					midLabel: midItem.label,
				});
			});
		});
	});

	return paths;
}

/**
 * href로 bot 메뉴 정보 찾기
 */
export function findBotMenuByHref(href: string): BotMenuPath | null {
	const allPaths = getAllBotMenuPaths();
	const found = allPaths.find((path) => path.href === href);
	return found ?? null;
}

/**
 * 경로 파라미터로 bot 메뉴 정보 찾기
 */
export function findBotMenuByParams(
	topMenu: string,
	midMenu: string,
	botMenu: string
): BotMenuPath | null {
	const href = `/${topMenu}/${midMenu}/${botMenu}`;
	return findBotMenuByHref(href);
}

/**
 * generateStaticParams용 경로 파라미터 생성
 */
export function generateBotMenuParams() {
	const allPaths = getAllBotMenuPaths();

	return allPaths.map((path) => {
		const segments = path.href.split('/').filter(Boolean);
		// 안전한 배열 접근을 위한 기본값 처리
		return {
			topMenu: segments[0] || '',
			midMenu: segments[1] || '',
			botMenu: segments[2] || '',
		};
	});
}
