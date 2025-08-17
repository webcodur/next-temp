'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { GridFormContext } from './context';
import type { GridFormProps } from './types';
import { calculateOptimalLabelWidth, calculateColumnLabelWidths } from './utils';
import GridFormRow from './GridFormRow';
import GridFormLabel from './GridFormLabel';

// #region GridForm 메인 컴포넌트
const GridForm = React.forwardRef<
	HTMLDivElement,
	GridFormProps & React.HTMLAttributes<HTMLDivElement>
>(({
	viewMode = 'default',
	sequenceWidth = '60px',
	rulesWidth = '280px',
	gap = '20px',
	colorVariant = 'primary',
	className,
	children,
	topRightActions,
	bottomLeftActions,
	bottomRightActions,
	...props
}, ref) => {

	// 동적으로 라벨 너비 계산 (상세뷰용)
	const labelWidth = React.useMemo(() => calculateOptimalLabelWidth(children, GridFormRow, GridFormLabel), [children]);
	
	// 기본뷰용 열별 라벨 너비 계산
	const columnLabelWidths = React.useMemo(() => calculateColumnLabelWidths(children, GridFormRow, GridFormLabel, 2), [children]);
	
	// 단순화를 위해 총 개수 계산은 생략 (조건부/프래그먼트에도 안전)
	const totalCount = 0;
	
	// 간단한 시퀀스 카운터: 각 Row에서 컨텍스트의 getNextSequence를 호출해 가져가게 함
	const sequenceCounterRef = React.useRef(0);
	const columnIndexRef = React.useRef(0);
	sequenceCounterRef.current = 0; // 렌더마다 초기화
	columnIndexRef.current = 0; // 렌더마다 초기화
	
	const getNextSequence = React.useCallback(() => {
		sequenceCounterRef.current += 1;
		return sequenceCounterRef.current;
	}, []);
	
	const getCurrentColumnIndex = React.useCallback(() => {
		const currentIndex = columnIndexRef.current;
		columnIndexRef.current = (columnIndexRef.current + 1) % 2; // 2열 순환
		return currentIndex;
	}, []);
	
	// 반응형 그리드 템플릿 컬럼 설정
	const [isLargeScreen, setIsLargeScreen] = React.useState(true);
	
	React.useEffect(() => {
		const checkScreenSize = () => {
			setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint
		};
		
		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);
		
		return () => window.removeEventListener('resize', checkScreenSize);
	}, []);
	
	// 뷰 모드별 그리드 템플릿 컬럼 설정
	const gridTemplateColumns = React.useMemo(() => {
		if (viewMode === 'default') {
			return `${labelWidth} 1fr`; // 기본뷰: 2열 구조 [필드명 - 필드값]
		}
		
		// 상세뷰: 4열 구조 [순서 - 필드명 - 필드값 - 룰]
		const rulesColumnWidth = isLargeScreen ? rulesWidth : '120px'; // 작은 화면에서도 최소한의 텍스트 표시
		return `${sequenceWidth} ${labelWidth} 1fr ${rulesColumnWidth}`;
	}, [viewMode, sequenceWidth, labelWidth, rulesWidth, isLargeScreen]);

	return (
		<GridFormContext.Provider value={{ 
			viewMode,
			sequenceWidth, 
			labelWidth,
			columnLabelWidths,
			rulesWidth,
			responsiveRulesWidth: '40px', // 반응형에서 사용할 rules 컬럼 너비
			gap, 
			colorVariant, 
			totalCount,
			getNextSequence,
			getCurrentColumnIndex,
		}}>
			<div className="w-full">
				{/* 상단 액션 영역 */}
				{topRightActions && (
					<div className="flex justify-end items-center mb-3">
						<div className="flex gap-3 items-center">
							{topRightActions}
						</div>
					</div>
				)}

				{/* GridForm 본체 */}
				<div
					ref={ref}
					className={cn(
						'w-full transition-all duration-200 ease-in-out', // 부드러운 전환 효과
						viewMode === 'default' 
							? 'rounded-lg border backdrop-blur-sm border-border/40 overflow-hidden' // 기본뷰: 전체 컨테이너에 border
							: 'rounded-lg border backdrop-blur-sm border-border/40 grid auto-rows-min items-stretch overflow-hidden', // 상세뷰: 기존 그리드 레이아웃 + overflow 제어
						className
					)}
					style={{
						gridTemplateColumns: viewMode === 'default' ? undefined : gridTemplateColumns,
						gap: viewMode === 'default' ? 0 : 0,
						// minHeight: '200px', // 최소 높이 설정으로 레이아웃 흔들림 방지
					} as React.CSSProperties}
					{...props}
				>
					{viewMode === 'default' ? (
						// 기본뷰: 내부 그리드 컨테이너 - 세로 모니터에서는 1열, 가로에서는 2열
						<div className="grid grid-cols-1 lg:grid-cols-2 [&>*:last-child]:border-b-0 lg:[&>*:nth-last-child(-n+2)]:border-b-0">
							{children}
						</div>
					) : (
						// 상세뷰: 기존 방식
						children
					)}
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