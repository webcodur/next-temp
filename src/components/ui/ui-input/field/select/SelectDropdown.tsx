'use client';

import React, { useEffect, useState } from 'react';
import { Option } from '../core/types';
import { FIELD_STYLES } from '../core/config';

interface SelectDropdownProps {
	isOpen: boolean;
	options: Option[];
	selectedValue?: string;
	onSelect: (value: string) => void;
	highlightedIndex?: number;
	maxHeight: number;
	triggerRef?: React.RefObject<HTMLElement>;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
	isOpen,
	options,
	selectedValue,
	onSelect,
	highlightedIndex = -1,
	maxHeight,
	triggerRef,
}) => {
	const [openAbove, setOpenAbove] = useState(false);

	useEffect(() => {
		if (triggerRef?.current && isOpen) {
			const rect = triggerRef.current.getBoundingClientRect();
			const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
			const spaceBelow = viewportHeight - rect.bottom;
			const totalCount = options.length;
			const minHeight = Math.min(7, totalCount) * 40;
			const finalMaxHeight = Math.max(maxHeight, minHeight);
			
			setOpenAbove(spaceBelow < finalMaxHeight + 16);
		}
	}, [isOpen, options.length, maxHeight, triggerRef]);

	if (!isOpen) return null;

	const handleOptionClick = (option: Option) => {
		if (!option.disabled) {
			onSelect(option.value);
		}
	};

	const totalCount = options.length;
	const minHeight = Math.min(7, totalCount) * 40;
	const finalMaxHeight = Math.max(maxHeight, minHeight);

	return (
		<div
			className={`absolute start-0 end-0 z-50 ${openAbove ? 'bottom-full mb-1' : 'top-full mt-1'}`}
		>
			<div
				className={`${FIELD_STYLES.dropdown} overflow-hidden rounded-lg`}
				style={{ maxHeight: `${finalMaxHeight}px` }}>
				<ul
					className={FIELD_STYLES.dropdownScroll}
					style={{ maxHeight: `${finalMaxHeight}px` }}>
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
									${isSelected ? `${FIELD_STYLES.dropdownOptionSelected} !bg-primary !text-primary-foreground` : ''}
									${isHighlighted && !isSelected ? FIELD_STYLES.dropdownOptionHighlighted : ''}
								`.replace(/\s+/g, ' ').trim()}>
								<div className="flex justify-between items-center">
									<div className="flex gap-2 items-center">
										<span className={`font-multilang text-xs font-mono ${isSelected ? 'text-primary-foreground' : isHighlighted ? 'text-foreground' : 'text-muted-foreground'}`}>
											{numberLabel}
										</span>
										<span className={`font-multilang ${isSelected ? '!text-primary-foreground':''}`}>{option.label}</span>
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};
