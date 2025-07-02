'use client';

import React from 'react';
import { ChevronDown, List } from 'lucide-react';
import { FieldSelectComponentProps } from '../core/types';
import { FIELD_STYLES } from '../core/config';
import { SelectDropdown } from './SelectDropdown';
import { useSelectLogic } from '../shared/useSelectLogic';

export const FieldSelect: React.FC<FieldSelectComponentProps> = ({
	label,
	placeholder = '선택하세요',
	value,
	onChange,
	options,
	maxHeight = 200,
	leftIcon,
	disabled = false,
	className = '',
}) => {
	const {
		isOpen,
		setIsOpen,
		highlightedIndex,
		containerRef,
		selectedOption,
		handleOptionSelect,
	} = useSelectLogic(options, value, onChange);

	const toggleDropdown = () => {
		if (!disabled) {
			setIsOpen(!isOpen);
		}
	};

	const handleSelect = (selectedValue: string) => {
		const option = options.find((opt) => opt.value === selectedValue);
		if (option) {
			handleOptionSelect(option);
		}
	};

	return (
		<div ref={containerRef} className={`relative space-y-1 ${className}`}>
			{label && <label className={FIELD_STYLES.label}>{label}</label>}

			<div className="relative">
				<button
					type="button"
					onClick={toggleDropdown}
					disabled={disabled}
					className={`
						w-full text-left
						${FIELD_STYLES.container}
						${FIELD_STYLES.height}
						${FIELD_STYLES.padding}
						${FIELD_STYLES.text}
						pl-10 pr-10
						${disabled ? FIELD_STYLES.disabled : 'cursor-pointer'}
						${isOpen ? 'neu-flat-focus' : ''}
					`}>
					<span className={`${FIELD_STYLES.leftIcon}`}>
						{leftIcon || <List className="neu-icon-inactive w-4 h-4" />}
					</span>

					<span className="font-multilang block truncate">
						{selectedOption ? selectedOption.label : placeholder}
					</span>

					<ChevronDown
						className={`
							${FIELD_STYLES.rightIcon}
							neu-icon-inactive hover:neu-icon-active
							transition-transform
							${isOpen ? 'rotate-180' : ''}
						`}
					/>
				</button>

				<SelectDropdown
					isOpen={isOpen}
					options={options}
					selectedValue={value}
					onSelect={handleSelect}
					highlightedIndex={highlightedIndex}
					maxHeight={maxHeight}
				/>
			</div>
		</div>
	);
};
