import * as React from 'react';
import { cn } from '@/lib/utils';

// #region 카드 기본 컴포넌트
const Card = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		variant?: 'default' | 'outline' | 'elevated';
		hoverEffect?: boolean;
	}
>(({ className, variant = 'default', hoverEffect = false, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			'rounded-lg border bg-card text-card-foreground transition-all duration-200',
			variant === 'default' && 'shadow-sm',
			variant === 'outline' && 'border-2',
			variant === 'elevated' && 'shadow-md',
			hoverEffect && 'hover:shadow-lg hover:-translate-y-1',
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
			'inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-sm text-muted-foreground backdrop-blur-sm transition-colors hover:bg-background hover:text-foreground',
			className
		)}
		{...props}
	/>
));
CardAction.displayName = 'CardAction';

const CardImage = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & { src: string; alt?: string }
>(({ className, src, alt = '', ...props }, ref) => (
	<div
		ref={ref}
		className={cn('relative overflow-hidden rounded-t-lg', className)}
		{...props}
	>
		<img
			src={src}
			alt={alt}
			className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
		/>
	</div>
));
CardImage.displayName = 'CardImage';

const CardBadge = React.forwardRef<
	HTMLSpanElement,
	React.HTMLAttributes<HTMLSpanElement> & {
		variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
	}
>(({ className, variant = 'default', ...props }, ref) => (
	<span
		ref={ref}
		className={cn(
			'inline-flex h-6 items-center rounded-full px-2 text-xs font-medium',
			variant === 'default' && 'bg-muted text-muted-foreground',
			variant === 'primary' && 'bg-primary text-primary-foreground',
			variant === 'secondary' && 'bg-secondary text-secondary-foreground',
			variant === 'success' && 'bg-green-100 text-green-800',
			variant === 'warning' && 'bg-yellow-100 text-yellow-800',
			variant === 'danger' && 'bg-red-100 text-red-800',
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
	CardImage,
	CardBadge,
}; 