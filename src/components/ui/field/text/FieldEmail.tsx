'use client';

import React, { ChangeEvent, KeyboardEvent } from 'react';
import { Mail, X, Check, AlertCircle } from 'lucide-react';
import { FieldEmailComponentProps } from '../core/types';
import { FIELD_STYLES } from '../core/config';

export const FieldEmail: React.FC<FieldEmailComponentProps> = ({
	label,
	placeholder = '이메일을 입력하세요',
	value,
	onChange,
	onEnterPress,
	onClear,
	className = '',
	showClearButton = true,
	disabled = false,
	showValidation = false,
	allowedDomains = [],
}) => {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && onEnterPress) {
			onEnterPress();
		}
	};

	const handleClear = () => {
		onChange('');
		onClear?.();
	};

	const validateEmail = (email: string) => {
		if (!email) return { isValid: true, message: '' };

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const isFormatValid = emailRegex.test(email);

		if (!isFormatValid) {
			return { isValid: false, message: '올바른 이메일 형식이 아닙니다' };
		}

		if (allowedDomains.length > 0) {
			const domain = email.split('@')[1];
			if (!allowedDomains.includes(domain)) {
				return {
					isValid: false,
					message: `허용된 도메인: ${allowedDomains.join(', ')}`,
				};
			}
		}

		return { isValid: true, message: '유효한 이메일입니다' };
	};

	const validation = validateEmail(value);

	return (
		<div className={`space-y-1 ${className}`}>
			{label && <label className={FIELD_STYLES.label}>{label}</label>}

			<div className="relative">
				<Mail className={FIELD_STYLES.leftIcon} />

				<input
					type="email"
					placeholder={placeholder}
					value={value}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					disabled={disabled}
					spellCheck={false}
					autoComplete="email"
					className={`
						w-full
						${FIELD_STYLES.container}
						${FIELD_STYLES.height}
						${FIELD_STYLES.padding}
						${FIELD_STYLES.text}
						pl-10
						${showClearButton && value ? 'pr-10' : ''}
						${disabled ? FIELD_STYLES.disabled : ''}
						${showValidation && value && !validation.isValid ? 'border-destructive focus:border-destructive' : ''}
					`}
				/>

				{showClearButton && value && (
					<button
						onClick={handleClear}
						className={`${FIELD_STYLES.rightIcon} ${FIELD_STYLES.clearButton}`}
						type="button">
						<X className="w-3 h-3" />
					</button>
				)}
			</div>

			{showValidation && value && (
				<div className="flex gap-2 items-center mt-1">
					{validation.isValid ? (
						<Check className="neu-icon-active w-4 h-4 text-success" />
					) : (
						<AlertCircle className="neu-icon-active w-4 h-4 text-destructive" />
					)}
					<span
						className={`font-multilang text-xs font-medium ${
							validation.isValid ? 'text-success' : 'text-destructive'
						}`}>
						{validation.message}
					</span>
				</div>
			)}
		</div>
	);
};
