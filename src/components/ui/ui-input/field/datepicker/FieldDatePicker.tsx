'use client';

import React from 'react';
import { Calendar, X, Clock } from 'lucide-react';
import { FIELD_STYLES } from '../core/config';
import { useLocale } from '@/hooks/useI18n';
import { FieldDatePickerComponentProps } from '../core/types';
import { 
	SingleDatePicker, 
	TimeOnlyPicker 
} from '../../datepicker/Datepicker';

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

	// 공통 스타일 클래스
	const getDatePickerClassName = () => {
		return `
			${FIELD_STYLES.container}
			${FIELD_STYLES.height}
			${FIELD_STYLES.text}
			${isRTL ? 'pe-12 ps-12' : 'pl-12 pr-12'}
			${disabled ? FIELD_STYLES.disabled : ''}
			w-full bg-transparent border-0 focus:outline-none focus:ring-0
		`;
	};

	return (
		<div className={`${FIELD_STYLES.fieldWrapper} ${className}`}>
			{label && (
				<label htmlFor={id} className={FIELD_STYLES.label}>
					{label}
				</label>
			)}

			{/* 범위 선택기 - 두 개의 SingleDatePicker 사용 */}
			{datePickerType === 'range' && (
				<div className="space-y-2">
					<div className="flex items-center space-x-2">
						<div className="relative flex-1">
							{getIcon()}
							<SingleDatePicker
								selected={startDate ?? null}
								onChange={onStartDateChange || (() => {})}
								placeholderText="시작 날짜"
								maxDate={endDate ?? null}
								minDate={minDate ?? null}
								dateFormat={dateFormat}
								className={getDatePickerClassName()}
							/>
						</div>
						<span>~</span>
						<div className="relative flex-1">
							<Calendar className={`${FIELD_STYLES.startIcon} neu-icon-active z-10`} />
							<SingleDatePicker
								selected={endDate ?? null}
								onChange={onEndDateChange || (() => {})}
								placeholderText="마지막 날짜"
								minDate={startDate ?? null}
								maxDate={maxDate ?? null}
								dateFormat={dateFormat}
								className={getDatePickerClassName()}
							/>
						</div>
					</div>
					{hasValue && (
						<button
							type="button"
							onClick={handleClear}
							className={`${FIELD_STYLES.clearButton} ml-auto`}
						>
							<X className="w-3 h-3" />
						</button>
					)}
				</div>
			)}

			{/* 시간 전용 선택기 */}
			{datePickerType === 'time' && (
				<div className="relative">
					{getIcon()}
					<TimeOnlyPicker
						selected={value ?? null}
						onChange={onChange || (() => {})}
						timeFormat={timeFormat}
						timeIntervals={timeIntervals}
						placeholderText={placeholder}
						className={getDatePickerClassName()}
						minTime={minDate ?? undefined}
						maxTime={maxDate ?? undefined}
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

			{/* 단일 선택기 (single, datetime, month) */}
			{datePickerType !== 'range' && datePickerType !== 'time' && (
				<div className="relative">
					{getIcon()}
					<SingleDatePicker
						selected={value ?? null}
						onChange={onChange || (() => {})}
						dateFormat={getDateFormat()}
						placeholderText={placeholder}
						minDate={minDate ?? null}
						maxDate={maxDate ?? null}
						showTimeSelect={datePickerType === 'datetime' || datePickerType === 'dateTime'}
						timeFormat={timeFormat}
						timeIntervals={timeIntervals}
						showMonthYearPicker={datePickerType === 'month'}
						className={getDatePickerClassName()}
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
