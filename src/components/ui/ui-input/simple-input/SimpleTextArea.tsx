'use client';

import React, { useState, useRef } from 'react';
import { AlignLeft } from 'lucide-react';
import { ValidationRule } from '@/utils/validation';

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
	colorVariant = 'primary',
	showCharCount = false,
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

			<div
				onClick={handleContainerClick}
				className={`relative flex border rounded-lg transition-all duration-200 bg-serial-3 ${
					isFocused
						? `shadow-inner neu-inset ${colorVariant === 'secondary' ? 'border-secondary/30' : 'border-primary/30'}`
						: 'shadow-md neu-flat border-border hover:shadow-lg'
				} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text'}`}>
				
				{/* 왼쪽 텍스트 아이콘 */}
				<AlignLeft className="flex-shrink-0 mt-3 ml-3 w-4 h-4 text-muted-foreground" />

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
					className={`flex-1 p-3 mr-3 text-sm font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground placeholder:select-none text-foreground ${resizeClass[resize]} min-h-[2.5rem]`}
				/>
			</div>
		</div>
	);
};