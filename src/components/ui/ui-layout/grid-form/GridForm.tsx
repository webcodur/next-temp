'use client';

import React, { createContext } from 'react';
import { cn } from '@/lib/utils';

// #region Context 정의
interface GridFormContextValue {
	labelWidth: string;
	gap: string;
	colorVariant: 'primary' | 'secondary';
}

const GridFormContext = createContext<GridFormContextValue | null>(null);

// #endregion

// #region 타입 정의
export interface GridFormProps {
	labelWidth?: string;  // 옵션 프롭 (필수 아님)
	gap?: string;
	colorVariant?: 'primary' | 'secondary';
	className?: string;
	children: React.ReactNode;
}

export interface GridFormRowProps {
	align?: 'start' | 'center' | 'end';
	className?: string;
	children: React.ReactNode;
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
	labelWidth = '300px',  // 기본값 설정
	gap = '20px',
	colorVariant = 'primary',
	className,
	children,
	...props
}, ref) => {
	return (
		<GridFormContext.Provider value={{ labelWidth, gap, colorVariant }}>
			<div
				ref={ref}
				className={cn(
					'w-full overflow-hidden rounded-lg border backdrop-blur-sm border-border/40 bg-background/80',
					'grid auto-rows-min items-stretch', // 전체를 Grid Container로 만들고 items를 stretch
					className
				)}
				style={{
					gridTemplateColumns: `${labelWidth} 1fr`,
					gap: 0, // gap을 0으로 설정하여 테두리가 겹치도록 함
				} as React.CSSProperties}
				{...props}
			>
				{children}
			</div>
		</GridFormContext.Provider>
	);
});

GridForm.displayName = 'GridForm';
// #endregion

// #region GridForm.Row 컴포넌트
const GridFormRow: React.FC<GridFormRowProps> = ({
	align = 'center',
	children,
}) => {
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
			{labelElement}
			{contentElement}
		</>
	);
};

GridFormRow.displayName = 'GridFormRow';
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
	Label: GridFormLabel,
	Content: GridFormContent,
	Feedback: GridFormFeedback,
});

export default CompoundGridForm;
// #endregion 