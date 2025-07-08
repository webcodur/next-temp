'use client';

import React, { useState, useRef } from 'react';
import { Key, Eye, EyeOff, X } from 'lucide-react';
import { FIELD_STYLES } from '../core/config';
import { useLocale } from '@/hooks/useI18n';

interface FieldPasswordProps {
	id: string;
	label?: string;
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
	disabled?: boolean;
	showClearButton?: boolean;
	showToggle?: boolean;
	onFocus?: () => void;
	onBlur?: () => void;
	error?: boolean;
	errorMessage?: string;
}

const FieldPassword: React.FC<FieldPasswordProps> = ({
	id,
	label,
	placeholder = '',
	value = '',
	onChange,
	className = '',
	disabled = false,
	showClearButton = true,
	showToggle = true,
	onFocus,
	onBlur,
	error = false,
	errorMessage = '',
}) => {
	const [isFocused, setIsFocused] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const { isRTL } = useLocale();

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
				<Key className={`${FIELD_STYLES.startIcon} neu-icon-active`} />
				<input
					ref={inputRef}
					id={id}
					name={id}
					type={showPassword ? 'text' : 'password'}
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
					autoComplete="new-password"
					dir={isRTL ? 'rtl' : 'ltr'}
					className={`
						${FIELD_STYLES.container} 
						${FIELD_STYLES.height} 
						${FIELD_STYLES.padding} 
						${FIELD_STYLES.text}
						${isRTL ? 'pe-20 ps-12' : 'pl-12 pr-20'}
						${isFocused ? 'ring-2 ring-primary' : ''}
						${error ? 'ring-2 ring-destructive' : ''}
						${disabled ? FIELD_STYLES.disabled : ''}
						w-full bg-transparent
					`}
				/>
				
				{/* 토글 & 클리어 버튼 */}
				<div className={`flex absolute ${isRTL ? 'start-3' : 'end-3'} top-1/2 gap-2 items-center transform -translate-y-1/2`}>
					{showToggle && (
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className={FIELD_STYLES.clearButton}
						>
							{showPassword ? (
								<Eye className="w-4 h-4" />
							) : (
								<EyeOff className="w-4 h-4" />
							)}
						</button>
					)}
					{showClearButton && value && (
						<button
							type="button"
							onClick={() => onChange?.('')}
							className={FIELD_STYLES.clearButton}
						>
							<X className="w-3 h-3" />
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default FieldPassword;
