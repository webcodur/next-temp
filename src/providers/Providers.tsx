'use client';

import { Provider } from 'jotai';
import { ReactNode } from 'react';

interface ProvidersProps {
	children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	return (
		<div suppressHydrationWarning>
			<Provider>{children}</Provider>
		</div>
	);
}
