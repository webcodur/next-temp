/* 
  파일명: /components/ui/ui-input/button/Button.tsx
  기능: 뉴모피즘 스타일의 재사용 가능한 버튼 컴포넌트
  책임: 상태별 인터랙션이 적용된 일관된 UI 경험을 제공하는 기본 버튼 컴포넌트
  
  ⚡ 주요 기능:
  - loading 상태 지원 (자동 스피너 아이콘, 비활성화, 접근성)
  - icon 지원 (loading 시 스피너로 자동 교체)
  - 완전한 접근성 (aria-disabled, aria-label)
  - loadingText 지원 (로딩 중 텍스트 변경)
  
  🎯 Variant 체계:
  - primary: 주요 액션 (저장, 생성, 로그인) - 브랜드 블루
  - secondary: 보조 액션 (취소, 뒤로가기) - 브랜드 퍼플  
  - destructive: 위험 액션 (삭제, 제거) - 빨강
  - outline: 중성 액션 (검색, 필터, 리셋) - 회색 테두리
  - ghost: 최소 액션 (취소, 초기화) - 투명 배경
  - link: 링크/네비게이션 - 브랜드 블루 텍스트
  
  📝 상태별 스타일링 완전 가이드:
  
  🔧 상태별 인터랙션:
  1. 기본 상태 (default): 각 variant의 기본 스타일
  2. 호버 상태 (hover:): 마우스 오버 시 즉각적인 시각적 피드백
    - 뉴모피즘: hover:scale-[1.02] hover:shadow-neu-lg
    - 플랫: hover:bg-color/transparency hover:border-color
  3. 액티브 상태 (active:): 클릭/터치 시점의 눌린 상태
    - 뉴모피즘: active:neu-inset active:scale-100
    - 플랫: active:bg-color/transparency active:scale-[0.98]
  4. 포커스 상태 (focus-visible:): 키보드 내비게이션 시 접근성
    - 공통: focus-visible:ring-2 focus-visible:ring-ring
    - 개별: focus-visible:ring-primary/20
  5. 비활성 상태 (disabled:): 상호작용 불가능한 상태
    - 기본: disabled:pointer-events-none disabled:opacity-50
    - 추가: disabled:bg-color disabled:text-color
  
  💡 커스터마이징 방법:
  - 각 variant 클래스 문자열에서 상태별 클래스 추가/수정
  - 새 variant 추가: info: 'neu-raised bg-blue-500 text-white hover:scale-[1.02] active:neu-inset'
  - 트랜지션 조정: transition-all duration-150 ease-in-out (기본값)
  
  ⚠️ 주의사항:
  - neu-* 클래스는 뉴모피즘 스타일 (CSS 변수 기반)
  - scale 효과는 즉각적인 피드백용, 접근성 필수 포함
*/

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// #region 타입 및 스타일
const buttonVariants = cva(
	// 기본 공통 스타일: 레이아웃, 타이포그래피, 전환, 접근성
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-multilang font-medium transition-all duration-150 ease-in-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer min-w-20',
	{
		variants: {
			variant: {
				// 주요 액션: 뉴모피즘 raised → 호버 시 확대 → 액티브 시 inset
				primary: 'neu-raised bg-primary text-primary-foreground hover:scale-[1.02] hover:shadow-neu-lg active:neu-inset active:scale-100',
				
				// 눌린 상태: inset 효과로 눌린 상태 표현
				pressed: 'neu-inset text-foreground bg-muted',
				
				// 보조 액션: 퍼플 계열, primary와 동일한 상호작용
				secondary: 'neu-raised bg-secondary text-secondary-foreground hover:scale-[1.02] hover:shadow-neu-lg active:neu-inset active:scale-100',
				
				// 위험 액션: 빨강 계열, 호버 시 더 진한 빨강
				destructive: 'neu-raised bg-destructive text-destructive-foreground hover:scale-[1.02] hover:bg-destructive/90 active:neu-inset active:scale-100',
				
				// 아웃라인: 테두리만, 호버 시 배경 추가
				outline: 'neu-raised border border-border bg-background text-foreground hover:bg-muted/50 hover:border-muted-foreground/20 active:bg-muted/80 active:scale-[0.98]',
				
				// 고스트: 최소 스타일, 호버 시에만 배경 표시
				ghost: 'neu-flat text-foreground hover:bg-muted/60 hover:neu-hover active:bg-muted/80 active:scale-[0.98]',
				
				// 링크: 텍스트만, 언더라인 효과
				link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80 active:text-primary/60 focus-visible:ring-primary/20',
			},
			size: {
				default: 'h-9 px-4 py-2',
				sm: 'h-8 rounded-md px-3 text-xs',
				lg: 'h-10 rounded-md px-8',
				icon: 'h-9 w-9 min-w-9',
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
	loadingText?: string;
}
// #endregion

// #region 컴포넌트
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, icon: Icon, loading, loadingText, children, disabled, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';
		const isDisabled = disabled || loading;
		
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				disabled={isDisabled}
				aria-disabled={isDisabled}
				aria-label={loading ? loadingText || '로딩 중...' : props['aria-label']}
				{...props}
			>
				{/* 로딩 중일 때 스피너, 아닐 때 아이콘 */}
				{loading ? (
					<Loader2 className="w-4 h-4 animate-spin" />
				) : (
					Icon && <Icon className="w-4 h-4" />
				)}
				{/* 로딩 텍스트가 있으면 표시, 없으면 기본 children */}
				{loading && loadingText ? loadingText : children}
			</Comp>
		);
	}
);
Button.displayName = 'Button';
// #endregion

export { Button, buttonVariants };
