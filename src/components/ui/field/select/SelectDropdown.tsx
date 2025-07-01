import React from 'react';
import { Option } from '../core/types';
import { FIELD_STYLES } from '../core/config';

interface SelectDropdownProps {
	isOpen: boolean;
	options: Option[];
	selectedValue?: string;
	onSelect: (value: string) => void;
	highlightedIndex?: number;
	maxHeight: number;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
	isOpen,
	options,
	selectedValue,
	onSelect,
	highlightedIndex = -1,
	maxHeight,
}) => {
	if (!isOpen) return null;

	const handleOptionClick = (option: Option) => {
		if (!option.disabled) {
			onSelect(option.value);
		}
	};

	const totalCount = options.length;

	return (
		<div className="absolute right-0 left-0 top-full z-50 mt-1">
			<div
				className={`${FIELD_STYLES.dropdown} overflow-hidden rounded-lg`}
				style={{ maxHeight: `${maxHeight}px` }}>
				<ul
					className={FIELD_STYLES.dropdownScroll}
					style={{ maxHeight: `${maxHeight}px` }}>
					{options.map((option, index) => {
						const isSelected = selectedValue === option.value;
						const isHighlighted = highlightedIndex === index;
						const numberLabel = `${index + 1}/${totalCount}`;

						return (
							<li
								key={option.value}
								onClick={() => handleOptionClick(option)}
								className={`
									${FIELD_STYLES.dropdownOption}
									${option.disabled ? FIELD_STYLES.dropdownOptionDisabled : ''}
									${isSelected ? FIELD_STYLES.dropdownOptionSelected : ''}
									${isHighlighted && !isSelected ? FIELD_STYLES.dropdownOptionHighlighted : ''}
								`}>
								<div className="flex items-center justify-between">
									<span className="font-multilang">{option.label}</span>
									<span className="font-multilang text-xs text-muted-foreground font-mono ml-2">
										{numberLabel}
									</span>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};
