/* 
  파일명: /components/ui/ui-input/button/Button.tsx
  기능: 뉴모피즘 스타일의 재사용 가능한 버튼 컴포넌트
  책임: 6개의 간소화된 variant로 일관된 UI 경험을 제공하는 기본 버튼 컴포넌트
  
  🎯 Variant 체계:
  - primary: 주요 액션 (저장, 생성, 로그인) - 브랜드 블루
  - secondary: 보조 액션 (취소, 뒤로가기) - 브랜드 퍼플  
  - destructive: 위험 액션 (삭제, 제거) - 빨강
  - outline: 중성 액션 (검색, 필터, 리셋) - 회색 테두리
  - ghost: 최소 액션 (취소, 초기화) - 투명 배경
  - link: 링크/네비게이션 - 브랜드 블루 텍스트
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
				primary: 'neu-raised bg-primary text-primary-foreground hover:scale-[1.02]',
				secondary: 'neu-raised bg-secondary text-secondary-foreground hover:scale-[1.02]',
				destructive: 'neu-raised bg-destructive text-destructive-foreground hover:scale-[1.02]',
				outline: 'neu-flat border border-border bg-background text-foreground hover:bg-muted/50',
				ghost: 'neu-flat hover:bg-muted text-foreground neu-hover',
				link: 'text-primary underline-offset-4 hover:underline hover:text-accent transition-colors',
			},
			size: {
				default: 'h-9 px-4 py-2',
				sm: 'h-8 rounded-md px-3 text-xs',
				lg: 'h-10 rounded-md px-8',
				icon: 'h-9 w-9',
			},
		},
		defaultVariants: {
			variant: 'primary',
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
