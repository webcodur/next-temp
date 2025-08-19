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
	disabled = false,
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
				borderClass = '!border-2' + ' ' + '[border-color:hsl(var(--success))]';
				break;
			case 'error':
				borderClass = '!border-2' + ' ' + '[border-color:hsl(var(--destructive))]';
				break;
			case 'info':
			case 'none':
			default:
				borderClass = 'border' + ' ' + '[border-color:hsl(var(--border))]';
				break;
		}

		return borderClass;
	};

	// 인라인 스타일 생성
	const getInlineStyle = () => {
		const baseStyle: React.CSSProperties = {};
		
		// disabled 상태는 validation보다 우선
		if (disabled) {
			return {
				...baseStyle,
				backgroundColor: 'hsl(var(--muted))', // CSS 변수 활용
				border: '1px solid hsl(var(--border))', // CSS 변수 활용
				borderRadius: 'var(--radius)',
				cursor: 'not-allowed'
			};
		}
		
		switch (validationStatus) {
			case 'success':
				return {
					...baseStyle,
					border: '1px solid hsl(var(--success))', // CSS 변수 활용
					borderRadius: 'var(--radius)'
				};
			case 'error':
				return {
					...baseStyle,
					border: '1px solid hsl(var(--destructive))', // CSS 변수 활용
					borderRadius: 'var(--radius)'
				};
			default:
				return baseStyle;
		}
	};

	return (
		<div
			onClick={onClick}
			style={getInlineStyle()}
			className={`relative flex justify-start ${isTextArea ? '':'items-center p-1 rounded'} ${validationStatus === 'success' || validationStatus === 'error' ? '' : getBorderClass()} ${disabled ? 'cursor-not-allowed' : ''} ${className}`}>
			<div className={`w-full ${disabled ? 'cursor-not-allowed' : ''}`}>
				{children}
			</div>
		</div>
	);
};
