'use client';

import { useAtom } from 'jotai';
import { Moon, Sun } from 'lucide-react';
import { themeAtom, toggleThemeAtom } from '@/store/theme';
import { useTranslations } from '@/hooks/useI18n';

interface ThemeToggleProps {
	className?: string;
	showLabel?: boolean;
}

export function ThemeToggle({ 
	className = '',
	showLabel = false
}: ThemeToggleProps) {
	const t = useTranslations();
	const [theme] = useAtom(themeAtom);
	const [, toggleTheme] = useAtom(toggleThemeAtom);

	const isDark = theme === 'dark';
	const Icon = isDark ? Sun : Moon;
	const label = isDark ? t('테마_라이트모드') : t('테마_다크모드');

	return (
		<button
			onClick={toggleTheme}
			className={`p-2 rounded-lg transition-all neu-flat neu-hover ${className}`}
			title={label}
			aria-label={label}
		>
			<div className="flex items-center gap-2">
				<Icon size={20} className="text-primary" />
				{showLabel && (
					<span className="font-multilang text-sm font-medium text-foreground">
						{label}
					</span>
				)}
			</div>
		</button>
	);
} 