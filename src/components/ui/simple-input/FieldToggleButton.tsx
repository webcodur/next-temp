'use client';

import React from 'react';

interface FieldToggleButtonProps {
	label?: string;
	pressed?: boolean;
	onChange?: (pressed: boolean) => void;
	variant?: 'default' | 'outline-solid' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	disabled?: boolean;
	className?: string;
}

export const FieldToggleButton: React.FC<FieldToggleButtonProps> = ({
	label,
	pressed = false,
	onChange,
	variant = 'default',
	size = 'md',
	disabled = false,
	className = '',
}) => {
	const handleClick = () => {
		if (disabled) return;
		onChange?.(!pressed);
	};

	const sizeStyles = {
		sm: 'px-3 py-1.5 text-sm h-7',
		md: 'px-4 py-2 text-sm h-8',
		lg: 'px-5 py-2.5 text-base h-10',
	};

	const variantStyles = {
		default: pressed
			? 'neu-inset bg-muted text-muted-foreground shadow-inner'
			: 'neu-raised bg-background text-foreground shadow-md hover:shadow-lg',
		'outline-solid': pressed
			? 'neu-inset bg-muted text-muted-foreground border border-border shadow-inner'
			: 'neu-flat bg-background text-foreground border border-border shadow-xs hover:shadow-md',
		ghost: pressed
			? 'bg-muted text-muted-foreground'
			: 'bg-transparent text-foreground hover:bg-muted',
	};

	return (
		<div className={`relative ${className}`}>
			<div className="flex items-center justify-between h-6">
				{label && (
					<label className="text-sm font-medium text-foreground leading-6">
						{label}
					</label>
				)}
			</div>

			<button
				type="button"
				onClick={handleClick}
				disabled={disabled}
				className={`
					inline-flex items-center justify-center font-medium rounded-xl
					transition-all duration-200 focus:outline-hidden focus:neu-inset
					${sizeStyles[size]}
					${variantStyles[variant]}
					${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
				`}>
				{pressed ? 'ON' : 'OFF'}
			</button>
		</div>
	);
};
