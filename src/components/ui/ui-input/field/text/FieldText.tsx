'use client';

import React, { useState, useRef } from 'react';
import { Search, Type, X } from 'lucide-react';
import { FIELD_STYLES } from '../core/config';
import { useLocale } from '@/hooks/useI18n';

interface FieldTextProps {
	id: string;
	label?: string;
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
	disabled?: boolean;
	showSearchIcon?: boolean;
	showClearButton?: boolean;
	maxLength?: number;
	onFocus?: () => void;
	onBlur?: () => void;
}

const FieldText: React.FC<FieldTextProps> = ({
	id,
	label,
	placeholder = '',
	value = '',
	onChange,
	className = '',
	disabled = false,
	showSearchIcon = false,
	showClearButton = true,
	maxLength,
	onFocus,
	onBlur,
	...rest
}) => {
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const { isRTL } = useLocale();

	const StartIcon = showSearchIcon ? Search : Type;

	return (
		<div className={`relative ${className}`}>
			{label && (
				<label htmlFor={id} className={FIELD_STYLES.label}>
					{label}
				</label>
			)}
			<div className="relative">
				<StartIcon className={`${FIELD_STYLES.startIcon} neu-icon-active`} />
				<input
					ref={inputRef}
					id={id}
					name={id}
					type="text"
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
					autoComplete="off"
					maxLength={maxLength}
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
					{...rest}
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

export default FieldText;
