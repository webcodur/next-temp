'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// #region 타입 정의
export interface GridFormProps {
	labelWidth?: string;  // 옵션 프롭 (필수 아님)
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
// #endregion

// #region GridForm 메인 컴포넌트
const GridForm = React.forwardRef<
	HTMLDivElement,
	GridFormProps & React.HTMLAttributes<HTMLDivElement>
>(({
	labelWidth = '200px',  // 기본값 설정
	className,
	children,
	...props
}, ref) => {
	return (
		<div
			ref={ref}
			className={cn(
				'mx-auto w-full',
				className
			)}
			style={{
				'--label-width': labelWidth,  // CSS 변수로 적용
			} as React.CSSProperties}
			{...props}
		>
			<div
				className="overflow-hidden rounded-lg border backdrop-blur-sm border-border/40 bg-background/80"
			>
				{children}
			</div>
		</div>
	);
});

GridForm.displayName = 'GridForm';
// #endregion

// #region GridForm.Row 컴포넌트
const GridFormRow: React.FC<GridFormRowProps> = ({
	align = 'center',
	className,
	children,
}) => {
	const alignClasses = {
		start: 'items-start',
		center: 'items-center',
		end: 'items-end',
	};

	return (
		<div
			className={cn(
				'grid',
				'border-b border-border/20 last:border-b-0',
				// 얼룩말 효과 - 홀수 행
				'odd:bg-background/50',
				// 얼룩말 효과 - 짝수 행
				'even:bg-muted/30',
				'hover:bg-muted/50',
				alignClasses[align],
				className
			)}
			style={{
				gridTemplateColumns: 'var(--label-width) 1fr',
			}}
		>
			{React.Children.map(children, (child) => {
				if (React.isValidElement(child)) {
					// 라벨인 경우
					if (child.type === GridFormLabel) {
						return React.cloneElement(child as React.ReactElement<GridFormLabelProps>, {
							className: cn(
								'justify-self-start',
								alignClasses[align],
								(child.props as GridFormLabelProps)?.className
							),
						});
					}
					// 컨텐츠인 경우
					if (child.type === GridFormContent) {
						return React.cloneElement(child as React.ReactElement<GridFormContentProps>, {
							className: cn(
								'justify-self-stretch',
								alignClasses[align],
								(child.props as GridFormContentProps)?.className
							),
						});
					}
				}
				return child;
			})}
		</div>
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
				'text-sm font-medium text-foreground',
				'flex items-center px-4 py-3 font-multilang',
				'border-r border-border/40',
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
				'flex px-4 py-3',
				directionClasses[direction],
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

// #region Compound Components 구성
const CompoundGridForm = Object.assign(GridForm, {
	Row: GridFormRow,
	Label: GridFormLabel,
	Content: GridFormContent,
});

export default CompoundGridForm;
// #endregion 