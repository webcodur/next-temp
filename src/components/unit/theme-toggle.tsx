'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	// 하이드레이션 문제 방지
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<button className="flex items-center justify-center border rounded-lg h-9 w-9 border-border bg-background">
				<Sun className="w-4 h-4" />
			</button>
		);
	}

	return (
		<button
			onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
			className="flex items-center justify-center border rounded-lg h-9 w-9 border-border bg-background hover:bg-accent">
			{theme === 'dark' ? (
				<Sun className="w-4 h-4" />
			) : (
				<Moon className="w-4 h-4" />
			)}
		</button>
	);
}
