'use client';

import { useAtom } from 'jotai';
import { Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';
import { themeAtom, toggleThemeAtom, initThemeAtom } from '@/store/theme';
import { useTranslations } from '@/hooks/useI18n';
import { clsx } from 'clsx';

interface ThemeToggleProps {
	variant?: 'button' | 'icon' | 'minimal';
	showLabel?: boolean;
	className?: string;
}

export function ThemeToggle({ 
	variant = 'button', 
	showLabel = true,
	className = '' 
}: ThemeToggleProps) {
	const t = useTranslations();
	const [theme] = useAtom(themeAtom);
	const [, toggleTheme] = useAtom(toggleThemeAtom);
	const [, initTheme] = useAtom(initThemeAtom);

	// 컴포넌트 마운트 시 테마 초기화
	useEffect(() => {
		initTheme();
	}, [initTheme]);

	const isDark = theme === 'dark';
	const Icon = isDark ? Sun : Moon;
	const label = isDark ? t('테마_라이트모드') : t('테마_다크모드');

	const baseClasses = 'transition-all duration-150 ease-in-out';
	
	// variant별 스타일 (외부 className이 없을 때만 사용)
	const variantClasses = {
		button: `neu-raised px-4 py-2 rounded-lg ${baseClasses} hover:scale-[1.02]`,
		icon: `neu-flat p-2 rounded-lg ${baseClasses} neu-hover`,
		minimal: `${baseClasses} hover:bg-muted/50 p-2 rounded-lg`
	};

	const iconClasses = variant === 'button' 
		? 'neu-icon-active' 
		: isDark ? 'text-warning' : 'text-primary';

	return (
		<button
			onClick={toggleTheme}
			className={clsx(baseClasses, className || variantClasses[variant])}
			title={label}
			aria-label={label}
		>
			<div className="flex items-center gap-2">
				<Icon 
					size={variant === 'button' ? 18 : 20} 
					className={iconClasses}
				/>
				{showLabel && variant === 'button' && (
					<span className="font-multilang text-sm font-medium text-foreground">
						{label}
					</span>
				)}
			</div>
		</button>
	);
} 