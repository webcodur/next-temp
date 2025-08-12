'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { GridFormContext } from './context';
import type { GridFormRowProps, GridFormLabelProps, GridFormRulesProps, GridFormContentProps } from './types';
import GridFormSequence from './GridFormSequence';
import GridFormLabel from './GridFormLabel';
import GridFormContent from './GridFormContent';
import GridFormRules from './GridFormRules';

// #region GridForm.Row 컴포넌트
const GridFormRow: React.FC<GridFormRowProps & React.HTMLAttributes<HTMLDivElement>> = ({
	align = 'center',
	children,
}) => {
	const context = React.useContext(GridFormContext);
	const totalCount = context?.totalCount || 0;
	const sequence = context?.getNextSequence ? context.getNextSequence() : undefined;
	
	const alignClasses = {
		start: 'self-start',
		center: 'self-center',
		end: 'self-end',
	};

	// Label, Rules, Content를 찾아서 직접 렌더링
	let labelElement: React.ReactElement | null = null;
	let rulesElement: React.ReactElement | null = null;
	let contentElement: React.ReactElement | null = null;

	React.Children.forEach(children, (child) => {
		if (React.isValidElement(child)) {
			if (child.type === GridFormLabel) {
				labelElement = React.cloneElement(child as React.ReactElement<GridFormLabelProps>, {
					className: cn(
						// 박스 스타일링 - 가운데 정렬 (세로는 중앙, 가로는 가운데)
						'flex items-center justify-center px-4 py-2',
						'bg-muted/30 border-r border-b border-border/40',
						'font-medium text-base text-foreground text-center',
						// 높이 맞춤
						'min-h-full',
						// 마지막 요소의 하단 테두리 제거 (라벨)
						'last:border-b-0',
						alignClasses[align],
						(child.props as GridFormLabelProps)?.className
					),
				});
			}
			if (child.type === GridFormRules) {
				rulesElement = React.cloneElement(child as React.ReactElement<GridFormRulesProps>, {
					className: cn(
						// 입력 규칙 열 스타일링
						'flex items-center justify-start px-4 py-2',
						'bg-muted/10 border-r border-b border-border/40',
						'text-sm text-muted-foreground text-start',
						// 높이 맞춤
						'min-h-full',
						// 마지막 요소의 하단 테두리 제거 (규칙)
						'last:border-b-0',
						alignClasses[align],
						(child.props as GridFormRulesProps)?.className
					),
				});
			}
			if (child.type === GridFormContent) {
				contentElement = React.cloneElement(child as React.ReactElement<GridFormContentProps>, {
					className: cn(
						'bg-background border-b border-border/40',
						// 마지막 요소의 하단 테두리 제거 (컨텐츠)
						'last:border-b-0',
						alignClasses[align],
						(child.props as GridFormContentProps)?.className
					),
				});
			}
		}
	});

	return (
		<>
			{sequence && (
				<GridFormSequence
					sequence={sequence}
					total={totalCount}
					className={cn(
						'border-r border-b bg-muted/20 border-border/40',
						'last:border-b-0',
						alignClasses[align]
					)}
				/>
			)}
			{labelElement}
			{contentElement}
			{rulesElement}
		</>
	);
};

GridFormRow.displayName = 'GridFormRow';
// #endregion

export default GridFormRow;
