'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Portal 컴포넌트 - 직접 구현
const PortalContainer = ({ children }: { children?: React.ReactNode }) => {
	if (typeof document === 'undefined' || !children) return null;
	
	let portalRoot = document.getElementById('datepicker-portal');
	if (!portalRoot) {
		portalRoot = document.createElement('div');
		portalRoot.id = 'datepicker-portal';
		portalRoot.style.position = 'absolute';
		portalRoot.style.top = '0';
		portalRoot.style.left = '0';
		portalRoot.style.zIndex = '9999';
		document.body.appendChild(portalRoot);
	}

	return createPortal(children, portalRoot);
};

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

const renderCustomYearMonthHeader = ({
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
	const months = Array.from({ length: 12 }, (_, i) => i);

	return (
		<div className="flex justify-center items-center">
			<button
				type="button"
				onClick={decreaseMonth}
				disabled={prevMonthButtonDisabled}
				aria-label="이전 월"
			>
				<ChevronLeft />
			</button>

			<select
				value={date.getFullYear()}
				onChange={({ target: { value } }) => changeYear(parseInt(value, 10))}>
				{years.map((year) => (
					<option key={year} value={year}>
						{year}년
					</option>
				))}
			</select>

			<select
				value={date.getMonth()}
				onChange={({ target: { value } }) => changeMonth(parseInt(value, 10))}>
				{months.map((month) => (
					<option key={month} value={month}>
						{month + 1}월
					</option>
				))}
			</select>

			<button
				type="button"
				onClick={increaseMonth}
				disabled={nextMonthButtonDisabled}
				aria-label="다음 월"
			>
				<ChevronRight />
			</button>
		</div>
	);
};
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
	const handleDateChange = (date: Date | null) => {
		onChange(date);
	};

	const inputDateFormat =
		showTimeSelect && dateFormat === 'yyyy-MM-dd'
			? `${dateFormat} ${timeFormat}`
			: dateFormat;

	return (
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
			renderCustomHeader={showMonthYearPicker || showTimeSelect ? undefined : renderCustomYearMonthHeader}
			className={className}
			popperContainer={PortalContainer}
		/>
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
	timeIntervals = 15,
	placeholderText = '시간 선택',
	className = '',
	minTime,
	maxTime,
}: TimeOnlyPickerProps) {
	const handleTimeChange = (time: Date | null) => {
		onChange(time);
	};

	return (
		<DatePicker
			selected={selected ?? undefined}
			onChange={handleTimeChange}
			showTimeSelect
			showTimeSelectOnly
			timeIntervals={timeIntervals}
			timeFormat={timeFormat}
			placeholderText={placeholderText}
			minTime={minTime}
			maxTime={maxTime}
			locale={ko}
			className={className}
			popperContainer={PortalContainer}
		/>
	);
}
// #endregion
