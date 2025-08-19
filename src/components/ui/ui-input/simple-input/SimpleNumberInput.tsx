'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Hash, Plus, Minus } from 'lucide-react';
import { ValidationRule, validateField } from '@/utils/validation';
import { InputContainer } from './shared/InputContainer';

interface SimpleNumberInputProps {
	label?: string;
	value?: number | '';
	onChange?: (value: number | '') => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	min?: number;
	max?: number;
	validationRule?: ValidationRule;
	colorVariant?: 'primary' | 'secondary';
	// 왼쪽 아이콘 표시 여부
	showIcon?: boolean;
}

export const SimpleNumberInput: React.FC<SimpleNumberInputProps> = ({
	label,
	value = '',
	onChange,
	placeholder = '숫자를 입력하세요',
	disabled = false,
	className = '',
	min,
	max,
	validationRule,
	colorVariant = 'primary',
	showIcon = true,
}) => {
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleFocus = () => {
		if (disabled) return;
		setIsFocused(true);
	};

	const handleBlur = () => {
		setIsFocused(false);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;
		
		const inputValue = e.target.value;
		
		// 빈 값인 경우
		if (inputValue === '') {
			onChange?.('');
			return;
		}
		
		// 숫자로 변환
		const numValue = parseFloat(inputValue);
		
		// 유효한 숫자가 아닌 경우 변경하지 않음
		if (isNaN(numValue)) {
			return;
		}
		
		// min/max 검증
		if (min !== undefined && numValue < min) {
			return;
		}
		if (max !== undefined && numValue > max) {
			return;
		}
		
		onChange?.(numValue);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (disabled) return;

		if (e.key === 'Escape') {
			inputRef.current?.blur();
		}
	};

	const clearIntervals = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, []);

	const incrementValue = useCallback(() => {
		if (disabled) return false;
		
		const currentValue = typeof value === 'number' ? value : 0;
		const newValue = currentValue + 1;
		
		if (max !== undefined && newValue > max) return false;
		
		onChange?.(newValue);
		return true;
	}, [disabled, value, max, onChange]);

	const decrementValue = useCallback(() => {
		if (disabled) return false;
		
		const currentValue = typeof value === 'number' ? value : 0;
		const newValue = currentValue - 1;
		
		if (min !== undefined && newValue < min) return false;
		
		onChange?.(newValue);
		return true;
	}, [disabled, value, min, onChange]);

	const startContinuousChange = useCallback((changeFunction: () => boolean) => {
		clearIntervals();
		
		let currentInterval = 200; // 시작 간격 (ms)
		const minInterval = 50; // 최소 간격 (ms)
		const intervalDecrement = 20; // 간격 감소량 (ms)
		
		const runChange = () => {
			const canContinue = changeFunction();
			if (!canContinue) {
				clearIntervals();
				return;
			}
			
			// 점점 빨라지도록 간격 조정
			if (currentInterval > minInterval) {
				currentInterval = Math.max(minInterval, currentInterval - intervalDecrement);
			}
			
			timeoutRef.current = setTimeout(() => {
				intervalRef.current = setInterval(() => {
					const canContinue = changeFunction();
					if (!canContinue) {
						clearIntervals();
					}
				}, currentInterval);
			}, currentInterval);
		};
		
		// 500ms 후 연속 변경 시작
		timeoutRef.current = setTimeout(runChange, 500);
	}, [clearIntervals]);

	const handleIncrementMouseDown = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (disabled) return;
		
		incrementValue();
		startContinuousChange(incrementValue);
		inputRef.current?.focus();
	};

	const handleDecrementMouseDown = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (disabled) return;
		
		decrementValue();
		startContinuousChange(decrementValue);
		inputRef.current?.focus();
	};

	const handleMouseUpOrLeave = () => {
		clearIntervals();
	};

	const handleContainerClick = () => {
		if (disabled) return;
		inputRef.current?.focus();
	};

	// validation 결과 계산 (숫자를 문자열로 변환)
	const stringValue = value === '' ? '' : String(value);
	const validationResult = validationRule ? validateField(stringValue, validationRule) : null;
	
	// 피드백 타입 결정
	const getFeedbackType = () => {
		if (!validationRule || !validationResult) return 'info';
		if (validationRule.mode === 'edit' && !disabled && validationResult.hasValue) {
			return validationResult.isValid ? 'success' : 'error';
		}
		return 'info';
	};

	// cleanup on unmount
	useEffect(() => {
		return () => {
			clearIntervals();
		};
	}, [clearIntervals]);


	return (
		<div className={`relative ${className}`}>
			<div className="flex justify-between items-center">
				{label && (
					<label className="text-sm font-medium leading-6 text-foreground">
						{label}
					</label>
				)}
			</div>

			{/* Validation 피드백은 GridForm.Rules에서 처리됨 - 별도 표시 제거 */}

			<InputContainer
				isFocused={isFocused}
				disabled={disabled}
				colorVariant={colorVariant}
				validationStatus={getFeedbackType()}
				onClick={handleContainerClick}>
				
				{/* 왼쪽 해시 아이콘 */}
				{showIcon && (
					<Hash className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 pointer-events-none text-muted-foreground" />
				)}

				{/* 중앙 입력 필드 */}
				<input
					ref={inputRef}
					type="number"
					value={value}
					onChange={handleChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					disabled={disabled}
					min={min}
					max={max}
					className={`w-full ${showIcon ? 'pl-10' : 'pl-3'} pr-16 text-sm font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground placeholder:select-none text-foreground text-start [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
				/>

				{/* 우측 증감 버튼 */}
				{!disabled && (
					<div className="flex absolute right-2 top-1/2 gap-1 transform -translate-y-1/2">
						<button
							type="button"
							onMouseDown={handleDecrementMouseDown}
							onMouseUp={handleMouseUpOrLeave}
							onMouseLeave={handleMouseUpOrLeave}
							disabled={min !== undefined && typeof value === 'number' && value <= min}
							className="p-0.5 rounded border border-border cursor-pointer transition-colors duration-200 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed neu-raised"
							aria-label="숫자 감소">
							<Minus className="w-3 h-3 text-muted-foreground hover:text-foreground" />
						</button>
						<button
							type="button"
							onMouseDown={handleIncrementMouseDown}
							onMouseUp={handleMouseUpOrLeave}
							onMouseLeave={handleMouseUpOrLeave}
							disabled={max !== undefined && typeof value === 'number' && value >= max}
							className="p-0.5 rounded border border-border cursor-pointer transition-colors duration-200 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed neu-raised"
							aria-label="숫자 증가">
							<Plus className="w-3 h-3 text-muted-foreground hover:text-foreground" />
						</button>
					</div>
				)}
			</InputContainer>
		</div>
	);
};