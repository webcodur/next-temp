import React, { ReactNode, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

// #region 타입
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
	colorVariant?: 'primary' | 'secondary';
}
// #endregion

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
	colorVariant = 'primary',
}) => {
	// #region 상태
	const [isOpen, setIsOpen] = useState(defaultOpen);
	// #endregion

	// #region 색상 variant에 따른 스타일
	const colorStyles = {
		backgroundActive: colorVariant === 'primary' ? 'bg-primary/10' : 'bg-secondary/10',
		backgroundHover: colorVariant === 'primary' ? 'hover:bg-primary/10' : 'hover:bg-secondary/10',
		textColor: colorVariant === 'primary' ? 'text-primary' : 'text-secondary',
	};
	// #endregion

	// #region 핸들러
	const handleToggle = () => {
		if (disabled) return;
		
		const newState = !isOpen;
		setIsOpen(newState);
		onToggle?.(newState);
	};
	// #endregion

	// #region 렌더링
	return (
		<div className={`rounded-2xl neu-flat bg-muted ${className}`}>
			{/* 헤더 */}
			<div
				onClick={handleToggle}
				className={`flex items-center justify-between p-4 ${isOpen ? colorStyles.backgroundActive : 'bg-background'} cursor-pointer neu-raised rounded-2xl transition-colors ${
					disabled 
						? 'cursor-not-allowed opacity-60' 
						: colorStyles.backgroundHover
				} ${headerClassName}`}>
				<h2 className="text-sm font-medium text-foreground">{title}</h2>
				<div className="flex gap-3 items-center">
					{/* 상태 텍스트 */}
					{statusText && (
						<span className={`text-xs font-medium ${colorStyles.textColor}`}>
							{statusText}
						</span>
					)}
					{/* 토글 아이콘 */}
					<div className={`transition-transform duration-200 ${
						disabled ? 'opacity-60 neu-icon-inactive' : 'neu-icon-inactive hover:neu-icon-active'
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
						? 'mt-2 opacity-100 max-h-[1000px]' 
						: 'overflow-hidden max-h-0 opacity-0'
				}`}>
				<div className={`p-4 ${contentClassName}`}>
					{children}
				</div>
			</div>
		</div>
	);
	// #endregion
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