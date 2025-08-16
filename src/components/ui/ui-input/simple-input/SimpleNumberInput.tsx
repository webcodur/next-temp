'use client';

import React, { useState, useRef } from 'react';
import { Hash, X } from 'lucide-react';
import { ValidationRule } from '@/utils/validation';
import { InputContainer } from './shared/InputContainer';

interface SimpleNumberInputProps {
	label?: string;
	value?: number | '';
	onChange?: (value: number | '') => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	min?: number;
	max?: number;
	validationRule?: ValidationRule;
	colorVariant?: 'primary' | 'secondary';
	// 왼쪽 아이콘 표시 여부
	showIcon?: boolean;
}

export const SimpleNumberInput: React.FC<SimpleNumberInputProps> = ({
	label,
	value = '',
	onChange,
	placeholder = '숫자를 입력하세요',
	disabled = false,
	className = '',
	min,
	max,
	colorVariant = 'primary',
	showIcon = true,
}) => {
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFocus = () => {
		if (disabled) return;
		setIsFocused(true);
	};

	const handleBlur = () => {
		setIsFocused(false);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;
		
		const inputValue = e.target.value;
		
		// 빈 값인 경우
		if (inputValue === '') {
			onChange?.('');
			return;
		}
		
		// 숫자로 변환
		const numValue = parseFloat(inputValue);
		
		// 유효한 숫자가 아닌 경우 변경하지 않음
		if (isNaN(numValue)) {
			return;
		}
		
		// min/max 검증
		if (min !== undefined && numValue < min) {
			return;
		}
		if (max !== undefined && numValue > max) {
			return;
		}
		
		onChange?.(numValue);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (disabled) return;

		if (e.key === 'Escape') {
			inputRef.current?.blur();
		}
	};

	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (disabled) return;
		onChange?.('');
		inputRef.current?.focus();
	};

	const handleContainerClick = () => {
		if (disabled) return;
		inputRef.current?.focus();
	};


	return (
		<div className={`relative ${className}`}>
			<div className="flex justify-between items-center">
				{label && (
					<label className="text-sm font-medium leading-6 text-foreground">
						{label}
					</label>
				)}
			</div>

			{/* Validation 피드백은 GridForm.Rules에서 처리됨 - 별도 표시 제거 */}

			<InputContainer
				isFocused={isFocused}
				disabled={disabled}
				colorVariant={colorVariant}
				onClick={handleContainerClick}>
				
				{/* 왼쪽 해시 아이콘 */}
				{showIcon && (
					<Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
				)}

				{/* 중앙 입력 필드 */}
				<input
					ref={inputRef}
					type="number"
					value={value}
					onChange={handleChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					disabled={disabled}
					min={min}
					max={max}
					className={`w-full ${showIcon ? 'pl-10' : 'pl-3'} pr-10 text-sm font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground placeholder:select-none text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
				/>

				{/* 우측 X 아이콘 */}
				{value !== '' && !disabled && (
					<button
						type="button"
						onClick={handleClear}
						className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors duration-200 hover:bg-muted"
						aria-label="값 지우기">
						<X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
					</button>
				)}
			</InputContainer>
		</div>
	);
};