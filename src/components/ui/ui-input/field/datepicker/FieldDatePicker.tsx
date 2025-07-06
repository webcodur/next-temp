'use client';

import React, { useState, useRef } from 'react';
import { Calendar, X } from 'lucide-react';
import { FIELD_STYLES } from '../core/config';
import { useLocale } from '@/hooks/useI18n';

interface FieldDatePickerProps {
	id: string;
	label?: string;
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
	disabled?: boolean;
	showClearButton?: boolean;
	type?: 'date' | 'datetime-local' | 'time' | 'month' | 'week';
	min?: string;
	max?: string;
	onFocus?: () => void;
	onBlur?: () => void;
}

const FieldDatePicker: React.FC<FieldDatePickerProps> = ({
	id,
	label,
	placeholder = '',
	value = '',
	onChange,
	className = '',
	disabled = false,
	showClearButton = true,
	type = 'date',
	min,
	max,
	onFocus,
	onBlur,
}) => {
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const { isRTL } = useLocale();

	return (
		<div className={`relative ${className}`}>
			{label && (
				<label htmlFor={id} className={FIELD_STYLES.label}>
					{label}
				</label>
			)}
			<div className="relative">
				<Calendar className={`${FIELD_STYLES.startIcon} neu-icon-inactive z-10`} />
				<input
					ref={inputRef}
					id={id}
					type={type}
					placeholder={placeholder}
					value={value}
					onChange={(e) => onChange?.(e.target.value)}
					onFocus={() => {
						setIsFocused(true);
						onFocus?.();
					}}
					onBlur={() => {
						setIsFocused(false);
						onBlur?.();
					}}
					disabled={disabled}
					min={min}
					max={max}
					dir={isRTL ? 'rtl' : 'ltr'}
					className={`
						${FIELD_STYLES.container}
						${FIELD_STYLES.height}
						${FIELD_STYLES.padding}
						${FIELD_STYLES.text}
						${isRTL ? 'pe-12 ps-12' : 'pl-12 pr-12'}
						${isFocused ? 'ring-2 ring-primary' : ''}
						${disabled ? FIELD_STYLES.disabled : ''}
						w-full bg-transparent
					`}
				/>
				{showClearButton && value && (
					<button
						type="button"
						onClick={() => onChange?.('')}
						className={`${FIELD_STYLES.endIcon} ${FIELD_STYLES.clearButton}`}
					>
						<X className="w-3 h-3" />
					</button>
				)}
			</div>
		</div>
	);
};

export default FieldDatePicker;
