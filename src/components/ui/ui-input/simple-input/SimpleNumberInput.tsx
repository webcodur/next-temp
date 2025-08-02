'use client';

import React, { useState, useRef } from 'react';
import { Hash, CheckCircle, AlertCircle, X } from 'lucide-react';
import { ValidationRule, getValidationResult } from './types';

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
	validationRule,
	colorVariant = 'primary',
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

	// validation 결과 계산 (문자열로 변환하여 검증)
	const stringValue = value === '' ? '' : String(value);
	const validationResult = validationRule ? getValidationResult(stringValue, validationRule) : null;
	
	// 검증 아이콘 렌더링 (edit 모드이고 값이 있으며 disabled가 아닐 때만)
	const shouldShowIcon = validationRule?.mode === 'edit' && !disabled && validationResult?.hasValue;
	
	// 피드백 타입 결정
	const getFeedbackType = () => {
		if (!validationRule || !validationResult) return 'info';
		if (validationRule.mode === 'edit' && !disabled && validationResult.hasValue) {
			return validationResult.isValid ? 'success' : 'error';
		}
		return 'info';
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

			{/* Validation Rule 표시 */}
			{validationRule && (
				<div className={`mb-2 text-sm ${getFeedbackType() === 'success' ? 'text-blue-600' : getFeedbackType() === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
					<div className="flex items-center">
						<span>{validationResult?.message}</span>
						{shouldShowIcon && (
							validationResult.isValid ? (
								<CheckCircle className="ml-2 w-4 h-4 text-blue-500" />
							) : (
								<AlertCircle className="ml-2 w-4 h-4 text-red-500" />
							)
						)}
					</div>
				</div>
			)}

			<div
				className={`relative flex items-center h-11 px-3 border rounded-lg transition-all duration-200 bg-serial-3 ${
					isFocused
						? `shadow-inner neu-inset ${colorVariant === 'secondary' ? 'border-secondary/30' : 'border-primary/30'}`
						: 'shadow-md neu-flat border-border hover:shadow-lg'
				} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text'}`}>
				
				{/* 왼쪽 해시 아이콘 */}
				<Hash className="flex-shrink-0 mr-3 w-4 h-4 text-muted-foreground" />

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
					className="flex-1 text-sm font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground placeholder:select-none text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
				/>

				{/* 우측 X 아이콘 */}
				{value !== '' && !disabled && (
					<button
						type="button"
						onClick={handleClear}
						className="flex-shrink-0 p-1 rounded-full transition-colors duration-200 hover:bg-muted"
						aria-label="값 지우기">
						<X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
					</button>
				)}
			</div>
		</div>
	);
};