'use client';

import Image from 'next/image';
import Link from 'next/link';

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