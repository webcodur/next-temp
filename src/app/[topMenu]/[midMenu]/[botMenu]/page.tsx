import { notFound } from 'next/navigation';
import {
	findBotMenuByParams,
	generateBotMenuParams,
} from '@/utils/pageGenerator';
import { PageTemplate } from '@/unit/PageTemplate';

interface PageProps {
	params: Promise<{
		topMenu: string;
		midMenu: string;
		botMenu: string;
	}>;
}

export async function generateStaticParams() {
	return generateBotMenuParams();
}

export async function generateMetadata({ params }: PageProps) {
	const { topMenu, midMenu, botMenu } = await params;
	const menuInfo = findBotMenuByParams(topMenu, midMenu, botMenu);

	if (!menuInfo) {
		return {
			title: '페이지를 찾을 수 없습니다',
		};
	}

	return {
		title: `${menuInfo.botLabel} - ${menuInfo.midLabel} - ${menuInfo.topLabel}`,
		description: menuInfo.description,
	};
}

export default async function BotMenuPage({ params }: PageProps) {
	const { topMenu, midMenu, botMenu } = await params;
	const menuInfo = findBotMenuByParams(topMenu, midMenu, botMenu);

	if (!menuInfo) {
		notFound();
	}

	return <PageTemplate menuInfo={menuInfo} />;
}
