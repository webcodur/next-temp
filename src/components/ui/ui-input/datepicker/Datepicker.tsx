'use client';

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';

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
				className="px-2 py-1 text-sm rounded border neu-inset"
				value={date.getFullYear()}
				onChange={({ target: { value } }) => changeYear(parseInt(value, 10))}>
				{years.map((year) => (
					<option key={year} value={year}>
						{year}년
					</option>
				))}
			</select>

			<select
				className="px-2 py-1 text-sm rounded border neu-inset"
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

// #region DateRangePicker 컴포넌트
export type DateRangePickerProps = {
	startDate: Date | null;
	endDate: Date | null;
	onStartDateChange: (date: Date | null) => void;
	onEndDateChange: (date: Date | null) => void;
	className?: string;
	yearDropdownItemNumber?: number;
	scrollableYearDropdown?: boolean;
	showMonthYearPicker?: boolean;
};

export function DateRangePicker({
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
	className = '',
	yearDropdownItemNumber = 15,
	scrollableYearDropdown = true,
	showMonthYearPicker = false,
}: DateRangePickerProps) {
	// Date Picker 콜백 핸들러
	const handleStartDateChange = (date: Date | null) => {
		onStartDateChange(date);
	};

	const handleEndDateChange = (date: Date | null) => {
		onEndDateChange(date);
	};

	return (
		<div
			className={`flex items-center space-x-2 ${className}`}
			style={{ width: 'fit-content' }}>
			<div style={{ width: '144px', minWidth: '144px', maxWidth: '144px' }}>
				<DatePicker
					selected={startDate ?? undefined}
					onChange={handleStartDateChange}
					selectsStart
					startDate={startDate ?? undefined}
					endDate={endDate ?? undefined}
					dateFormat="yyyy-MM-dd"
					placeholderText="시작 날짜"
					locale={ko}
					yearDropdownItemNumber={yearDropdownItemNumber}
					scrollableYearDropdown={scrollableYearDropdown}
					showMonthYearPicker={showMonthYearPicker}
					renderCustomHeader={renderCustomYearMonthHeader}
					className="box-border px-2 py-1 w-36 rounded border-primary neu-inset focus:outline-hidden focus:ring-0"
				/>
			</div>
			<span className="text-sm shrink-0">~</span>
			<div style={{ width: '144px', minWidth: '144px', maxWidth: '144px' }}>
				<DatePicker
					selected={endDate ?? undefined}
					onChange={handleEndDateChange}
					selectsEnd
					startDate={startDate ?? undefined}
					endDate={endDate ?? undefined}
					minDate={startDate ?? undefined}
					dateFormat="yyyy-MM-dd"
					placeholderText="마지막 날짜"
					locale={ko}
					yearDropdownItemNumber={yearDropdownItemNumber}
					scrollableYearDropdown={scrollableYearDropdown}
					showMonthYearPicker={showMonthYearPicker}
					renderCustomHeader={renderCustomYearMonthHeader}
					className="box-border px-2 py-1 w-36 rounded border-primary neu-inset focus:outline-hidden focus:ring-0"
				/>
			</div>
		</div>
	);
}
// #endregion

// #region 단일 DatePicker 컴포넌트
export type SingleDatePickerProps = {
	selected: Date | null;
	onChange: (date: Date | null) => void;
	dateFormat?: string;
	placeholderText?: string;
	minDate?: Date | null;
	maxDate?: Date | null;
	className?: string;
	showTimeSelect?: boolean;
	timeFormat?: string;
	timeIntervals?: number;
	yearDropdownItemNumber?: number;
	scrollableYearDropdown?: boolean;
	showMonthYearPicker?: boolean;
};

export function SingleDatePicker({
	selected,
	onChange,
	dateFormat = 'yyyy-MM-dd',
	placeholderText = '날짜 선택',
	minDate,
	maxDate,
	className = '',
	showTimeSelect = false,
	timeFormat = 'HH:mm',
	timeIntervals = 30,
	yearDropdownItemNumber = 15,
	scrollableYearDropdown = true,
	showMonthYearPicker = false,
}: SingleDatePickerProps) {
	// Date Picker 콜백 핸들러
	const handleDateChange = (date: Date | null) => {
		onChange(date);
	};

	// 입력 포맷 결정: 기본 날짜 포맷인 "yyyy-MM-dd"만 사용하는 경우에만 시간 포함
	const inputDateFormat =
		showTimeSelect && dateFormat === 'yyyy-MM-dd'
			? `${dateFormat} ${timeFormat}`
			: dateFormat;

	return (
		<div style={{ width: 'fit-content', minWidth: 'fit-content' }}>
			<DatePicker
				selected={selected ?? undefined}
				onChange={handleDateChange}
				dateFormat={inputDateFormat}
				placeholderText={placeholderText}
				minDate={minDate ?? undefined}
				maxDate={maxDate ?? undefined}
				locale={ko}
				showTimeSelect={showTimeSelect}
				timeFormat={timeFormat}
				timeIntervals={timeIntervals}
				yearDropdownItemNumber={yearDropdownItemNumber}
				scrollableYearDropdown={scrollableYearDropdown}
				showMonthYearPicker={showMonthYearPicker}
				renderCustomHeader={renderCustomYearMonthHeader}
				className={`box-border px-2 py-1 rounded border-primary neu-inset focus:outline-hidden focus:ring-0 ${className}`}
			/>
		</div>
	);
}
// #endregion

// #region 시간 전용 선택기 컴포넌트
export type TimeOnlyPickerProps = {
	selected: Date | null;
	onChange: (time: Date | null) => void;
	timeFormat?: string;
	timeIntervals?: number;
	placeholderText?: string;
	className?: string;
	minTime?: Date;
	maxTime?: Date;
};

export function TimeOnlyPicker({
	selected,
	onChange,
	timeFormat = 'HH:mm',
	timeIntervals = 1,
	placeholderText = '시간 선택',
	className = '',
	minTime,
	maxTime,
}: TimeOnlyPickerProps) {
	const handleTimeChange = (time: Date | null) => {
		onChange(time);
	};

	return (
		<div style={{ width: 'fit-content', minWidth: 'fit-content' }}>
			<DatePicker
				selected={selected ?? undefined}
				onChange={handleTimeChange}
				showTimeSelect
				showTimeSelectOnly
				timeIntervals={timeIntervals}
				timeFormat={timeFormat}
				dateFormat={timeFormat}
				placeholderText={placeholderText}
				minTime={minTime}
				maxTime={maxTime}
				locale={ko}
				className={`box-border px-2 py-1 rounded border-primary neu-inset focus:outline-hidden focus:ring-0 ${className}`}
			/>
		</div>
	);
}
// #endregion
