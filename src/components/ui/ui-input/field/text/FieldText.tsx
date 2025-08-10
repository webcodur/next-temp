'use client';

import React, { useState, useRef } from 'react';
import { Search, Type, X } from 'lucide-react';
import { FIELD_STYLES, getColorVariantStyles } from '../core/config';
import { useLocale } from '@/hooks/ui-hooks/useI18n';

// #region 타입
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
	colorVariant?: 'primary' | 'secondary';
	onFocus?: () => void;
	onBlur?: () => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
// #endregion

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
	colorVariant = 'primary',
	onFocus,
	onBlur,
	onKeyDown,
	...rest
}) => {
	// #region 상태
	const [isFocused, setIsFocused] = useState(false);
	// #endregion

	// #region 훅
	const inputRef = useRef<HTMLInputElement>(null);
	const { isRTL } = useLocale();
	// #endregion

	// #region 상수
	const StartIcon = showSearchIcon ? Search : Type;
	const colorStyles = getColorVariantStyles(colorVariant);
	// #endregion

	// #region 렌더링
	return (
		<div className={`${FIELD_STYLES.fieldWrapper} ${className}`}>
			{label && (
				<label htmlFor={id} className={FIELD_STYLES.label}>
					{label}
				</label>
			)}
			<div className="relative">
				<StartIcon className={`${FIELD_STYLES.startIcon} ${colorStyles.activeIcon}`} />
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
					onKeyDown={onKeyDown}
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
						${isFocused ? `ring-2 ${colorStyles.focusRing}` : ''}
						${disabled ? FIELD_STYLES.disabled : ''}
						w-full ${FIELD_STYLES.background.inner}
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
