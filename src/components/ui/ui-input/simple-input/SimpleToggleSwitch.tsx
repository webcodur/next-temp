'use client';

import React from 'react';
import { useLocale } from '@/hooks/useI18n';

interface SimpleToggleSwitchProps {
	label?: string;
	checked?: boolean;
	onChange?: (checked: boolean) => void;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	disabled?: boolean;
	className?: string;
}

export const SimpleToggleSwitch: React.FC<SimpleToggleSwitchProps> = ({
	label,
	checked = false,
	onChange,
	size = 'xl',
	disabled = false,
	className = '',
}) => {
	const { isRTL } = useLocale();

	const handleChange = () => {
		if (disabled) return;
		onChange?.(!checked);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			handleChange();
		}
	};

	const sizeStyles = {
		sm: {
			track: 'w-8 h-5',
			thumb: 'w-4 h-4',
			translate: checked 
				? (isRTL ? '-translate-x-4' : 'translate-x-4') 
				: (isRTL ? '-translate-x-0.5' : 'translate-x-0.5'),
		},
		md: {
			track: 'w-10 h-6',
			thumb: 'w-5 h-5',
			translate: checked 
				? (isRTL ? '-translate-x-5' : 'translate-x-5') 
				: (isRTL ? '-translate-x-0.5' : 'translate-x-0.5'),
		},
		lg: {
			track: 'w-12 h-7',
			thumb: 'w-6 h-6',
			translate: checked 
				? (isRTL ? '-translate-x-6' : 'translate-x-6') 
				: (isRTL ? '-translate-x-0.5' : 'translate-x-0.5'),
		},
		xl: {
			track: 'w-16 h-9',
			thumb: 'w-8 h-8',
			translate: checked 
				? (isRTL ? '-translate-x-8' : 'translate-x-8') 
				: (isRTL ? '-translate-x-0.5' : 'translate-x-0.5'),
		},
	};

	const currentSize = sizeStyles[size];

	return (
		<div className={`flex w-full items-center justify-between ${className}`}>
			{label && (
				<label className="text-sm font-medium leading-6 text-foreground">
					{label}
				</label>
			)}
			<div
				className={`flex items-center ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
				onClick={handleChange}
				onKeyDown={handleKeyDown}
				tabIndex={disabled ? -1 : 0}
				role="switch"
				aria-checked={checked}>
				<div className="relative">
					<input
						type="checkbox"
						checked={checked}
						onChange={handleChange}
						disabled={disabled}
						className="sr-only"
					/>
					<div
						className={`${currentSize.track} relative rounded-full transition-all duration-200 border focus-within:neu-inset ${
							checked
								? 'neu-inset bg-primary-1 border-primary-3 shadow-inner'
								: 'neu-flat bg-muted border-border shadow-xs hover:shadow-md'
						}`}>
						<div
							className={`${currentSize.thumb} absolute top-1/2 -translate-y-1/2 neu-raised bg-background border rounded-full shadow-lg transition-transform duration-200 ${currentSize.translate} ${
								checked ? 'border-primary-6 bg-primary-6 text-white shadow-primary/20' : 'border-border'
							}`}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}; 