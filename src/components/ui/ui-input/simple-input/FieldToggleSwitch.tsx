'use client';

import React from 'react';
import { useLocale } from '@/hooks/useI18n';

interface FieldToggleSwitchProps {
	label?: string;
	checked?: boolean;
	onChange?: (checked: boolean) => void;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	disabled?: boolean;
	className?: string;
}

export const FieldToggleSwitch: React.FC<FieldToggleSwitchProps> = ({
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
			track: 'w-8 h-4',
			thumb: 'w-3 h-3',
			translate: checked 
				? (isRTL ? '-translate-x-4' : 'translate-x-4') 
				: (isRTL ? '-translate-x-0.5' : 'translate-x-0.5'),
		},
		md: {
			track: 'w-10 h-5',
			thumb: 'w-4 h-4',
			translate: checked 
				? (isRTL ? '-translate-x-5' : 'translate-x-5') 
				: (isRTL ? '-translate-x-0.5' : 'translate-x-0.5'),
		},
		lg: {
			track: 'w-12 h-6',
			thumb: 'w-5 h-5',
			translate: checked 
				? (isRTL ? '-translate-x-6' : 'translate-x-6') 
				: (isRTL ? '-translate-x-0.5' : 'translate-x-0.5'),
		},
		xl: {
			track: 'w-16 h-8',
			thumb: 'w-7 h-7',
			translate: checked 
				? (isRTL ? '-translate-x-8' : 'translate-x-8') 
				: (isRTL ? '-translate-x-0.5' : 'translate-x-0.5'),
		},
	};

	const currentSize = sizeStyles[size];

	return (
		<div className={`relative ${className}`}>
			<div className="flex justify-between items-center h-6">
				{label && (
					<label className="text-sm font-medium leading-6 text-foreground">
						{label}
					</label>
				)}
			</div>

			<div
				className={`flex items-center h-8 ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
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
								? 'neu-inset bg-brand/10 border-brand/30 shadow-inner'
								: 'neu-flat bg-muted border-border shadow-xs hover:shadow-md'
						}`}>
						<div
							className={`${currentSize.thumb} absolute top-1/2 -translate-y-1/2 neu-raised bg-background border border-border rounded-full shadow-lg transition-transform duration-200 ${currentSize.translate} ${
								checked ? 'border-brand/20' : 'border-border'
							}`}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
