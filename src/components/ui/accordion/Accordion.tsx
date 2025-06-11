import React, { ReactNode, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface AccordionProps {
	title?: string;
	children: ReactNode;
	defaultOpen?: boolean;
	statusText?: string;
	onToggle?: (isOpen: boolean) => void;
	className?: string;
	headerClassName?: string;
	contentClassName?: string;
	disabled?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
	title = 'Accordion',
	children,
	defaultOpen = false,
	statusText,
	onToggle,
	className = '',
	headerClassName = '',
	contentClassName = '',
	disabled = false,
}) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const handleToggle = () => {
		if (disabled) return;
		
		const newState = !isOpen;
		setIsOpen(newState);
		onToggle?.(newState);
	};

	return (
		<div className={`neu-flat bg-gray-50 rounded-2xl ${className}`}>
			{/* 헤더 */}
			<div
				onClick={handleToggle}
				className={`flex items-center justify-between p-4 bg-white cursor-pointer neu-raised rounded-2xl transition-colors ${
					disabled 
						? 'cursor-not-allowed opacity-60' 
						: 'hover:bg-gray-50'
				} ${headerClassName}`}>
				<h2 className="text-sm font-medium text-gray-900">{title}</h2>
				<div className="flex items-center gap-3">
					{/* 상태 텍스트 */}
					{statusText && (
						<span className="text-xs font-medium text-gray-500">
							{statusText}
						</span>
					)}
					{/* 토글 아이콘 */}
					<div className={`transition-transform duration-200 ${
						disabled ? 'neu-icon-inactive opacity-60' : 'neu-icon-inactive hover:neu-icon-active'
					} ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
						{isOpen ? (
							<ChevronUp className="w-4 h-4" />
						) : (
							<ChevronDown className="w-4 h-4" />
						)}
					</div>
				</div>
			</div>

			{/* 콘텐츠 */}
			<div
				className={`transition-all duration-300 ease-in-out ${
					isOpen 
						? 'max-h-[1000px] opacity-100 mt-2' 
						: 'max-h-0 opacity-0 overflow-hidden'
				}`}>
				<div className={`p-4 ${contentClassName}`}>
					{children}
				</div>
			</div>
		</div>
	);
};

// 다중 Accordion을 위한 그룹 컴포넌트
interface AccordionGroupProps {
	children: ReactNode;
	className?: string;
}

export const AccordionGroup: React.FC<AccordionGroupProps> = ({
	children,
	className = '',
}) => {
	return (
		<div className={`space-y-4 ${className}`}>
			{children}
		</div>
	);
}; 