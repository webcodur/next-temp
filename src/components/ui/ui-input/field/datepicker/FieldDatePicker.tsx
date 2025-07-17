'use client';

import React from 'react';
import { Calendar, X, Clock } from 'lucide-react';
import { FIELD_STYLES } from '../core/config';
import { useLocale } from '@/hooks/useI18n';
import { FieldDatePickerComponentProps } from '../core/types';
import {
	PickDate,
	PickTime
} from '@/components/ui/ui-input/datepicker/Datepicker';

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

			{/* 범위 선택기 - 두 개의 PickDate 사용 */}
			{datePickerType === 'range' && (
				<div className="datepicker-container">
					<div className="datepicker-range">
						<div className="start-date">
							<label>시작 날짜</label>
							<PickDate
								selected={startDate ?? null}
								onChange={(date) => {
									onStartDateChange?.(date);
									if (onChange) {
										(onChange as unknown as (value: (Date | null)[]) => void)([date, endDate ?? null]);
									}
								}}
								placeholderText="시작 날짜 선택"
								maxDate={endDate ?? null}
							/>
						</div>
						<div className="end-date">
							<label>종료 날짜</label>
							<PickDate
								selected={endDate ?? null}
								onChange={(date) => {
									onEndDateChange?.(date);
									if (onChange) {
										(onChange as unknown as (value: (Date | null)[]) => void)([startDate ?? null, date]);
									}
								}}
								placeholderText="종료 날짜 선택"
								minDate={startDate ?? null}
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
					<PickTime
						selected={value as Date | null}
						onChange={(time) => onChange?.(time)}
						placeholderText={placeholder}
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

			{/* 단일 선택기 (single, datetime, month) */}
			{datePickerType !== 'range' && datePickerType !== 'time' && (
				<div className="relative">
					{getIcon()}
					<PickDate
						selected={value as Date | null}
						onChange={(date) => onChange?.(date)}
						dateFormat={datePickerType === 'datetime' ? 'yyyy-MM-dd HH:mm' : dateFormat}
						placeholderText={placeholder}
						showTimeSelect={datePickerType === 'datetime'}
						minDate={minDate ?? null}
						maxDate={maxDate ?? null}
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
