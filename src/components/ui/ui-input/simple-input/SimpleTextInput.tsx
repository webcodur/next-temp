'use client';

import React, { useState, useRef } from 'react';
import { Type, CheckCircle, AlertCircle, X, Binary, Eye, EyeOff } from 'lucide-react';
import { ValidationRule, getValidationResult } from './types';

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
	// 외부에서 주입하는 에러 메시지 (validationRule과 별개로 표시)
	errorMessage?: string;
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
		errorMessage,
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

	// validation 결과 계산
  const validationResult = validationRule ? getValidationResult(value, validationRule) : null;

  // 검증 아이콘 렌더링 (edit 모드이고 값이 있으며 disabled가 아닐 때만)
  const shouldShowIcon = validationRule?.mode === 'edit' && !disabled && validationResult?.hasValue;

  // 실제 표시할 메시지 및 상태 계산 (외부 errorMessage를 상단 가이드 영역에 통합)
  const getFeedbackType = () => {
    if (!validationRule || !validationResult) return 'info';
    if (validationRule.mode === 'edit' && !disabled && validationResult.hasValue) {
      if (errorMessage) return 'error';
      return validationResult.isValid ? 'success' : 'error';
    }
    return 'info';
  };

  const getDisplayMessage = () => {
    if (!validationRule) return undefined;
    // 값이 있고 편집 모드일 때 외부 에러가 있으면 에러 메시지를 우선 표시
    if (shouldShowIcon && errorMessage) {
      return errorMessage;
    }
    return validationResult?.message;
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
            <span>{getDisplayMessage()}</span>
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
				onClick={handleContainerClick}
				className={`relative flex items-center h-11 px-3 border rounded-lg transition-all duration-200 bg-serial-3 ${
					isFocused
						? `shadow-inner neu-inset ${colorVariant === 'secondary' ? 'border-secondary/30' : 'border-primary/30'}`
						: 'shadow-md neu-flat border-border hover:shadow-lg'
				} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text'}`}>
				
				{/* 왼쪽 아이콘 */}
				{type === 'number' ? (
					<Binary className="flex-shrink-0 mr-3 w-4 h-4 text-muted-foreground" />
				) : (
					<Type className="flex-shrink-0 mr-3 w-4 h-4 text-muted-foreground" />
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
					className="flex-1 text-sm font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground placeholder:select-none text-foreground"
				/>

				{/* 비밀번호 보기/숨기기 버튼 */}
				{type === 'password' && !disabled && (
					<button
						type="button"
						onClick={togglePasswordVisibility}
						className="flex-shrink-0 p-1 rounded-full transition-colors duration-200 hover:bg-muted"
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
						className="flex-shrink-0 p-1 rounded-full transition-colors duration-200 hover:bg-muted"
						aria-label="값 지우기">
						<X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
					</button>
				)}
			</div>

      {/* 외부 에러 메시지 표시: validationRule이 없을 때만 하단 표시 */}
      {!validationRule && errorMessage && (
        <div className="mt-2 text-xs text-red-600">
          {errorMessage}
        </div>
      )}
		</div>
	);
}; 