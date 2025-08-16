'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { GridFormContext } from './context';
import type { GridFormRowProps, GridFormLabelProps, GridFormRulesProps, GridFormContentProps } from './types';
import GridFormSequence from './GridFormSequence';
import GridFormLabel from './GridFormLabel';
import GridFormContent from './GridFormContent';
import GridFormRules from './GridFormRules';
import GridFormRulesModal from './GridFormRulesModal';
import { Info } from 'lucide-react';

// #region GridForm.Row 컴포넌트
const GridFormRow: React.FC<GridFormRowProps & React.HTMLAttributes<HTMLDivElement>> = ({
	align = 'center',
	children,
}) => {
	const context = React.useContext(GridFormContext);
	const viewMode = context?.viewMode || 'default';
	const totalCount = context?.totalCount || 0;
	const sequence = context?.getNextSequence ? context.getNextSequence() : undefined;
	const columnIndex = context?.getCurrentColumnIndex ? context.getCurrentColumnIndex() : 0;
	const columnLabelWidths = context?.columnLabelWidths || [];
	const currentColumnLabelWidth = columnLabelWidths[columnIndex] || 'auto';
	
	// 기본뷰에서 border 처리를 위한 위치 정보
	const isRightColumn = columnIndex === 1; // 우측 열인지
	
	// 룰 모달 상태
	const [isRulesModalOpen, setIsRulesModalOpen] = React.useState(false);
	
	const alignClasses = {
		start: 'self-start',
		center: 'self-center',
		end: 'self-end',
	};

	// Label, Rules, Content를 찾아서 직접 렌더링
	let labelElement: React.ReactElement<GridFormLabelProps> | null = null;
	let rulesElement: React.ReactElement<GridFormRulesProps> | null = null;
	let contentElement: React.ReactElement<GridFormContentProps> | null = null;
	let labelText = ''; // 모달 제목용

	React.Children.forEach(children, (child) => {
		if (React.isValidElement(child)) {
			if (child.type === GridFormLabel) {
				// 라벨 텍스트 추출 (모달 제목용)
				labelText = typeof (child.props as GridFormLabelProps).children === 'string' 
					? (child.props as GridFormLabelProps).children as string
					: '필드';
					
				labelElement = React.cloneElement(child as React.ReactElement<GridFormLabelProps>, {
					className: cn(
						// 박스 스타일링 - 가운데 정렬 (세로는 중앙, 가로는 가운데)
						'flex items-center justify-center px-4 py-2',
						'bg-muted/30 border-r border-b border-border/40',
						'font-medium text-base text-foreground text-center',
						// 높이 맞춤
						'min-h-full whitespace-nowrap', // 개행 방지
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

	// 뷰 모드별 렌더링
	if (viewMode === 'default') {
		// 기본뷰: 2열 구조 [필드명 - 필드값] (순서, 룰 숨김) - 행당 2개씩 표시
		// border는 구분선만 적용
		return (
			<div 
				className={cn(
					'grid',
					// 하단 border: 항상 적용 (CSS로 마지막 행 제거)
					'border-b border-border/40',
					// 우측 border: 좌측 열인 경우만 (lg 이상에서)
					!isRightColumn && 'lg:border-r lg:border-border/40'
				)}
				style={{
					gridTemplateColumns: `${currentColumnLabelWidth} 1fr`
				}}
			>
				{labelElement && (
					<div className={cn(
						'flex items-center justify-start px-3 py-2',
						'bg-muted/30 border-r border-border/40',
						'font-medium text-sm text-foreground',
						'min-h-full whitespace-nowrap', // 개행 방지
						alignClasses[align]
					)}>
						{(labelElement as React.ReactElement<GridFormLabelProps>)?.props.children}
					</div>
				)}
				{contentElement && (
					<div className={cn(
						'px-3 py-2 bg-background',
						'min-h-full',
						alignClasses[align]
					)}>
						{(contentElement as React.ReactElement<GridFormContentProps>)?.props.children}
					</div>
				)}
			</div>
		);
	}

	// 상세뷰: 4열 구조 [순서 - 필드명 - 필드값 - 룰]
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
			
			{/* 룰 열: 세로 모니터에서는 작은 버튼, 가로에서는 기존 방식 */}
			{rulesElement ? (
				<div className="flex justify-center items-center px-2 py-2 border-b border-border/40 last:border-b-0 bg-muted/10">
					{/* lg 이상: 기존 룰 표시 */}
					<div className="hidden justify-start items-center px-2 w-full min-h-full text-sm lg:flex text-muted-foreground text-start">
						{rulesElement && (rulesElement as React.ReactElement<GridFormRulesProps>).props.children}
					</div>
					
					{/* lg 미만: 작은 정보 버튼 */}
					<button
						type="button"
						onClick={() => setIsRulesModalOpen(true)}
						className="flex justify-center items-center w-6 h-6 rounded-sm transition-colors cursor-pointer lg:hidden text-muted-foreground hover:text-foreground hover:bg-muted/50"
						title="입력 규칙 보기"
					>
						<Info size={14} />
					</button>
				</div>
			) : (
				// 룰이 없는 경우 빈 셀
				<div className="border-b border-border/40 last:border-b-0 bg-muted/10" />
			)}
			
			{/* 룰 모달 */}
			{rulesElement && (
				<GridFormRulesModal
					isOpen={isRulesModalOpen}
					onClose={() => setIsRulesModalOpen(false)}
					title={labelText}
					rules={rulesElement && (rulesElement as React.ReactElement<GridFormRulesProps>).props.children}
				/>
			)}
		</>
	);
};

GridFormRow.displayName = 'GridFormRow';
// #endregion

export default GridFormRow;
