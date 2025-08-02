/* 
  파일명: /components/ui/ui-input/button/Button.tsx
  기능: 뉴모피즘 스타일의 재사용 가능한 버튼 컴포넌트
  책임: 다양한 variant와 size를 제공하는 UI 시스템의 기본 버튼 컴포넌트
*/

import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// cusror: pointer 추가

// #region 타입 및 스타일
const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-multilang font-medium transition-all duration-150 ease-in-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer',
	{
		variants: {
			variant: {
				default: 'neu-raised bg-primary text-primary-foreground hover:scale-[1.02]',
				destructive: 'neu-raised bg-destructive text-destructive-foreground hover:scale-[1.02]',
				success: 'neu-raised bg-success text-success-foreground hover:scale-[1.02]',
				warning: 'neu-raised bg-warning text-warning-foreground hover:scale-[1.02]',
				accent: 'neu-raised bg-accent text-accent-foreground hover:scale-[1.02]',
				primary: 'neu-raised bg-primary text-primary-foreground hover:scale-[1.02]',
				secondary: 'neu-raised bg-secondary text-secondary-foreground hover:scale-[1.02]',
				outline: 'neu-flat border border-border bg-background text-foreground hover:bg-muted/50',
				'outline-primary': 'neu-flat border border-primary/50 bg-background  hover:bg-primary/10',
				'outline-secondary': 'neu-flat border border-secondary/50 bg-background  hover:bg-secondary/10',
				'primary-secondary': 'neu-raised bg-gradient-to-r from-primary to-secondary hover:scale-[1.02] hover:from-primary-hover hover:to-secondary-hover',
				ghost: 'neu-flat hover:bg-muted text-foreground neu-hover',
				link: 'text-primary underline-offset-4 hover:underline hover:text-accent transition-colors',
				inset: 'neu-inset bg-muted hover:bg-muted/80',
			},
			size: {
				default: 'h-9 px-4 py-2',
				sm: 'h-8 rounded-md px-3 text-xs',
				lg: 'h-10 rounded-md px-8',
				icon: 'h-9 w-9',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	icon?: React.ComponentType<{ className?: string }>;
	loading?: boolean;
}
// #endregion

// #region 컴포넌트
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, icon: Icon, loading, children, disabled, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				disabled={disabled || loading}
				{...props}
			>
				{Icon && <Icon className="w-4 h-4" />}
				{children}
			</Comp>
		);
	}
);
Button.displayName = 'Button';
// #endregion

export { Button, buttonVariants };
