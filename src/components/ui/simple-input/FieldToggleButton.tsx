'use client';

import React from 'react';

interface FieldToggleButtonProps {
	label?: string;
	pressed?: boolean;
	onChange?: (pressed: boolean) => void;
	variant?: 'default' | 'outline' | 'ghost';
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
			? 'neu-inset bg-gray-200 text-gray-800 shadow-inner'
			: 'neu-raised bg-gray-50 text-gray-700 shadow-md hover:shadow-lg',
		outline: pressed
			? 'neu-inset bg-gray-100 text-gray-800 border border-gray-300 shadow-inner'
			: 'neu-flat bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow-md',
		ghost: pressed
			? 'bg-gray-200 text-gray-800'
			: 'bg-transparent text-gray-700 hover:bg-gray-100',
	};

	return (
		<div className={`relative ${className}`}>
			<div className="flex items-center justify-between h-6">
				{label && (
					<label className="text-sm font-medium text-gray-700 leading-6">
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
					transition-all duration-200 focus:outline-none focus:ring-0
					${sizeStyles[size]}
					${variantStyles[variant]}
					${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
				`}>
				{pressed ? 'ON' : 'OFF'}
			</button>
		</div>
	);
}; 