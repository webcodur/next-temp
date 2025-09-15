'use client';

import React, { useState, useRef } from 'react';
import { ValidationRule, validateField } from '@/utils/validation';
import { InputContainer } from './shared/InputContainer';

interface SimpleTextAreaProps {
	label?: string;
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	rows?: number;
	maxLength?: number;
	resize?: 'none' | 'vertical' | 'horizontal' | 'both';
	validationRule?: ValidationRule;
	colorVariant?: 'primary' | 'secondary';
	showCharCount?: boolean;
	showIcon?: boolean;
}

export const SimpleTextArea: React.FC<SimpleTextAreaProps> = ({
	label,
	value = '',
	onChange,
	placeholder = '텍스트를 입력하세요',
	disabled = false,
	className = '',
	rows = 4,
	maxLength,
	resize = 'vertical',
	validationRule,
	colorVariant = 'primary',
	showCharCount = false,
	showIcon = true,
}) => {
	const [isFocused, setIsFocused] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleFocus = () => {
		if (disabled) return;
		setIsFocused(true);
	};

	const handleBlur = () => {
		setIsFocused(false);
	};

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (disabled) return;
		let newValue = e.target.value;
		
		// maxLength 처리
		if (maxLength && newValue.length > maxLength) {
			newValue = newValue.slice(0, maxLength);
		}
		
		onChange?.(newValue);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (disabled) return;

		if (e.key === 'Escape') {
			textareaRef.current?.blur();
		}
	};

	const handleContainerClick = () => {
		if (disabled) return;
		textareaRef.current?.focus();
	};

	// validation 결과 계산
	const validationResult = validationRule ? validateField(value, validationRule) : null;
	
	// 피드백 타입 결정
	const getFeedbackType = () => {
		if (!validationRule || !validationResult) return 'info';
		if (validationRule.mode === 'edit' && !disabled && validationResult.hasValue) {
			return validationResult.isValid ? 'success' : 'error';
		}
		return 'info';
	};

	// resize 클래스 매핑
	const resizeClass = {
		none: 'resize-none',
		vertical: 'resize-y',
		horizontal: 'resize-x',
		both: 'resize',
	};

	return (
		<div className={`relative ${className}`}>
			<div className="flex justify-between items-center">
				{label && (
					<label className="text-sm font-medium leading-6 text-foreground">
						{label}
					</label>
				)}
				{showCharCount && maxLength && (
					<span className={`text-xs ${
						value.length > maxLength * 0.9 
							? 'text-red-500' 
							: 'text-muted-foreground'
					}`}>
						{value.length}/{maxLength}
					</span>
				)}
			</div>

			{/* Validation 피드백은 GridForm.Rules에서 처리됨 - 별도 표시 제거 */}

			<InputContainer
				isFocused={isFocused}
				disabled={disabled}
				colorVariant={colorVariant}
				validationStatus={getFeedbackType()}
				onClick={handleContainerClick}
				isTextArea={true}
				iconType="textarea"
				showIcon={showIcon}>

				{/* 텍스트 영역 */}
				<textarea
					ref={textareaRef}
					value={value}
					onChange={handleChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					disabled={disabled}
					rows={rows}
					maxLength={maxLength}
					className={`w-full ${showIcon ? 'ps-3 xl:ps-10' : 'ps-3'} pe-3 py-3 text-sm font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground placeholder:select-none text-foreground text-start ${resizeClass[resize]} min-h-[2.5rem] ${disabled ? 'cursor-not-allowed' : ''}`}
				/>
			</InputContainer>
		</div>
	);
};