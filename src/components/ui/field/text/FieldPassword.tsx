'use client';

import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
import { Key, Eye, EyeOff, X } from 'lucide-react';
import { FieldPasswordComponentProps } from '../core/types';
import { FIELD_STYLES } from '../core/config';

export const FieldPassword: React.FC<FieldPasswordComponentProps> = ({
	label,
	placeholder = '비밀번호를 입력하세요',
	value,
	onChange,
	onEnterPress,
	onClear,
	className = '',
	showClearButton = true,
	disabled = false,
	showStrengthIndicator = false,
	minLength = 8,
}) => {
	const [showPassword, setShowPassword] = useState(false);

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

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const getPasswordStrength = (
		password: string
	): { level: number; text: string; color: string } => {
		if (!password) return { level: 0, text: '', color: '' };

		let score = 0;
		if (password.length >= minLength) score++;
		if (/[a-z]/.test(password)) score++;
		if (/[A-Z]/.test(password)) score++;
		if (/[0-9]/.test(password)) score++;
		if (/[^A-Za-z0-9]/.test(password)) score++;

		const levels = [
			{ level: 0, text: '', color: '' },
			{ level: 1, text: '매우 약함', color: 'text-red-600' },
			{ level: 2, text: '약함', color: 'text-orange-600' },
			{ level: 3, text: '보통', color: 'text-yellow-600' },
			{ level: 4, text: '강함', color: 'text-blue-600' },
			{ level: 5, text: '매우 강함', color: 'text-green-600' },
		];

		return levels[score];
	};

	const passwordStrength = getPasswordStrength(value);

	return (
		<div className={`space-y-1 ${className}`}>
			{label && <label className={FIELD_STYLES.label}>{label}</label>}

			<div className="relative">
				<Key className={FIELD_STYLES.leftIcon} />

				<input
					type={showPassword ? 'text' : 'password'}
					placeholder={placeholder}
					value={value}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					disabled={disabled}
					spellCheck={false}
					autoComplete="new-password"
					className={`
						w-full
						${FIELD_STYLES.container}
						${FIELD_STYLES.height}
						${FIELD_STYLES.padding}
						${FIELD_STYLES.text}
						pl-10
						${showClearButton && value ? 'pr-20' : 'pr-12'}
						${disabled ? FIELD_STYLES.disabled : ''}
					`}
				/>

				<div className="flex absolute right-3 top-1/2 gap-2 items-center transform -translate-y-1/2">
					{showClearButton && value && (
						<button
							onClick={handleClear}
							className={FIELD_STYLES.clearButton}
							type="button">
							<X className="w-3 h-3" />
						</button>
					)}

					<button
						type="button"
						onClick={togglePasswordVisibility}
						disabled={disabled}
						className="p-0.5 text-gray-700 hover:text-gray-900 transition-colors neu-icon-inactive hover:neu-icon-active">
						{showPassword ? (
							<EyeOff className="w-4 h-4" />
						) : (
							<Eye className="w-4 h-4" />
						)}
					</button>
				</div>
			</div>

			{showStrengthIndicator && value && (
				<div className="mt-2">
					<div className="flex gap-2 items-center">
						<div className="overflow-hidden flex-1 h-1 bg-gray-200 rounded-full">
							<div
								className={`h-full transition-all ${
									passwordStrength.level === 1
										? 'w-1/5 bg-red-500'
										: passwordStrength.level === 2
											? 'w-2/5 bg-orange-500'
											: passwordStrength.level === 3
												? 'w-3/5 bg-yellow-500'
												: passwordStrength.level === 4
													? 'w-4/5 bg-blue-500'
													: passwordStrength.level === 5
														? 'w-full bg-green-500'
														: 'w-0'
								}`}
							/>
						</div>
						{passwordStrength.text && (
							<span className={`text-xs font-medium ${passwordStrength.color}`}>
								{passwordStrength.text}
							</span>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
