'use client';

import React from 'react';

interface SimpleToggleButtonProps {
	label?: string;
	pressed?: boolean;
	onChange?: (pressed: boolean) => void;
	variant?: 'default' | 'outline-solid' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	disabled?: boolean;
	className?: string;
	colorVariant?: 'primary' | 'secondary';
}

export const SimpleToggleButton: React.FC<SimpleToggleButtonProps> = ({
	label,
	pressed = false,
	onChange,
	variant = 'default',
	size = 'md',
	disabled = false,
	className = '',
	colorVariant = 'primary',
}) => {
	const handleClick = () => {
		if (disabled) return;
		onChange?.(!pressed);
	};

	const sizeStyles = {
		sm: 'px-3 py-1.5 text-sm h-9',
		md: 'px-4 py-2 text-sm h-11',
		lg: 'px-5 py-2.5 text-base h-12',
	};

	const variantStyles = {
		default: pressed
			? `neu-inset ${colorVariant === 'secondary' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-primary/10 text-primary border-primary/20'} shadow-inner`
			: 'neu-raised bg-background text-foreground shadow-md hover:shadow-lg',
		'outline-solid': pressed
			? `neu-inset ${colorVariant === 'secondary' ? 'bg-secondary/10 text-secondary border-secondary/30' : 'bg-primary/10 text-primary border-primary/30'} shadow-inner`
			: 'neu-flat bg-background text-foreground border border-border shadow-xs hover:shadow-md',
		ghost: pressed
			? `${colorVariant === 'secondary' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`
			: 'bg-transparent text-foreground hover:bg-muted',
	};

	return (
		<div className={`flex w-full items-center justify-between ${className}`}>
			{label && (
				<label className="text-sm font-medium leading-6 text-foreground">
					{label}
				</label>
			)}
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