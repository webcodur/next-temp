'use client';

import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { Calendar, CheckCircle, AlertCircle, X } from 'lucide-react';
import { ValidationRule, validateField } from '@/utils/validation';
import { InputContainer } from '../shared/InputContainer';

interface SimpleMonthPickerProps {
	label?: string;
	value?: Date | null;
	onChange?: (date: Date | null) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	dateFormat?: string;
	minDate?: Date | null;
	maxDate?: Date | null;
	validationRule?: ValidationRule;
	colorVariant?: 'primary' | 'secondary';
	// 왼쪽 아이콘 표시 여부
	showIcon?: boolean;
}

export const SimpleMonthPicker: React.FC<SimpleMonthPickerProps> = ({
	label,
	value,
	onChange,
	placeholder = '년월을 선택하세요',
	disabled = false,
	className = '',
	dateFormat = 'yyyy-MM',
	minDate,
	maxDate,
	validationRule,
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

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (disabled) return;

		if (e.key === 'Escape') {
			inputRef.current?.blur();
		}
	};

	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (disabled) return;
		onChange?.(null);
		inputRef.current?.focus();
	};

	const handleContainerClick = () => {
		if (disabled) return;
		inputRef.current?.focus();
	};

	// validation 결과 계산 (월을 문자열로 변환하여 검증)
	const stringValue = value ? value.toISOString().slice(0, 7) : '';
	const validationResult = validationRule ? validateField(stringValue, validationRule) : null;
	
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

			<InputContainer
				isFocused={isFocused}
				disabled={disabled}
				colorVariant={colorVariant}
				onClick={handleContainerClick}>
				
				{/* 왼쪽 캘린더 아이콘 */}
				{showIcon && (
					<Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
				)}

				{/* 중앙 MonthPicker */}
				<DatePicker
					selected={value}
					onChange={onChange}
					dateFormat={dateFormat}
					placeholderText={placeholder}
					locale={ko}
					minDate={minDate || undefined}
					maxDate={maxDate || undefined}
					disabled={disabled}
					showMonthYearPicker
					onFocus={handleFocus}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					className={`w-full ${showIcon ? 'pl-10' : 'pl-3'} pr-10 text-sm font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground placeholder:select-none text-foreground`}
					wrapperClassName="w-full"
				/>

				{/* 우측 X 아이콘 */}
				{value && !disabled && (
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