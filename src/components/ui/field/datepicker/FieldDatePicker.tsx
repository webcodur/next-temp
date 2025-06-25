'use client';

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { FieldDatePickerComponentProps } from '../core/types';
import { FIELD_STYLES } from '../core/config';
import { X } from 'lucide-react';

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
				className="px-2 py-1 text-sm rounded neu-flat focus:neu-inset focus:outline-hidden transition-all"
				value={date.getFullYear()}
				onChange={({ target: { value } }) => changeYear(parseInt(value, 10))}>
				{years.map((year) => (
					<option key={year} value={year}>
						{year}년
					</option>
				))}
			</select>

			<select
				className="px-2 py-1 text-sm rounded neu-flat focus:neu-inset focus:outline-hidden transition-all"
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

export const FieldDatePicker: React.FC<FieldDatePickerComponentProps> = ({
	label,
	placeholder,
	datePickerType,
	value,
	onChange,
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
	minDate,
	maxDate,
	dateFormat,
	timeFormat = 'HH:mm',
	timeIntervals = 15,
	disabled = false,
	className = '',
}) => {
	// #region 단일 날짜 선택
	if (datePickerType === 'single') {
		const handleClear = (e: React.MouseEvent) => {
			e.stopPropagation();
			onChange?.(null);
		};

		return (
			<div className={`space-y-1 ${className}`}>
				{label && (
					<label className="block text-sm font-medium text-gray-800 mb-1">
						{label}
					</label>
				)}

				<div className="relative w-full">
					<Calendar
						className="absolute left-3 top-1/2 w-4 h-4 text-gray-800 transform -translate-y-1/2 z-10"
						style={{ color: '#1f2937' }}
					/>
					<DatePicker
						selected={value ?? undefined}
						onChange={(date) => onChange?.(date)}
						dateFormat={dateFormat || 'yyyy-MM-dd'}
						placeholderText={placeholder || '날짜 선택'}
						minDate={minDate ?? undefined}
						maxDate={maxDate ?? undefined}
						locale={ko}
						disabled={disabled}
						renderCustomHeader={renderCustomYearMonthHeader}
						popperClassName="z-9999!"
						wrapperClassName="w-full"
						className={`
							w-full h-8 px-3 py-2 pl-10 text-sm font-medium
							${FIELD_STYLES.container}
							placeholder-gray-700 text-gray-800
							${value ? 'pr-10' : 'pr-3'}
							${disabled ? 'opacity-60 cursor-not-allowed' : ''}
						`}
					/>
					{value && (
						<button
							onClick={handleClear}
							className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-gray-100 border border-gray-300 text-gray-600 transition-all hover:bg-gray-200 hover:border-gray-400 hover:text-gray-800"
							type="button">
							<X className="h-3 w-3" />
						</button>
					)}
				</div>
			</div>
		);
	}
	// #endregion

	// #region 날짜 범위 선택
	if (datePickerType === 'range') {
		const handleStartClear = (e: React.MouseEvent) => {
			e.stopPropagation();
			onStartDateChange?.(null);
		};

		const handleEndClear = (e: React.MouseEvent) => {
			e.stopPropagation();
			onEndDateChange?.(null);
		};

		return (
			<div className={`space-y-1 ${className}`}>
				{label && (
					<label className="block text-sm font-medium text-gray-800 mb-1">
						{label}
					</label>
				)}

				<div className="flex items-center w-full">
					<div className="relative flex-1">
						<Calendar
							className="absolute left-3 top-1/2 w-4 h-4 text-gray-800 transform -translate-y-1/2 z-10"
							style={{ color: '#1f2937' }}
						/>
						<DatePicker
							selected={startDate ?? undefined}
							onChange={(date) => onStartDateChange?.(date)}
							selectsStart
							startDate={startDate ?? undefined}
							endDate={endDate ?? undefined}
							dateFormat={dateFormat || 'yyyy-MM-dd'}
							placeholderText="시작일"
							minDate={minDate ?? undefined}
							maxDate={maxDate ?? undefined}
							locale={ko}
							disabled={disabled}
							renderCustomHeader={renderCustomYearMonthHeader}
							popperClassName="z-9999!"
							wrapperClassName="w-full"
							className={`
								w-full h-8 px-3 py-2 pl-10 text-sm font-medium
								${FIELD_STYLES.container}
								placeholder-gray-700 text-gray-800
								${startDate ? 'pr-10' : 'pr-3'}
								${disabled ? 'opacity-60 cursor-not-allowed' : ''}
							`}
						/>
						{startDate && (
							<button
								onClick={handleStartClear}
								className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-gray-100 border border-gray-300 text-gray-600 transition-all hover:bg-gray-200 hover:border-gray-400 hover:text-gray-800"
								type="button">
								<X className="h-3 w-3" />
							</button>
						)}
					</div>

					<div
						className="flex items-center justify-center text-sm text-gray-500 px-3"
						style={{ width: '40px' }}>
						~
					</div>

					<div className="relative flex-1">
						<Calendar
							className="absolute left-3 top-1/2 w-4 h-4 text-gray-800 transform -translate-y-1/2 z-10"
							style={{ color: '#1f2937' }}
						/>
						<DatePicker
							selected={endDate ?? undefined}
							onChange={(date) => onEndDateChange?.(date)}
							selectsEnd
							startDate={startDate ?? undefined}
							endDate={endDate ?? undefined}
							minDate={startDate ?? undefined}
							dateFormat={dateFormat || 'yyyy-MM-dd'}
							placeholderText="종료일"
							locale={ko}
							disabled={disabled}
							renderCustomHeader={renderCustomYearMonthHeader}
							popperClassName="z-9999!"
							wrapperClassName="w-full"
							className={`
								w-full h-8 px-3 py-2 pl-10 text-sm font-medium
								${FIELD_STYLES.container}
								placeholder-gray-700 text-gray-800
								${endDate ? 'pr-10' : 'pr-3'}
								${disabled ? 'opacity-60 cursor-not-allowed' : ''}
							`}
						/>
						{endDate && (
							<button
								onClick={handleEndClear}
								className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-gray-100 border border-gray-300 text-gray-600 transition-all hover:bg-gray-200 hover:border-gray-400 hover:text-gray-800"
								type="button">
								<X className="h-3 w-3" />
							</button>
						)}
					</div>
				</div>
			</div>
		);
	}
	// #endregion

	// #region 날짜 + 시간 선택
	if (datePickerType === 'datetime') {
		const inputDateFormat = dateFormat || `yyyy-MM-dd ${timeFormat}`;

		const handleClear = (e: React.MouseEvent) => {
			e.stopPropagation();
			onChange?.(null);
		};

		return (
			<div className={`space-y-1 ${className}`}>
				{label && (
					<label className="block text-sm font-medium text-gray-800 mb-1">
						{label}
					</label>
				)}

				<div className="relative w-full">
					<Calendar
						className="absolute left-3 top-1/2 w-4 h-4 text-gray-800 transform -translate-y-1/2 z-10"
						style={{ color: '#1f2937' }}
					/>
					<DatePicker
						selected={value ?? undefined}
						onChange={(date) => onChange?.(date)}
						showTimeSelect
						timeFormat={timeFormat}
						timeIntervals={timeIntervals}
						dateFormat={inputDateFormat}
						placeholderText={placeholder || '날짜 시간 선택'}
						minDate={minDate ?? undefined}
						maxDate={maxDate ?? undefined}
						locale={ko}
						disabled={disabled}
						renderCustomHeader={renderCustomYearMonthHeader}
						popperClassName="z-9999!"
						wrapperClassName="w-full"
						className={`
						w-full h-8 px-3 py-2 pl-10 text-sm font-medium
						${FIELD_STYLES.container}
						placeholder-gray-700 text-gray-800
						${value ? 'pr-10' : 'pr-3'}
						${disabled ? 'opacity-60 cursor-not-allowed' : ''}
					`}
					/>
					{value && (
						<button
							onClick={handleClear}
							className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-gray-100 border border-gray-300 text-gray-600 transition-all hover:bg-gray-200 hover:border-gray-400 hover:text-gray-800"
							type="button">
							<X className="h-3 w-3" />
						</button>
					)}
				</div>
			</div>
		);
	}
	// #endregion

	// #region 월별 선택
	if (datePickerType === 'month') {
		const handleClear = (e: React.MouseEvent) => {
			e.stopPropagation();
			onChange?.(null);
		};

		return (
			<div className={`space-y-1 ${className}`}>
				{label && (
					<label className="block text-sm font-medium text-gray-800 mb-1">
						{label}
					</label>
				)}

				<div className="relative w-full">
					<Calendar
						className="absolute left-3 top-1/2 w-4 h-4 text-gray-800 transform -translate-y-1/2 z-10"
						style={{ color: '#1f2937' }}
					/>
					<DatePicker
						selected={value ?? undefined}
						onChange={(date) => onChange?.(date)}
						showMonthYearPicker
						dateFormat={dateFormat || 'yyyy년 MM월'}
						placeholderText={placeholder || '월 선택'}
						minDate={minDate ?? undefined}
						maxDate={maxDate ?? undefined}
						locale={ko}
						disabled={disabled}
						renderCustomHeader={renderCustomYearMonthHeader}
						popperClassName="z-9999!"
						wrapperClassName="w-full"
						className={`
						w-full h-8 px-3 py-2 pl-10 text-sm font-medium
						${FIELD_STYLES.container}
						placeholder-gray-700 text-gray-800
						${value ? 'pr-10' : 'pr-3'}
						${disabled ? 'opacity-60 cursor-not-allowed' : ''}
					`}
					/>
					{value && (
						<button
							onClick={handleClear}
							className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-gray-100 border border-gray-300 text-gray-600 transition-all hover:bg-gray-200 hover:border-gray-400 hover:text-gray-800"
							type="button">
							<X className="h-3 w-3" />
						</button>
					)}
				</div>
			</div>
		);
	}
	// #endregion

	return null;
};
