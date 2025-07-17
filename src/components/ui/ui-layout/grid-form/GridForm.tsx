'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// #region 타입 정의
export interface GridFormProps {
	labelWidth?: string;
	gap?: string;
	maxWidth?: string;
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
	labelWidth = '150px',
	gap = '20px',
	maxWidth = '800px',
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
				maxWidth,
			}}
			{...props}
		>
			<div
				className="grid items-start"
				style={{
					gridTemplateColumns: `${labelWidth} 1fr`,
					gap,
				}}
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
	children,
}) => {
	const alignClasses = {
		start: 'items-start',
		center: 'items-center',
		end: 'items-end',
	};

	return (
		<>
			{React.Children.map(children, (child) => {
				if (React.isValidElement(child)) {
					// 라벨인 경우
					if (child.type === GridFormLabel) {
						return React.cloneElement(child, {
							className: cn(
								'justify-self-start',
								alignClasses[align],
								(child.props as { className?: string }).className
							),
						} as Partial<GridFormLabelProps>);
					}
					// 컨텐츠인 경우
					if (child.type === GridFormContent) {
						return React.cloneElement(child, {
							className: cn(
								'justify-self-stretch',
								alignClasses[align],
								(child.props as { className?: string }).className
							),
						} as Partial<GridFormContentProps>);
					}
				}
				return child;
			})}
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
				'text-sm font-medium text-foreground',
				'flex items-center py-2 font-multilang',
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
				'flex',
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