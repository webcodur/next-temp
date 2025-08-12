'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { GridFormContext } from './context';
import type { GridFormProps } from './types';
import { calculateOptimalLabelWidth } from './utils';
import GridFormRow from './GridFormRow';
import GridFormLabel from './GridFormLabel';

// #region GridForm 메인 컴포넌트
const GridForm = React.forwardRef<
	HTMLDivElement,
	GridFormProps & React.HTMLAttributes<HTMLDivElement>
>(({
	sequenceWidth = '60px',
	rulesWidth = '200px',
	gap = '20px',
	colorVariant = 'primary',
	className,
	children,
	topRightActions,
	bottomLeftActions,
	bottomRightActions,
	...props
}, ref) => {
	// 동적으로 라벨 너비 계산
	const labelWidth = React.useMemo(() => calculateOptimalLabelWidth(children, GridFormRow, GridFormLabel), [children]);
	
	// 단순화를 위해 총 개수 계산은 생략 (조건부/프래그먼트에도 안전)
	const totalCount = 0;
	
	// 간단한 시퀀스 카운터: 각 Row에서 컨텍스트의 getNextSequence를 호출해 가져가게 함
	const sequenceCounterRef = React.useRef(0);
	sequenceCounterRef.current = 0; // 렌더마다 초기화
	const getNextSequence = React.useCallback(() => {
		sequenceCounterRef.current += 1;
		return sequenceCounterRef.current;
	}, []);
	
	const gridTemplateColumns = `${sequenceWidth} ${labelWidth} 1fr ${rulesWidth}`;

	return (
		<GridFormContext.Provider value={{ 
			sequenceWidth, 
			labelWidth, 
			rulesWidth,
			gap, 
			colorVariant, 
			totalCount,
			getNextSequence,
		}}>
			<div className="w-full">
				{/* 우상단 액션 버튼 - GridForm 위에 순차적 배치 */}
				{topRightActions && (
					<div className="flex justify-end mb-3">
						{topRightActions}
					</div>
				)}

				{/* GridForm 본체 */}
				<div
					ref={ref}
					className={cn(
						'w-full rounded-lg border backdrop-blur-sm border-border/40',
						'grid auto-rows-min items-stretch', // 전체를 Grid Container로 만들고 items를 stretch
						className
					)}
					style={{
						gridTemplateColumns,
						gap: 0, // gap을 0으로 설정하여 테두리가 겹치도록 함
					} as React.CSSProperties}
					{...props}
				>
					{children}
				</div>

				{/* 하단 액션 버튼 - 좌우 분리 배치 */}
				{(bottomLeftActions || bottomRightActions) && (
					<div className="flex justify-between mt-3 w-full">
						<div className="flex gap-3 items-center">
							{bottomLeftActions}
						</div>
						<div className="flex gap-3 items-center">
							{bottomRightActions}
						</div>
					</div>
				)}
			</div>
		</GridFormContext.Provider>
	);
});

GridForm.displayName = 'GridForm';
// #endregion

export default GridForm;