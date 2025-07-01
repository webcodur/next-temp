import * as React from 'react';
import { cn } from '@/lib/utils';

// #region 카드 기본 컴포넌트
const Card = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		variant?: 'default' | 'outline-solid' | 'elevated';
		hoverEffect?: boolean;
	}
>(({ className, variant = 'default', hoverEffect = false, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			'rounded-lg bg-card text-card-foreground',
			variant === 'default' && 'neu-flat',
			variant === 'outline-solid' && 'neu-flat border-2',
			variant === 'elevated' && 'neu-raised',
			hoverEffect && 'neu-raised',
			className
		)}
		{...props}
	/>
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('flex flex-col space-y-1.5 p-6', className)}
		{...props}
	/>
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn(
			'text-2xl font-semibold leading-none tracking-tight',
			className
		)}
		{...props}
	/>
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn('text-sm text-muted-foreground', className)}
		{...props}
	/>
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('flex items-center p-6 pt-0', className)}
		{...props}
	/>
));
CardFooter.displayName = 'CardFooter';
// #endregion

// #region 카드 확장 컴포넌트
const CardActions = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('absolute top-2 right-2 flex space-x-1', className)}
		{...props}
	/>
));
CardActions.displayName = 'CardActions';

const CardAction = React.forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
	<button
		ref={ref}
		className={cn(
			'neu-raised inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-sm text-muted-foreground backdrop-blur-xs',
			className
		)}
		{...props}
	/>
));
CardAction.displayName = 'CardAction';

const CardBadge = React.forwardRef<
	HTMLSpanElement,
	React.HTMLAttributes<HTMLSpanElement> & {
		variant?:
			| 'default'
			| 'primary'
			| 'secondary'
			| 'success'
			| 'warning'
			| 'danger';
	}
>(({ className, variant = 'default', ...props }, ref) => (
	<span
		ref={ref}
		className={cn(
			'inline-flex h-6 items-center rounded-full px-2 text-xs font-medium',
			variant === 'default' && 'bg-muted text-muted-foreground',
			variant === 'primary' && 'bg-primary text-primary-foreground',
			variant === 'secondary' && 'bg-secondary text-secondary-foreground',
			variant === 'success' && 'bg-success/10 text-success',
			variant === 'warning' && 'bg-warning/10 text-warning',
			variant === 'danger' && 'bg-destructive/10 text-destructive',
			className
		)}
		{...props}
	/>
));
CardBadge.displayName = 'CardBadge';
// #endregion

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardDescription,
	CardContent,
	CardActions,
	CardAction,
	CardBadge,
};
