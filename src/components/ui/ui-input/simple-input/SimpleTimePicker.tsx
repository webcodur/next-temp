'use client';

import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import { ValidationRule, getValidationResult } from './types';

interface SimpleTimePickerProps {
	label?: string;
	value?: Date | null;
	onChange?: (time: Date | null) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	timeIntervals?: number;
	minTime?: Date;
	maxTime?: Date;
	validationRule?: ValidationRule;
	colorVariant?: 'primary' | 'secondary';
}

export const SimpleTimePicker: React.FC<SimpleTimePickerProps> = ({
	label,
	value,
	onChange,
	placeholder = '시간을 선택하세요',
	disabled = false,
	className = '',
	timeIntervals = 15,
	minTime,
	maxTime,
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

	// validation 결과 계산 (시간을 문자열로 변환하여 검증)
	const stringValue = value ? value.toTimeString().split(' ')[0] : '';
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
				onClick={handleContainerClick}
				className={`relative flex items-center h-11 px-3 border rounded-lg transition-all duration-200 bg-serial-3 ${
					isFocused
						? `shadow-inner neu-inset ${colorVariant === 'secondary' ? 'border-secondary/30' : 'border-primary/30'}`
						: 'shadow-md neu-flat border-border hover:shadow-lg'
				} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text'}`}>
				
				{/* 왼쪽 시계 아이콘 */}
				<Clock className="flex-shrink-0 mr-3 w-4 h-4 text-muted-foreground" />

				{/* 중앙 TimePicker */}
				<div className="flex-1">
					<DatePicker
						selected={value}
						onChange={onChange}
						showTimeSelect
						showTimeSelectOnly
						timeIntervals={timeIntervals}
						timeFormat="HH:mm"
						placeholderText={placeholder}
						locale={ko}
						minTime={minTime}
						maxTime={maxTime}
						disabled={disabled}
						onFocus={handleFocus}
						onBlur={handleBlur}
						onKeyDown={handleKeyDown}
						className="w-full text-sm font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground placeholder:select-none text-foreground"
						wrapperClassName="w-full"
					/>
				</div>

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
		</div>
	);
}; 