'use client';

import React from 'react';
import { Calendar, X, Clock } from 'lucide-react';
import { FIELD_STYLES } from '../core/config';
import { useLocale } from '@/hooks/ui-hooks/useI18n';
import { FieldDatePickerComponentProps } from '../core/types';
import {
	PickDate,
	PickDateRange,
	PickTime,
	PickMonth
} from '@/components/ui/ui-input/datepicker/Datepicker';
import timezone from '@/utils/timezone';

const FieldDatePicker: React.FC<FieldDatePickerComponentProps & { 
	id: string;
	utcMode?: boolean;
}> = ({
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
	utcMode = true,
}) => {
	const { isRTL } = useLocale();

	// UTC 변환 헬퍼 함수들
	const convertToDisplayValue = (utcValue: Date | string | null): Date | null => {
		if (!utcValue || !utcMode) return utcValue as Date | null;
		
		if (typeof utcValue === 'string') {
			try {
				return timezone.utcToLocal(utcValue);
			} catch (error) {
				console.warn('UTC 변환 실패:', error);
				return null;
			}
		}
		return utcValue;
	};

	const convertToUtcValue = (localDate: Date | null): Date | null => {
		if (!localDate) return null;
		if (utcMode) {
			// UTC 문자열로 변환한 후 다시 Date 객체로 변환하여 타입 호환성 유지
			const utcString = timezone.localToUtc(localDate);
			return new Date(utcString);
		}
		return localDate;
	};

	// 변환된 핸들러들
	const handleUtcChange = (date: Date | null) => {
		const utcValue = convertToUtcValue(date);
		onChange?.(utcValue);
	};

	const handleUtcStartDateChange = (date: Date | null) => {
		const utcValue = convertToUtcValue(date);
		onStartDateChange?.(utcValue);
	};

	const handleUtcEndDateChange = (date: Date | null) => {
		const utcValue = convertToUtcValue(date);
		onEndDateChange?.(utcValue);
	};

	// 표시용 값들 변환
	const displayValue = convertToDisplayValue(value ?? null);
	const displayStartDate = convertToDisplayValue(startDate ?? null);
	const displayEndDate = convertToDisplayValue(endDate ?? null);

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

	// 값이 있는지 확인 (변환된 값 기준)
	const hasValue = datePickerType === 'range' ? 
		(displayStartDate || displayEndDate) : 
		displayValue;

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
						startDate={displayStartDate}
						endDate={displayEndDate}
						onChange={(dates) => {
							const [start, end] = dates;
							handleUtcStartDateChange(start);
							handleUtcEndDateChange(end);
							if (onChange) {
								const utcStart = convertToUtcValue(start);
								const utcEnd = convertToUtcValue(end);
								(onChange as unknown as (value: (typeof utcStart | typeof utcEnd)[]) => void)([utcStart, utcEnd]);
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
						selected={displayValue}
						onChange={handleUtcChange}
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
						selected={displayValue}
						onChange={handleUtcChange}
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
						selected={displayValue}
						onChange={handleUtcChange}
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
