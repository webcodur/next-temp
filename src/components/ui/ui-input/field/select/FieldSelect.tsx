'use client';

import React, { useState, useRef } from 'react';
import { List, ChevronDown, X } from 'lucide-react';
import { FIELD_STYLES, getColorVariantStyles, FIELD_CONSTANTS } from '../core/config';
import { SelectDropdown } from './SelectDropdown';
import { useLocale } from '@/hooks/ui-hooks/useI18n';
import { useSelectLogic } from '../../../../../hooks/useSelectLogic';

// #region 타입
interface FieldSelectProps {
	id: string;
	label?: string;
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
	options: Array<{ value: string; label: string }>;
	className?: string;
	disabled?: boolean;
	startIcon?: React.ReactNode;
	colorVariant?: 'primary' | 'secondary';
	onFocus?: () => void;
	onBlur?: () => void;
	showAllOption?: boolean;
	allOptionLabel?: string;
	allOptionValue?: string;
	showClearButton?: boolean;
}
// #endregion

const FieldSelect: React.FC<FieldSelectProps> = ({
	id,
	label,
	placeholder = '선택하세요',
	value = '',
	onChange,
	options,
	className = '',
	disabled = false,
	startIcon,
	colorVariant = 'primary',
	onFocus,
	onBlur,
	showAllOption = true,
	allOptionLabel = FIELD_CONSTANTS.DEFAULT_ALL_OPTION_LABEL,
	allOptionValue = FIELD_CONSTANTS.DEFAULT_ALL_OPTION_VALUE,
	showClearButton = true,
}) => {
	// #region 상태
	const [isFocused, setIsFocused] = useState(false);
	// #endregion

	// #region 훅
	const { isRTL } = useLocale();
	const colorStyles = getColorVariantStyles(colorVariant);
	const inputRef = useRef<HTMLDivElement>(null); // 내부 박스 ref 추가
	
	// "전체" 옵션 추가한 최종 옵션 리스트
	const finalOptions = showAllOption 
		? [{ value: allOptionValue, label: allOptionLabel }, ...options]
		: options;
	// #endregion

	// #region 핸들러
	// use shared select logic (handles outside click & keyboard nav)
	const {
		isOpen,
		setIsOpen,
		highlightedIndex,
		containerRef,
		selectedOption,
		handleOptionSelect,
	} = useSelectLogic(finalOptions, value, onChange);


	// #endregion

	const handleSelect = (optionValue: string) => {
		const opt = finalOptions.find((o) => o.value === optionValue);
		if (opt) handleOptionSelect(opt);
	};

	return (
		<div ref={containerRef} className={`${FIELD_STYLES.fieldWrapper} ${className}`}>
			{label && (
				<label htmlFor={id} className={FIELD_STYLES.label}>
					{label}
				</label>
			)}
			<div className="relative">
				<div
					ref={inputRef}
					className={`
						${FIELD_STYLES.container}
						${FIELD_STYLES.height}
						${FIELD_STYLES.padding}
						${FIELD_STYLES.text}
						${isRTL ? 'pe-12 ps-12' : 'pl-12 pr-12'}
						${isFocused ? `ring-2 ${colorStyles.focusRing}` : ''}
						${disabled ? FIELD_STYLES.disabled : 'cursor-pointer'}
						w-full ${FIELD_STYLES.background.inner} flex items-center justify-between
					`}
					onClick={() => !disabled && setIsOpen(!isOpen)}
					onFocus={() => {
						setIsFocused(true);
						onFocus?.();
					}}
					onBlur={() => {
						setIsFocused(false);
						onBlur?.();
					}}
				>
					<span className={`${FIELD_STYLES.startIcon}`}>
						{startIcon || <List className={`w-4 h-4 ${colorStyles.activeIcon}`} />}
					</span>
					<span className={`${selectedOption ? 'text-foreground' : 'text-muted-foreground'}`}>
						{selectedOption ? selectedOption.label : placeholder}
					</span>
					
					{/* 클리어 버튼과 드롭다운 버튼 */}
					<div className={`flex absolute ${isRTL ? 'start-3' : 'end-3'} top-1/2 gap-1 items-center transform -translate-y-1/2`}>
						{showClearButton && selectedOption && selectedOption.value !== allOptionValue && (
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onChange?.(allOptionValue);
								}}
								className={FIELD_STYLES.clearButton}
							>
								<X className="w-3 h-3" />
							</button>
						)}
						<ChevronDown 
							className={`
								w-4 h-4 neu-icon-active
								${isOpen ? 'rotate-180' : ''}
							`}
						/>
					</div>
				</div>
				
				{isOpen && (
					<SelectDropdown
						isOpen={isOpen}
						options={finalOptions}
						selectedValue={value}
						onSelect={handleSelect}
						highlightedIndex={highlightedIndex}
						maxHeight={200}
						triggerRef={inputRef as React.RefObject<HTMLElement>}
					/>
				)}
			</div>
		</div>
	);
};

export default FieldSelect;
