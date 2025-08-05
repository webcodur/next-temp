'use client';

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { getYear, getMonth } from 'date-fns';

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
		(_, i) => getYear(new Date()) - 15 + i
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
				value={getYear(date)}
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
				value={getMonth(date)}
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

// #region 단일 DatePicker 컴포넌트
export type PickDateProps = {
	selected: Date | null;
	onChange: (date: Date | null) => void;
	dateFormat?: string;
	placeholderText?: string;
	className?: string;
	showTimeSelect?: boolean;
	minDate?: Date | null;
	maxDate?: Date | null;
	disabled?: boolean;
	colorVariant?: 'primary' | 'secondary';
};

export function PickDate({
	selected,
	onChange,
	dateFormat = 'yyyy-MM-dd',
	placeholderText = '날짜 선택',
	className = '',
	showTimeSelect = false,
	minDate,
	maxDate,
	disabled = false,
	colorVariant = 'primary',
}: PickDateProps) {
	const colorVariantClass = colorVariant === 'primary' 
		? 'datepicker-primary' 
		: 'datepicker-secondary';

	return (
		<div className={`${colorVariantClass} ${className}`}>
			<DatePicker
				selected={selected ?? undefined}
				onChange={onChange}
				dateFormat={dateFormat}
				placeholderText={placeholderText}
				locale={ko}
				showTimeSelect={showTimeSelect}
				className="w-full text-center"
				minDate={minDate ?? undefined}
				maxDate={maxDate ?? undefined}
				disabled={disabled}
				renderCustomHeader={renderCustomHeader}
			/>
		</div>
	);
}
// #endregion

// #region 날짜 범위 선택 컴포넌트
export type PickDateRangeProps = {
	startDate: Date | null;
	endDate: Date | null;
	onChange: (dates: [Date | null, Date | null]) => void;
	dateFormat?: string;
	placeholderText?: string;
	className?: string;
	colorVariant?: 'primary' | 'secondary';
};

export function PickDateRange({
	startDate,
	endDate,
	onChange,
	dateFormat = 'yyyy-MM-dd',
	placeholderText = '날짜 범위 선택',
	className = '',
	colorVariant = 'primary',
}: PickDateRangeProps) {
	const colorVariantClass = colorVariant === 'primary' 
		? 'datepicker-primary' 
		: 'datepicker-secondary';

	return (
		<div className={`${colorVariantClass} ${className}`}>
			<DatePicker
				selectsRange={true}
				startDate={startDate ?? undefined}
				endDate={endDate ?? undefined}
				onChange={onChange}
				dateFormat={dateFormat}
				placeholderText={placeholderText}
				locale={ko}
				className="w-full text-center"
				renderCustomHeader={renderCustomHeader}
			/>
		</div>
	);
}
// #endregion

// #region 시간 전용 선택기 컴포넌트
export type PickTimeProps = {
	selected: Date | null;
	onChange: (time: Date | null) => void;
	placeholderText?: string;
	className?: string;
	timeIntervals?: number;
	minTime?: Date;
	maxTime?: Date;
	colorVariant?: 'primary' | 'secondary';
};

export function PickTime({
	selected,
	onChange,
	placeholderText = '시간 선택',
	className = '',
	timeIntervals = 15,
	minTime,
	maxTime,
	colorVariant = 'primary',
}: PickTimeProps) {
	const colorVariantClass = colorVariant === 'primary' 
		? 'datepicker-primary' 
		: 'datepicker-secondary';

	return (
		<div className={`${colorVariantClass} ${className}`}>
			<DatePicker
				selected={selected ?? undefined}
				onChange={onChange}
				showTimeSelect
				showTimeSelectOnly
				timeIntervals={timeIntervals}
				timeFormat="HH:mm"
				placeholderText={placeholderText}
				locale={ko}
				className="w-full text-center"
				minTime={minTime}
				maxTime={maxTime}
			/>
		</div>
	);
}
// #endregion

// #region 월 선택기 컴포넌트
export type PickMonthProps = {
	selected: Date | null;
	onChange: (date: Date | null) => void;
	dateFormat?: string;
	placeholderText?: string;
	className?: string;
	minDate?: Date | null;
	maxDate?: Date | null;
	disabled?: boolean;
	colorVariant?: 'primary' | 'secondary';
};

export function PickMonth({
	selected,
	onChange,
	dateFormat = 'yyyy-MM',
	placeholderText = '년월 선택',
	className = '',
	minDate,
	maxDate,
	disabled = false,
	colorVariant = 'primary',
}: PickMonthProps) {
	const colorVariantClass = colorVariant === 'primary' 
		? 'datepicker-primary' 
		: 'datepicker-secondary';

	return (
		<div className={`${colorVariantClass} ${className}`}>
			<DatePicker
				selected={selected ?? undefined}
				onChange={onChange}
				dateFormat={dateFormat}
				placeholderText={placeholderText}
				locale={ko}
				className="w-full text-center"
				minDate={minDate ?? undefined}
				maxDate={maxDate ?? undefined}
				disabled={disabled}
				showMonthYearPicker
			/>
		</div>
	);
}
// #endregion

// #region 시간 전용 선택기 컴포넌트2
import TimeRangeSelector, { TimeInput, TimeRangeInput, TimeInfo } from './TimeRangeSelector';

export type PickTimeRange2Props = {
	initialStartHour?: number;
	initialStartMinute?: number;
	initialEndHour?: number;
	initialEndMinute?: number;
	onChange?: (startHour: number, startMinute: number, endHour: number, endMinute: number) => void;
	className?: string;
};

export function PickTimeRange2({
	initialStartHour = 9,
	initialStartMinute = 30,
	initialEndHour = 21,
	initialEndMinute = 0,
	onChange,
	className = ''
}: PickTimeRange2Props) {
	return (
		<TimeRangeSelector
			initialStartHour={initialStartHour}
			initialStartMinute={initialStartMinute}
			initialEndHour={initialEndHour}
			initialEndMinute={initialEndMinute}
			onChange={onChange}
			className={className}
		/>
	);
}

// 개별 모듈도 export (필요시 사용 가능)
export { TimeInput as PickTimeSingle2, TimeRangeInput as PickTimeRange2Input, TimeInfo as PickTimeInfo2 };

// #endregion
