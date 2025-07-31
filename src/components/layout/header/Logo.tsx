'use client';

/* 
  파일명: /components/layout/header/Logo.tsx
  기능: 헤더의 로고 컴포넌트
  책임: 시스템 로고와 브랜드명을 표시하는 링크 컴포넌트
*/ // ------------------------------

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

// #region 렌더링
export const Logo = () => {
	const { selectedParkingLot } = useAuth();
	
	return (
		<Link href="/" className="flex items-center gap-3.5 cursor-pointer">
			<Image src="/icons/testLogo/lg_plus.png" alt="System Logo" width={35} height={35} />
			<div className="flex items-baseline gap-2">
				{selectedParkingLot ? (
					<>
						<h1 className="text-xl font-bold text-foreground">{selectedParkingLot.name}</h1>
						{selectedParkingLot.code && (
							<p className="text-sm text-muted-foreground">({selectedParkingLot.code})</p>
						)}
					</>
				) : (
					<>
						<h1 className="text-xl font-bold text-foreground">LG U+</h1>
						<p className="text-sm text-muted-foreground">시니어 레지던스</p>
					</>
				)}
			</div>
		</Link>
	);
};
// #endregion 