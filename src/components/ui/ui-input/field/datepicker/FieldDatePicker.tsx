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
				className="font-multilang px-2 py-1 text-sm rounded neu-flat focus:neu-inset focus:outline-hidden transition-all bg-card text-card-foreground border-border"
				value={date.getFullYear()}
				onChange={({ target: { value } }) => changeYear(parseInt(value, 10))}>
				{years.map((year) => (
					<option key={year} value={year}>
						{year}년
					</option>
				))}
			</select>

			<select
				className="font-multilang px-2 py-1 text-sm rounded neu-flat focus:neu-inset focus:outline-hidden transition-all bg-card text-card-foreground border-border"
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
				{label && <label className={FIELD_STYLES.label}>{label}</label>}

				<div className="relative w-full">
					<Calendar className={`${FIELD_STYLES.leftIcon} neu-icon-inactive z-10`} />
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
							w-full
							${FIELD_STYLES.container}
							${FIELD_STYLES.height}
							${FIELD_STYLES.padding}
							${FIELD_STYLES.text}
							pl-10
							${value ? 'pr-10' : 'pr-3'}
							${disabled ? FIELD_STYLES.disabled : ''}
						`}
					/>
					{value && (
						<button
							onClick={handleClear}
							className={`${FIELD_STYLES.rightIcon} ${FIELD_STYLES.clearButton}`}
							type="button">
							<X className="neu-icon-inactive hover:neu-icon-active w-3 h-3" />
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
				{label && <label className={FIELD_STYLES.label}>{label}</label>}

				<div className="flex items-center w-full">
					<div className="relative flex-1">
						<Calendar className={`${FIELD_STYLES.leftIcon} neu-icon-inactive z-10`} />
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
								w-full
								${FIELD_STYLES.container}
								${FIELD_STYLES.height}
								${FIELD_STYLES.padding}
								${FIELD_STYLES.text}
								pl-10
								${startDate ? 'pr-10' : 'pr-3'}
								${disabled ? FIELD_STYLES.disabled : ''}
							`}
						/>
						{startDate && (
							<button
								onClick={handleStartClear}
								className={`${FIELD_STYLES.rightIcon} ${FIELD_STYLES.clearButton}`}
								type="button">
								<X className="neu-icon-inactive hover:neu-icon-active w-3 h-3" />
							</button>
						)}
					</div>

					<div className="flex items-center justify-center font-multilang text-sm text-muted-foreground px-3" style={{ width: '40px' }}>
						~
					</div>

					<div className="relative flex-1">
						<Calendar className={`${FIELD_STYLES.leftIcon} neu-icon-inactive z-10`} />
						<DatePicker
							selected={endDate ?? undefined}
							onChange={(date) => onEndDateChange?.(date)}
							selectsEnd
							startDate={startDate ?? undefined}
							endDate={endDate ?? undefined}
							minDate={startDate ?? undefined}
							dateFormat={dateFormat || 'yyyy-MM-dd'}
							placeholderText="종료일"
							maxDate={maxDate ?? undefined}
							locale={ko}
							disabled={disabled}
							renderCustomHeader={renderCustomYearMonthHeader}
							popperClassName="z-9999!"
							wrapperClassName="w-full"
							className={`
								w-full
								${FIELD_STYLES.container}
								${FIELD_STYLES.height}
								${FIELD_STYLES.padding}
								${FIELD_STYLES.text}
								pl-10
								${endDate ? 'pr-10' : 'pr-3'}
								${disabled ? FIELD_STYLES.disabled : ''}
							`}
						/>
						{endDate && (
							<button
								onClick={handleEndClear}
								className={`${FIELD_STYLES.rightIcon} ${FIELD_STYLES.clearButton}`}
								type="button">
								<X className="neu-icon-inactive hover:neu-icon-active w-3 h-3" />
							</button>
						)}
					</div>
				</div>
			</div>
		);
	}
	// #endregion

	// #region 날짜와 시간 선택
	if (datePickerType === 'dateTime') {
		const handleClear = (e: React.MouseEvent) => {
			e.stopPropagation();
			onChange?.(null);
		};

		return (
			<div className={`space-y-1 ${className}`}>
				{label && <label className={FIELD_STYLES.label}>{label}</label>}

				<div className="relative w-full">
					<Calendar className={`${FIELD_STYLES.leftIcon} neu-icon-inactive z-10`} />
					<DatePicker
						selected={value ?? undefined}
						onChange={(date) => onChange?.(date)}
						showTimeSelect
						timeFormat={timeFormat}
						timeIntervals={timeIntervals}
						dateFormat={`${dateFormat || 'yyyy-MM-dd'} ${timeFormat}`}
						placeholderText={placeholder || '날짜와 시간 선택'}
						minDate={minDate ?? undefined}
						maxDate={maxDate ?? undefined}
						locale={ko}
						disabled={disabled}
						renderCustomHeader={renderCustomYearMonthHeader}
						popperClassName="z-9999!"
						wrapperClassName="w-full"
						className={`
							w-full
							${FIELD_STYLES.container}
							${FIELD_STYLES.height}
							${FIELD_STYLES.padding}
							${FIELD_STYLES.text}
							pl-10
							${value ? 'pr-10' : 'pr-3'}
							${disabled ? FIELD_STYLES.disabled : ''}
						`}
					/>
					{value && (
						<button
							onClick={handleClear}
							className={`${FIELD_STYLES.rightIcon} ${FIELD_STYLES.clearButton}`}
							type="button">
							<X className="neu-icon-inactive hover:neu-icon-active w-3 h-3" />
						</button>
					)}
				</div>
			</div>
		);
	}
	// #endregion

	// #region 시간만 선택
	if (datePickerType === 'time') {
		const handleClear = (e: React.MouseEvent) => {
			e.stopPropagation();
			onChange?.(null);
		};

		return (
			<div className={`space-y-1 ${className}`}>
				{label && <label className={FIELD_STYLES.label}>{label}</label>}

				<div className="relative w-full">
					<Calendar className={`${FIELD_STYLES.leftIcon} neu-icon-inactive z-10`} />
					<DatePicker
						selected={value ?? undefined}
						onChange={(date) => onChange?.(date)}
						showTimeSelect
						showTimeSelectOnly
						timeIntervals={timeIntervals}
						timeCaption="시간"
						dateFormat={timeFormat}
						placeholderText={placeholder || '시간 선택'}
						locale={ko}
						disabled={disabled}
						popperClassName="z-9999!"
						wrapperClassName="w-full"
						className={`
							w-full
							${FIELD_STYLES.container}
							${FIELD_STYLES.height}
							${FIELD_STYLES.padding}
							${FIELD_STYLES.text}
							pl-10
							${value ? 'pr-10' : 'pr-3'}
							${disabled ? FIELD_STYLES.disabled : ''}
						`}
					/>
					{value && (
						<button
							onClick={handleClear}
							className={`${FIELD_STYLES.rightIcon} ${FIELD_STYLES.clearButton}`}
							type="button">
							<X className="neu-icon-inactive hover:neu-icon-active w-3 h-3" />
						</button>
					)}
				</div>
			</div>
		);
	}
	// #endregion

	return null;
};
