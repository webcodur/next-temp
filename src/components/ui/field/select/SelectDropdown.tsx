import React from 'react';
import { Option } from '../core/types';
import { FIELD_STYLES } from '../core/config';

interface SelectDropdownProps {
	isOpen: boolean;
	options: Option[];
	selectedValue?: string;
	onSelect: (value: string) => void;
	maxHeight: number;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
	isOpen,
	options,
	selectedValue,
	onSelect,
	maxHeight,
}) => {
	if (!isOpen) return null;

	const handleOptionClick = (option: Option) => {
		if (!option.disabled) {
			onSelect(option.value);
		}
	};

	return (
		<div className="absolute right-0 left-0 top-full z-50 mt-1">
			<div
				className={`${FIELD_STYLES.dropdown} overflow-hidden rounded-lg border border-gray-200 shadow-lg neu-flat`}
				style={{ maxHeight: `${maxHeight}px` }}>
				<ul className="overflow-y-auto">
					{options.map((option) => (
						<li
							key={option.value}
							onClick={() => handleOptionClick(option)}
							className={`
								cursor-pointer px-3 py-1.5 text-xs font-medium transition-all duration-150
								neu-hover
								${option.disabled ? 'cursor-not-allowed text-gray-400 opacity-60' : 'text-gray-800'}
								${selectedValue === option.value ? 'font-bold text-primary' : ''}
							`}>
							{option.label}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
