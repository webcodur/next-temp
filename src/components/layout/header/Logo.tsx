'use client';

import Link from 'next/link';
import Image from 'next/image';

export const Logo = () => {
	return (
		<Link href="/" className="flex items-center gap-2">
			<Image src="/icons/testLogo/lg.png" alt="System Logo" width={30} height={30} />
			<span className="text-lg font-bold text-foreground">SYSTEM</span>
		</Link>
	);
}; 