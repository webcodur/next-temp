/*
  파일명: src/app/[topMenu]/[midMenu]/[botMenu]/page.tsx
  기능: 동적으로 생성된 봇(bot) 메뉴 페이지를 렌더링한다.
  책임: URL 파라미터를 기반으로 적절한 메뉴 정보를 찾아 페이지 메타데이터와 콘텐츠를 제공한다.
*/ // ---

import { notFound } from 'next/navigation';

import { PageTemplate } from '@/components/view/_etc/PageTemplate';
import {
	findBotMenuByParams,
	generateBotMenuParams,
} from '@/utils/pageGenerator';

// #region 타입
interface PageProps {
	params: Promise<{
		topMenu: string;
		midMenu: string;
		botMenu: string;
	}>;
}
// #endregion

// #region Next.js 데이터 함수
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
// #endregion

// #region 렌더링
export default async function BotMenuPage({ params }: PageProps) {
	const { topMenu, midMenu, botMenu } = await params;
	const menuInfo = findBotMenuByParams(topMenu, midMenu, botMenu);

	if (!menuInfo) {
		notFound();
	}

	return <PageTemplate menuInfo={menuInfo} />;
}
// #endregion
