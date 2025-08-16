'use client';

import React, { useState, useRef } from 'react';
import { Type, X, Binary, Eye, EyeOff } from 'lucide-react';
import { ValidationRule } from '@/utils/validation';
import { InputContainer } from './shared/InputContainer';

interface SimpleTextInputProps {
	label?: string;
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	type?: 'text' | 'email' | 'password' | 'number' | 'datetime-local';
	validationRule?: ValidationRule;
	colorVariant?: 'primary' | 'secondary';
	autocomplete?: string;
	// 외부에서 주입하는 에러 메시지 (validationRule과 별개로 표시)
	errorMessage?: string;
	// 왼쪽 아이콘 표시 여부
	showIcon?: boolean;
}

export const SimpleTextInput: React.FC<SimpleTextInputProps> = ({
	label,
	value = '',
	onChange,
	placeholder = '텍스트를 입력하세요',
	disabled = false,
	className = '',
	type = 'text',
	validationRule,
	colorVariant = 'primary',
	autocomplete,
	errorMessage,
	showIcon = true,
}) => {
	const [isFocused, setIsFocused] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
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
		onChange?.(e.target.value);
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

	const togglePasswordVisibility = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (disabled) return;
		setShowPassword(!showPassword);
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



			<InputContainer
				isFocused={isFocused}
				disabled={disabled}
				colorVariant={colorVariant}
				onClick={handleContainerClick}>
				
				{/* 왼쪽 아이콘 */}
				{showIcon && (
					type === 'number' ? (
						<Binary className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 pointer-events-none text-muted-foreground" />
					) : (
						<Type className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 pointer-events-none text-muted-foreground" />
					)
				)}

				{/* 중앙 입력 필드 */}
				<input
					ref={inputRef}
					type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
					value={value}
					onChange={handleChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					disabled={disabled}
					autoComplete={autocomplete}
					className={`w-full ${showIcon ? 'pl-10' : 'pl-3'} pr-10 text-sm font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground placeholder:select-none text-foreground`}
				/>

				{/* 비밀번호 보기/숨기기 버튼 */}
				{type === 'password' && !disabled && (
					<button
						type="button"
						onClick={togglePasswordVisibility}
						className="absolute right-8 top-1/2 p-1 rounded-full transition-colors duration-200 transform -translate-y-1/2 hover:bg-muted"
						aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}>
						{showPassword ? (
							<EyeOff className="w-4 h-4 text-muted-foreground hover:text-foreground" />
						) : (
							<Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
						)}
					</button>
				)}

				{/* 우측 X 아이콘 */}
				{value && !disabled && (
					<button
						type="button"
						onClick={handleClear}
						className="absolute right-3 top-1/2 p-1 rounded-full transition-colors duration-200 transform -translate-y-1/2 hover:bg-muted"
						aria-label="값 지우기">
						<X className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-foreground" />
					</button>
				)}
			</InputContainer>

      {/* 외부 에러 메시지 표시: validationRule이 없을 때만 하단 표시 */}
      {!validationRule && errorMessage && (
        <div className="mt-2 text-xs text-red-600">
          {errorMessage}
        </div>
      )}
		</div>
	);
}; 