'use client';

import React from 'react';

interface InputContainerProps {
	children: React.ReactNode;
	isFocused?: boolean;
	disabled?: boolean;
	colorVariant?: 'primary' | 'secondary';
	onClick?: () => void;
	className?: string;
	isTextArea?: boolean;
}

export const InputContainer: React.FC<InputContainerProps> = ({
	children,
	// isFocused = false,
	// disabled = false,
	// colorVariant = 'primary',
	onClick,
	className = '',
	isTextArea = false,
}) => {
	return (
		<div
			onClick={onClick}
			className={`relative flex ${isTextArea ? '':'items-center p-1 rounded border'} border-border ${className}`}>
			{children}
		</div>
	);
};
