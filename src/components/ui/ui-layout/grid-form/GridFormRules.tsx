'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Modal from '../modal/Modal';
import type { GridFormRulesProps } from './types';

// #region GridForm.Rules 컴포넌트
const GridFormRules = React.forwardRef<
	HTMLDivElement,
	GridFormRulesProps & React.HTMLAttributes<HTMLDivElement>
>(({
	className,
	children,
	...props
}, ref) => {
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const textRef = React.useRef<HTMLSpanElement>(null);
	const [isTextTruncated, setIsTextTruncated] = React.useState(false);

	// 텍스트가 잘렸는지 확인
	React.useEffect(() => {
		const checkTruncation = () => {
			if (textRef.current) {
				const isOverflowing = textRef.current.scrollWidth > textRef.current.clientWidth;
				setIsTextTruncated(isOverflowing);
			}
		};

		checkTruncation();
		window.addEventListener('resize', checkTruncation);

		return () => window.removeEventListener('resize', checkTruncation);
	}, [children]);

	const handleClick = () => {
		if (isTextTruncated) {
			setIsModalOpen(true);
		}
	};

	return (
		<>
			<div
				ref={ref}
				className={cn(
					'flex justify-start items-center px-4 py-2',
					'text-sm text-muted-foreground font-multilang',
					'min-h-full w-full',
					isTextTruncated && 'cursor-pointer hover:text-foreground transition-colors',
					className
				)}
				onClick={handleClick}
				title={isTextTruncated ? '클릭하여 전체 내용 보기' : undefined}
				{...props}
			>
				<span 
					ref={textRef}
					className="block w-full overflow-hidden text-ellipsis whitespace-nowrap"
				>
					{children}
				</span>
			</div>

			{/* 모달 */}
			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title="규칙 상세 내용"
				size="md"
			>
				<div className="text-sm text-foreground font-multilang whitespace-pre-wrap">
					{children}
				</div>
			</Modal>
		</>
	);
});

GridFormRules.displayName = 'GridFormRules';
// #endregion

export default GridFormRules;
