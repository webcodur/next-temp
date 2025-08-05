'use client';

import React from 'react';
import { Calendar, X, Clock } from 'lucide-react';
import { FIELD_STYLES } from '../core/config';
import { useLocale } from '@/hooks/useI18n';
import { FieldDatePickerComponentProps } from '../core/types';
import {
	PickDate,
	PickDateRange,
	PickTime,
	PickMonth
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
			<Clock className={`${FIELD_STYLES.startIcon} neu-icon-active`} /> :
			<Calendar className={`${FIELD_STYLES.startIcon} neu-icon-active`} />;
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
			w-full ${FIELD_STYLES.background.inner} border-0 focus:outline-none focus:ring-0
			flex items-center justify-center text-center
		`;
	};

	return (
		<div className={`${FIELD_STYLES.fieldWrapper} ${className}`}>
			{label && (
				<label htmlFor={id} className={FIELD_STYLES.label}>
					{label}
				</label>
			)}

			{/* 범위 선택기 - PickDateRange 사용 */}
			{datePickerType === 'range' && (
				<div className="relative">
					{getIcon()}
					<PickDateRange
						startDate={startDate ?? null}
						endDate={endDate ?? null}
						onChange={(dates) => {
							const [start, end] = dates;
							onStartDateChange?.(start);
							onEndDateChange?.(end);
							if (onChange) {
								(onChange as unknown as (value: (Date | null)[]) => void)([start, end]);
							}
						}}
						dateFormat={dateFormat}
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

			{/* 월 선택기 */}
			{datePickerType === 'month' && (
				<div className="relative">
					{getIcon()}
					<PickMonth
						selected={value as Date | null}
						onChange={(date) => onChange?.(date)}
						dateFormat="yyyy-MM"
						placeholderText={placeholder}
						minDate={minDate ?? null}
						maxDate={maxDate ?? null}
						disabled={disabled}
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

			{/* 단일 선택기 및 날짜시간 선택기 */}
			{(datePickerType === 'single' || datePickerType === 'datetime') && (
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
						disabled={disabled}
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
