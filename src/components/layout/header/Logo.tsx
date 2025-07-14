/* 
  파일명: /components/layout/header/Logo.tsx
  기능: 헤더의 로고 컴포넌트
  책임: 시스템 로고와 브랜드명을 표시하는 링크 컴포넌트
*/ // ------------------------------
'use client';

import Image from 'next/image';
import Link from 'next/link';

// #region 렌더링
export const Logo = () => {
	return (
		<Link href="/" className="flex gap-3 items-center cursor-pointer">
			<Image src="/icons/testLogo/lg_plus.png" alt="System Logo" width={30} height={30} />
			<div className="flex gap-2 items-baseline">
				<h1 className="text-lg font-bold text-foreground">LG U+</h1>
				<p className="text-xs">시니어 레지던스</p>
			</div>
		</Link>
	);
};
// #endregion 