/*
  파일명: PageHeader.tsx
  기능: 페이지 상단에 표시되는 헤더 컴포넌트
  책임: 페이지 제목과 우측 액션 버튼들을 포함하는 헤더 영역을 제공한다
*/

'use client';

import React from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// #region 타입
export interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
	/** 페이지의 메인 제목 */
	title: string;
	/** 제목 아래 표시될 선택적 부제목 */
	subtitle?: string;
	/** 우측에 표시될 액션 버튼들 */
	children?: ReactNode;
}
// #endregion

export default function PageHeader({
	title,
	subtitle,
	children,
	className,
	...props
}: PageHeaderProps) {
	// #region 렌더링
	return (
		<div
			className={cn(
				'flex gap-4 justify-between items-start mb-6',
				className
			)}
			{...props}
		>
			{/* 제목 영역 */}
			<div className="space-y-1">
				<h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
					{title}
				</h1>
				
				{subtitle && (
					<p className="text-sm text-[hsl(var(--muted-foreground))]">
						{subtitle}
					</p>
				)}
			</div>
			
			{/* 액션 버튼 영역 */}
			{children && (
				<div className="flex gap-2 items-center shrink-0">
					{children}
				</div>
			)}
		</div>
	);
	// #endregion
} 