'use client';

import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { Calendar, CheckCircle, AlertCircle, X } from 'lucide-react';
import { ValidationRule, getValidationResult } from './types';

interface SimpleDateRangePickerProps {
	label?: string;
	startDate?: Date | null;
	endDate?: Date | null;
	onChange?: (dates: [Date | null, Date | null]) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	dateFormat?: string;
	minDate?: Date;
	maxDate?: Date;
	validationRule?: ValidationRule;
	colorVariant?: 'primary' | 'secondary';
}

// #region 커스텀 헤더 구성 함수
interface CustomHeaderProps {
	date: Date;
	changeYear: (year: number) => void;
	changeMonth: (month: number) => void;
	decreaseMonth: () => void;
	increaseMonth: () => void;
	prevMonthButtonDisabled: boolean;
	nextMonthButtonDisabled: boolean;
}

const renderCustomHeader = ({
	date,
	changeYear,
	changeMonth,
	decreaseMonth,
	increaseMonth,
	prevMonthButtonDisabled,
	nextMonthButtonDisabled,
}: CustomHeaderProps) => {
	const years = Array.from(
		{ length: 30 },
		(_, i) => new Date().getFullYear() - 15 + i
	);
	const months = [
		"1월", "2월", "3월", "4월", "5월", "6월",
		"7월", "8월", "9월", "10월", "11월", "12월"
	];

	return (
		<div
			style={{
				margin: 10,
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				gap: "8px",
			}}
		>
			<button 
				onClick={decreaseMonth} 
				disabled={prevMonthButtonDisabled}
				style={{
					background: "none",
					border: "1px solid #ccc",
					borderRadius: "4px",
					padding: "4px 8px",
					cursor: prevMonthButtonDisabled ? "not-allowed" : "pointer",
				}}
			>
				{"<"}
			</button>
			
			<select
				value={date.getFullYear()}
				onChange={({ target: { value } }) => changeYear(parseInt(value))}
				style={{
					padding: "4px 8px",
					border: "1px solid #ccc",
					borderRadius: "4px",
				}}
			>
				{years.map((option) => (
					<option key={option} value={option}>
						{option}년
					</option>
				))}
			</select>

			<select
				value={date.getMonth()}
				onChange={({ target: { value } }) => changeMonth(parseInt(value))}
				style={{
					padding: "4px 8px",
					border: "1px solid #ccc",
					borderRadius: "4px",
				}}
			>
				{months.map((option, index) => (
					<option key={option} value={index}>
						{option}
					</option>
				))}
			</select>

			<button 
				onClick={increaseMonth} 
				disabled={nextMonthButtonDisabled}
				style={{
					background: "none",
					border: "1px solid #ccc",
					borderRadius: "4px",
					padding: "4px 8px",
					cursor: nextMonthButtonDisabled ? "not-allowed" : "pointer",
				}}
			>
				{">"}
			</button>
		</div>
	);
};
// #endregion

export const SimpleDateRangePicker: React.FC<SimpleDateRangePickerProps> = ({
	label,
	startDate,
	endDate,
	onChange,
	placeholder = '날짜 범위를 선택하세요',
	disabled = false,
	className = '',
	dateFormat = 'yyyy-MM-dd',
	minDate,
	maxDate,
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
		onChange?.([null, null]);
		inputRef.current?.focus();
	};

	const handleContainerClick = () => {
		if (disabled) return;
		inputRef.current?.focus();
	};

	// validation 결과 계산 (날짜 범위를 문자열로 변환하여 검증)
	const stringValue = startDate && endDate 
		? `${startDate.toISOString().split('T')[0]} ~ ${endDate.toISOString().split('T')[0]}`
		: '';
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
				
				{/* 왼쪽 캘린더 아이콘 */}
				<Calendar className="flex-shrink-0 mr-3 w-4 h-4 text-muted-foreground" />

				{/* 중앙 DateRangePicker */}
				<div className="flex-1">
					<DatePicker
						selectsRange={true}
						startDate={startDate}
						endDate={endDate}
						onChange={onChange}
						dateFormat={dateFormat}
						placeholderText={placeholder}
						locale={ko}
						minDate={minDate}
						maxDate={maxDate}
						disabled={disabled}
						renderCustomHeader={renderCustomHeader}
						onFocus={handleFocus}
						onBlur={handleBlur}
						onKeyDown={handleKeyDown}
						className="w-full text-sm font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground placeholder:select-none text-foreground"
						wrapperClassName="w-full"
					/>
				</div>

				{/* 우측 X 아이콘 */}
				{(startDate || endDate) && !disabled && (
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