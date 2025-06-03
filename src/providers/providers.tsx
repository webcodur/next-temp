'use client';

import { Provider } from 'jotai';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

interface ProvidersProps {
	children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	return (
		<div suppressHydrationWarning>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				<Provider>{children}</Provider>
			</ThemeProvider>
		</div>
	);
}
