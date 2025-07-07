'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { Calendar, X, Clock } from 'lucide-react';
import { FIELD_STYLES } from '../core/config';
import { useLocale } from '@/hooks/useI18n';
import { FieldDatePickerComponentProps } from '../core/types';

// #region 커스텀 헤더 구성 함수
interface CustomHeaderProps {
	date: Date;
	changeYear: (year: number) => void;
	changeMonth: (month: number) => void;
}

const renderCustomYearMonthHeader = ({
	date,
	changeYear,
	changeMonth,
}: CustomHeaderProps) => {
	const years = Array.from(
		{ length: 30 },
		(_, i) => new Date().getFullYear() - 15 + i
	);
	const months = Array.from({ length: 12 }, (_, i) => i);

	return (
		<div className="flex justify-center items-center px-2 py-2 space-x-2">
			<select
				className="px-2 py-1 text-sm rounded border neu-inset bg-background"
				value={date.getFullYear()}
				onChange={({ target: { value } }) => changeYear(parseInt(value, 10))}>
				{years.map((year) => (
					<option key={year} value={year}>
						{year}년
					</option>
				))}
			</select>

			<select
				className="px-2 py-1 text-sm rounded border neu-inset bg-background"
				value={date.getMonth()}
				onChange={({ target: { value } }) => changeMonth(parseInt(value, 10))}>
				{months.map((month) => (
					<option key={month} value={month}>
						{month + 1}월
					</option>
				))}
			</select>
		</div>
	);
};
// #endregion

const FieldDatePicker: React.FC<FieldDatePickerComponentProps & { id: string }> = ({
	id,
	label,
	placeholder = '날짜 선택',
	datePickerType = 'single',
	value,
	onChange,
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
	minDate,
	maxDate,
	dateFormat = 'yyyy-MM-dd',
	timeFormat = 'HH:mm',
	timeIntervals = 30,
	className = '',
	disabled = false,
}) => {
	const [isFocused, setIsFocused] = useState(false);
	const { isRTL } = useLocale();

	// 아이콘 선택
	const getIcon = () => {
		return datePickerType === 'time' ? 
			<Clock className={`${FIELD_STYLES.startIcon} neu-icon-active z-10`} /> :
			<Calendar className={`${FIELD_STYLES.startIcon} neu-icon-active z-10`} />;
	};

	// 날짜 포맷 결정
	const getDateFormat = () => {
		switch (datePickerType) {
			case 'datetime':
			case 'dateTime':
				return `${dateFormat} ${timeFormat}`;
			case 'time':
				return timeFormat;
			case 'month':
				return 'yyyy-MM';
			default:
				return dateFormat;
		}
	};

	// 단일 날짜 처리
	const handleSingleDateChange = (date: Date | null) => {
		onChange?.(date);
	};

	// 범위 시작 날짜 처리
	const handleStartDateChange = (date: Date | null) => {
		onStartDateChange?.(date);
	};

	// 범위 끝 날짜 처리
	const handleEndDateChange = (date: Date | null) => {
		onEndDateChange?.(date);
	};

	// 클리어 버튼 처리
	const handleClear = () => {
		if (datePickerType === 'range') {
			onStartDateChange?.(null);
			onEndDateChange?.(null);
		} else {
			onChange?.(null);
		}
	};

	// 값이 있는지 확인
	const hasValue = datePickerType === 'range' ? 
		(startDate || endDate) : 
		value;

	// 공통 DatePicker 속성
	const commonProps = {
		locale: ko,
		maxDate: maxDate ?? undefined,
		disabled,
		renderCustomHeader: renderCustomYearMonthHeader,
		onFocus: () => setIsFocused(true),
		onBlur: () => setIsFocused(false),
		withPortal: true,
		className: `
			${FIELD_STYLES.container}
			${FIELD_STYLES.height}
			${FIELD_STYLES.text}
			${isRTL ? 'pe-12 ps-12' : 'pl-12 pr-12'}
			${isFocused ? 'ring-2 ring-primary' : ''}
			${disabled ? FIELD_STYLES.disabled : ''}
			w-full bg-transparent border-0 focus:outline-none focus:ring-0
		`,
	};

	return (
		<div className={`relative ${className}`}>
			{label && (
				<label htmlFor={id} className={FIELD_STYLES.label}>
					{label}
				</label>
			)}

			{/* 범위 선택기 */}
			{datePickerType === 'range' && (
				<div className="flex items-center space-x-2">
					<div className="relative">
						{getIcon()}
						<DatePicker
							selected={startDate ?? undefined}
							onChange={handleStartDateChange}
							selectsStart
							startDate={startDate ?? undefined}
							endDate={endDate ?? undefined}
							minDate={minDate ?? undefined}
							dateFormat={dateFormat}
							placeholderText="시작 날짜"
							{...commonProps}
						/>
					</div>
					<span className="text-sm shrink-0">~</span>
					<div className="relative">
						<Calendar className={`${FIELD_STYLES.startIcon} neu-icon-active z-10`} />
						<DatePicker
							selected={endDate ?? undefined}
							onChange={handleEndDateChange}
							selectsEnd
							startDate={startDate ?? undefined}
							endDate={endDate ?? undefined}
							minDate={startDate ?? undefined}
							dateFormat={dateFormat}
							placeholderText="마지막 날짜"
							{...commonProps}
						/>
					</div>
					{hasValue && (
						<button
							type="button"
							onClick={handleClear}
							className={FIELD_STYLES.clearButton}
						>
							<X className="w-3 h-3" />
						</button>
					)}
				</div>
			)}

			{/* 단일 선택기 */}
			{datePickerType !== 'range' && (
				<div className="relative">
					{getIcon()}
					<DatePicker
						selected={value ?? undefined}
						onChange={handleSingleDateChange}
						minDate={minDate ?? undefined}
						dateFormat={getDateFormat()}
						placeholderText={placeholder}
						showTimeSelect={datePickerType === 'datetime' || datePickerType === 'dateTime'}
						showTimeSelectOnly={datePickerType === 'time'}
						timeFormat={timeFormat}
						timeIntervals={timeIntervals}
						showMonthYearPicker={datePickerType === 'month'}
						{...commonProps}
					/>
					{hasValue && (
						<button
							type="button"
							onClick={handleClear}
							className={`${FIELD_STYLES.endIcon} ${FIELD_STYLES.clearButton}`}
						>
							<X className="w-3 h-3" />
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default FieldDatePicker;
