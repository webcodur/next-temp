'use client';

import React, { createContext } from 'react';
import { cn } from '@/lib/utils';

// #region Context 정의
interface GridFormContextValue {
	sequenceWidth: string;
	labelWidth: string;
	gap: string;
	colorVariant: 'primary' | 'secondary';
	totalCount: number;
	getNextSequence: () => number;
}

const GridFormContext = createContext<GridFormContextValue | null>(null);

// #endregion

// #region 타입 정의
export interface GridFormProps {
	sequenceWidth?: string;
	labelWidth?: string;  // 옵션 프롭 (필수 아님)
	gap?: string;
	colorVariant?: 'primary' | 'secondary';
	className?: string;
	children: React.ReactNode;
	topRightActions?: React.ReactNode;
	bottomLeftActions?: React.ReactNode;
	bottomRightActions?: React.ReactNode;
}

export interface GridFormRowProps {
	align?: 'start' | 'center' | 'end';
	className?: string;
	children: React.ReactNode;
}

export interface GridFormSequenceProps {
    sequence: number;
    total?: number;
    className?: string;
}

export interface GridFormLabelProps {
	required?: boolean;
	htmlFor?: string;
	className?: string;
	children: React.ReactNode;
}

export interface GridFormContentProps {
	direction?: 'column' | 'row';
	gap?: string;
	className?: string;
	children: React.ReactNode;
}

export interface GridFormFeedbackProps {
	type?: 'info' | 'success' | 'warning' | 'error';
	className?: string;
	children: React.ReactNode;
}
// #endregion

// #region GridForm 메인 컴포넌트
const GridForm = React.forwardRef<
	HTMLDivElement,
	GridFormProps & React.HTMLAttributes<HTMLDivElement>
>(({
	sequenceWidth = '60px',
	labelWidth = '300px',  // 기본값 설정
	gap = '20px',
	colorVariant = 'primary',
	className,
	children,
	topRightActions,
	bottomLeftActions,
	bottomRightActions,

	...props
}, ref) => {
	// 단순화를 위해 총 개수 계산은 생략 (조건부/프래그먼트에도 안전)
	const totalCount = 0;
	
	// 간단한 시퀀스 카운터: 각 Row에서 컨텍스트의 getNextSequence를 호출해 가져가게 함
	const sequenceCounterRef = React.useRef(0);
	sequenceCounterRef.current = 0; // 렌더마다 초기화
	const getNextSequence = React.useCallback(() => {
		sequenceCounterRef.current += 1;
		return sequenceCounterRef.current;
	}, []);
	
	const gridTemplateColumns = `${sequenceWidth} ${labelWidth} 1fr`;

	return (
		<GridFormContext.Provider value={{ 
			sequenceWidth, 
			labelWidth, 
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

	// Label과 Content를 찾아서 직접 렌더링
	let labelElement: React.ReactElement | null = null;
	let contentElement: React.ReactElement | null = null;

	React.Children.forEach(children, (child) => {
		if (React.isValidElement(child)) {
			if (child.type === GridFormLabel) {
				labelElement = React.cloneElement(child as React.ReactElement<GridFormLabelProps>, {
					className: cn(
						// 박스 스타일링 - 시작 정렬 (세로는 중앙, 가로는 시작)
						'flex items-center justify-start px-4 py-2',
						'bg-muted/30 border-r border-b border-border/40',
						'font-medium text-base text-foreground text-start',
						// 높이 맞춤
						'min-h-full',
						// 마지막 요소의 하단 테두리 제거 (라벨)
						'last:border-b-0',
						alignClasses[align],
						(child.props as GridFormLabelProps)?.className
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
		</>
	);
};

GridFormRow.displayName = 'GridFormRow';
// #endregion

// #region GridForm.Sequence 컴포넌트
const GridFormSequence = React.forwardRef<
	HTMLDivElement,
	GridFormSequenceProps & React.HTMLAttributes<HTMLDivElement>
>(({
    sequence,
    total,
	className,
	...props
}, ref) => {
	return (
		<div
			ref={ref}
			className={cn(
				'flex justify-center items-center px-2 py-2',
				'border-r bg-muted/20 border-border/40',
				'text-sm font-medium text-muted-foreground',
				'min-h-full',
				className
			)}
			{...props}
        >
            {typeof total === 'number' && total > 0 ? `${sequence}/${total}` : sequence}
		</div>
	);
});

GridFormSequence.displayName = 'GridFormSequence';
// #endregion

// #region GridForm.Label 컴포넌트
const GridFormLabel = React.forwardRef<
	HTMLLabelElement,
	GridFormLabelProps & React.LabelHTMLAttributes<HTMLLabelElement>
>(({
	required = false,
	className,
	children,
	...props
}, ref) => {
	return (
		<label
			ref={ref}
			className={cn(
				'text-base font-medium text-foreground',
				'flex justify-start items-center px-4 py-2 font-multilang',
				'border-r text-start border-border/40',
				className
			)}
			{...props}
		>
			{children}
			{required && (
				<span className="ml-1 text-destructive" aria-label="필수">
					*
				</span>
			)}
		</label>
	);
});

GridFormLabel.displayName = 'GridFormLabel';
// #endregion

// #region GridForm.Content 컴포넌트
const GridFormContent = React.forwardRef<
	HTMLDivElement,
	GridFormContentProps & React.HTMLAttributes<HTMLDivElement>
>(({
	direction = 'column',
	gap = '12px',
	className,
	children,
	...props
}, ref) => {
	const directionClasses = {
		column: 'flex-col',
		row: 'flex-row flex-wrap',
	};

	return (
		<div
			ref={ref}
			className={cn(
				'flex px-4 py-2 min-h-full',
				directionClasses[direction],
				// direction이 column일 때는 justify-center, row일 때는 items-center
				direction === 'column' ? 'justify-center' : 'items-center',
				className
			)}
			style={{
				gap,
			}}
			{...props}
		>
			{children}
		</div>
	);
});

GridFormContent.displayName = 'GridFormContent';
// #endregion

// #region GridForm.Feedback 컴포넌트
const GridFormFeedback = React.forwardRef<
	HTMLDivElement,
	GridFormFeedbackProps & React.HTMLAttributes<HTMLDivElement>
>(({
	type = 'info',
	className,
	children,
	...props
}, ref) => {
	const context = React.useContext(GridFormContext);
	const colorVariant = context?.colorVariant || 'primary';
	
	const successColor = colorVariant === 'primary' ? '[&_svg]:text-primary' : '[&_svg]:text-secondary';
	
	const iconColorClasses = {
		info: '[&_svg]:text-muted-foreground',
		success: successColor,
		warning: '[&_svg]:text-warning',
		error: '[&_svg]:text-destructive',
	};

	return (
		<div
			ref={ref}
			className={cn(
				'mt-2 text-sm font-multilang text-gray-900', // 텍스트는 진한 블랙, 위쪽 마진 추가
				iconColorClasses[type], // 아이콘만 색상 적용
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
});

GridFormFeedback.displayName = 'GridFormFeedback';
// #endregion

// #region Compound Components 구성
const CompoundGridForm = Object.assign(GridForm, {
	Row: GridFormRow,
	Sequence: GridFormSequence,
	Label: GridFormLabel,
	Content: GridFormContent,
	Feedback: GridFormFeedback,
});

export default CompoundGridForm;
// #endregion 