'use client';

/* 
  파일명: /components/layout/header/Logo.tsx
  기능: 헤더의 로고 컴포넌트
  책임: 시스템 로고와 브랜드명을 표시하는 링크 컴포넌트
*/ // ------------------------------

import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { useAuth } from '@/hooks/auth-hooks/useAuth/useAuth';

// #region 렌더링
export const Logo = memo(() => {
	const { selectedParkingLot } = useAuth();
	
	return (
		<Link href="/" className="flex items-center gap-3.5 cursor-pointer">
			<Image 
				src="/icons/testLogo/logo.svg" 
				alt="System Logo" 
				width={40} 
				height={40}
				style={{ width: 'auto', height: '40px', borderRadius: '10px' }}
			/>
			<div className="flex flex-col gap-[2px] items-baseline ml-4">
				{selectedParkingLot &&(
					<>
						<h1 className="text-xl font-bold text-foreground">{selectedParkingLot.name}</h1>
						<p className="text-sm text-muted-foreground">{selectedParkingLot.description}</p>
					</>
				)}
			</div>
		</Link>
	);
});

Logo.displayName = 'Logo';
// #endregion 