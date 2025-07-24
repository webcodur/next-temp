'use client';

import React, { useState } from 'react';
import { List, ChevronDown } from 'lucide-react';
import { FIELD_STYLES } from '../core/config';
import { SelectDropdown } from './SelectDropdown';
import { useLocale } from '@/hooks/useI18n';
import { useSelectLogic } from '../shared/useSelectLogic';

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
	onFocus?: () => void;
	onBlur?: () => void;
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
	onFocus,
	onBlur,
}) => {
	// #region 상태
	const [isFocused, setIsFocused] = useState(false);
	// #endregion

	// #region 훅
	const { isRTL } = useLocale();
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
	} = useSelectLogic(options, value, onChange);


	// #endregion

	const handleSelect = (optionValue: string) => {
		const opt = options.find((o) => o.value === optionValue);
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
					className={`
						${FIELD_STYLES.container}
						${FIELD_STYLES.height}
						${FIELD_STYLES.padding}
						${FIELD_STYLES.text}
						${isRTL ? 'pe-12 ps-12' : 'pl-12 pr-12'}
						${isFocused ? 'ring-2 ring-primary' : ''}
						${disabled ? FIELD_STYLES.disabled : 'cursor-pointer'}
						w-full bg-transparent flex items-center justify-between
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
						{startIcon || <List className="w-4 h-4 neu-icon-active" />}
					</span>
					<span className={`${selectedOption ? 'text-foreground' : 'text-muted-foreground'}`}>
						{selectedOption ? selectedOption.label : placeholder}
					</span>
					<ChevronDown 
						className={`
							${FIELD_STYLES.endIcon}
							w-4 h-4
							${isOpen ? 'rotate-180' : ''}
						`}
					/>
				</div>
				
				{isOpen && (
					<SelectDropdown
						isOpen={isOpen}
						options={options}
						selectedValue={value}
						onSelect={handleSelect}
						highlightedIndex={highlightedIndex}
						maxHeight={200}
						triggerRef={containerRef as React.RefObject<HTMLElement>}
					/>
				)}
			</div>
		</div>
	);
};

export default FieldSelect;
