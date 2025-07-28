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
				'flex relative items-start',
				className
			)}
			{...props}
		>
			{/* 제목 영역 - 전체 너비를 차지하며 중앙 정렬 */}
			<div className="space-y-3 w-full">
				<h1 className="text-2xl font-bold text-[hsl(var(--foreground))] text-center">
					{title}
				</h1>
				{subtitle && (
					<p className="text-center text-md text-foreground">
						{subtitle}
					</p>
				)}
			</div>
			
			{/* 액션 버튼 영역 - 서브타이틀 위치 기준으로 정렬 */}
			{children && (
				<div 
					className={cn(
						"absolute right-0 flex gap-2 items-center",
						subtitle 
							? "bottom-0" // 서브타이틀이 있으면 서브타이틀 라인에 맞춤
							: "top-1/2 -translate-y-1/2" // 서브타이틀이 없으면 타이틀 중앙에 맞춤
					)}
				>
					{children}
				</div>
			)}
		</div>
	);
	// #endregion
} 