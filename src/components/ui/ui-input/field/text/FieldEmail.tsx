'use client';

import React, { useState, useRef } from 'react';
import { Mail, X, CheckCircle, AlertCircle } from 'lucide-react';
import { FIELD_STYLES } from '../core/config';
import { useLocale } from '@/hooks/useI18n';

interface FieldEmailProps {
	id: string;
	label?: string;
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
	disabled?: boolean;
	showClearButton?: boolean;
	showValidation?: boolean;
	onFocus?: () => void;
	onBlur?: () => void;
	error?: boolean;
	errorMessage?: string;
}

const FieldEmail: React.FC<FieldEmailProps> = ({
	id,
	label,
	placeholder = '',
	value = '',
	onChange,
	className = '',
	disabled = false,
	showClearButton = true,
	showValidation = true,
	onFocus,
	onBlur,
	error = false,
	errorMessage = '',
}) => {
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const { isRTL } = useLocale();

	// 간단한 이메일 유효성 검사
	const isValidEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const isValid = value ? isValidEmail(value) : true;

	return (
		<div className={`relative ${className}`}>
			{label && (
				<div className="flex justify-between items-center mb-1">
					<label htmlFor={id} className={FIELD_STYLES.label}>
						{label}
					</label>
					{error && errorMessage && (
						<span className="text-xs font-multilang text-destructive">
							{errorMessage}
						</span>
					)}
				</div>
			)}
			<div className="relative">
				<Mail className={`${FIELD_STYLES.startIcon} neu-icon-active`} />
				<input
					ref={inputRef}
					id={id}
					name={id}
					type="email"
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
					dir={isRTL ? 'rtl' : 'ltr'}
					className={`
						${FIELD_STYLES.container} 
						${FIELD_STYLES.height} 
						${FIELD_STYLES.padding} 
						${FIELD_STYLES.text}
						${isRTL ? 'pe-12 ps-12' : 'pl-12 pr-12'}
						${isFocused ? 'ring-2 ring-primary' : ''}
						${error ? 'ring-2 ring-destructive' : ''}
						${!isValid ? 'ring-2 ring-red-500' : ''}
						${disabled ? FIELD_STYLES.disabled : ''}
						w-full bg-transparent
					`}
				/>
				
				{/* 유효성 검사 아이콘 */}
				{showValidation && value && (
					<div className={`${FIELD_STYLES.endIcon} ${showClearButton ? (isRTL ? 'start-10' : 'right-10') : ''}`}>
						{isValid ? (
							<CheckCircle className="w-4 h-4 text-green-500" />
						) : (
							<AlertCircle className="w-4 h-4 text-red-500" />
						)}
					</div>
				)}
				
				{/* 클리어 버튼 */}
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

export default FieldEmail;
