'use client';

import Image from 'next/image';

export const Logo = () => {
	return (
		<div className="flex gap-3 items-center">
			<Image src="/icons/testLogo/lg_plus.png" alt="System Logo" width={30} height={30} />
			<div className="flex items-baseline gap-2">
				<h1 className="text-lg font-bold text-foreground">LG U+</h1>
				<p className="text-xs">시니어 레지던스</p>
			</div>
		</div>
	);
}; 