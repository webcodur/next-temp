/*
  파일명: PageHeader.tsx
  기능: 페이지 상단에 표시되는 헤더 컴포넌트
  책임: 페이지 제목과 좌우측 액션 버튼들을 포함하는 헤더 영역을 제공한다
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
	/** 좌측에 표시될 액션 버튼들 (주로 뒤로가기) */
	leftActions?: ReactNode;
	/** 우측에 표시될 액션 버튼들 */
	rightActions?: ReactNode;
	/** @deprecated children은 rightActions를 사용하세요 */
	children?: ReactNode;
}
// #endregion

export default function PageHeader({
	title,
	subtitle,
	leftActions,
	rightActions,
	children,
	className,
	...props
}: PageHeaderProps) {
	// children이 있으면 rightActions로 처리 (하위 호환성)
	const finalRightActions = rightActions || children;

	// #region 렌더링
	return (
		<div
			className={cn('flex relative items-start mb-3', className)}
			{...props}
		>
			{/* 좌측 액션 버튼 영역 - 서브타이틀 라인에 정렬 */}
			{leftActions && (
				<div className="flex absolute bottom-0 left-0 gap-2 items-center">
					{leftActions}
				</div>
			)}

			{/* 제목 영역 - 전체 너비 차지 & 중앙 정렬 */}
			<div className="space-y-3 w-full">
				<h1 className="text-2xl font-bold text-center text-foreground">
					{title}
				</h1>
				{subtitle && (
					<p className="text-center text-md text-foreground">
						{subtitle}
					</p>
				)}
			</div>
			
			{/* 우측 액션 버튼 영역 - 서브타이틀 라인에 정렬 */}
			{finalRightActions && (
				<div className="flex absolute right-0 bottom-0 gap-2 items-center">
					{finalRightActions}
				</div>
			)}
		</div>
	);
	// #endregion
} 