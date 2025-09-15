'use client';

/* 
  파일명: /components/layout/header/Logo.tsx
  기능: 헤더의 로고 컴포넌트
  책임: 시스템 로고와 브랜드명을 표시하는 링크 컴포넌트
*/ // ------------------------------

import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { useTranslations } from '@/hooks/ui-hooks/useI18n';

// #region 목업데이터
const mockLogoData = {
	title: '로고_시스템제목',
	subtitle: '로고_시스템부제'
};
// #endregion

// #region 렌더링
export const Logo = memo(() => {
	const t = useTranslations();
	
	return (
		<Link href="/" className="flex items-center gap-3.5 cursor-pointer">
			<Image 
				src="/icons/logo.svg" 
				alt="System Logo" 
				width={40} 
				height={40}
				style={{ width: 'auto', height: '40px', borderRadius: '10px' }}
			/>
			<div className="flex flex-col gap-[2px] items-baseline ml-4">
				<h1 className="text-xl font-black text-[hsl(var(--gray-9))]">{t(mockLogoData.title)}</h1>
				<p className="text-sm font-semibold text-[hsl(var(--gray-8))]">{t(mockLogoData.subtitle)}</p>
			</div>
		</Link>
	);
});

Logo.displayName = 'Logo';
// #endregion 