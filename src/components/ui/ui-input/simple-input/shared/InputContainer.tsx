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
	validationStatus?: 'success' | 'error' | 'info' | 'none';
}

export const InputContainer: React.FC<InputContainerProps> = ({
	children,
	// isFocused = false,
	// disabled = false,
	// colorVariant = 'primary',
	onClick,
	className = '',
	isTextArea = false,
	validationStatus = 'none',
}) => {
	// validation 상태에 따른 border 색상 클래스 결정


  
	const getBorderClass = () => {
		let borderClass = '';
		switch (validationStatus) {
			case 'success':
				borderClass = '!border-2 !border-blue-500';
				break;
			case 'error':
				borderClass = '!border-2 !border-red-500';
				break;
			case 'info':
			case 'none':
			default:
				borderClass = 'border border-border';
				break;
		}

		return borderClass;
	};

	// 인라인 스타일 생성
	const getInlineStyle = () => {
		const baseStyle: React.CSSProperties = {};
		
		switch (validationStatus) {
			case 'success':
				return {
					...baseStyle,
					border: '1px solid #60a5fa', // blue-400 (더 연한 파란색)
					borderRadius: '0.375rem'
				};
			case 'error':
				return {
					...baseStyle,
					border: '2px solid #ef4444', // red-500  
					borderRadius: '0.375rem'
				};
			default:
				return baseStyle;
		}
	};

	return (
		<div
			onClick={onClick}
			style={getInlineStyle()}
			className={`relative flex justify-start ${isTextArea ? '':'items-center p-1 rounded'} ${validationStatus === 'success' || validationStatus === 'error' ? '' : getBorderClass()} ${className}`}>
			{children}
		</div>
	);
};
