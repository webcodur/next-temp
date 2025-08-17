/*
  파일명: PageHeader.tsx
  기능: 페이지 상단에 표시되는 헤더 컴포넌트
  책임: 페이지 제목과 좌우측 액션 버튼들을 포함하는 헤더 영역을 제공한다

  사용 예시:
  <PageHeader 
    title="IP 차단 전체 히스토리" 
    subtitle="비정상적인 방식으로 허브에 접속하다가 차단된 모든 IP를 검색 조회합니다."
    rightActions={<Button>검색</Button>}
  />
*/

'use client';

import React from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/ui-input/button/Button';
import { ArrowLeft } from 'lucide-react';
import { useBackNavigation } from '@/hooks/useBackNavigation';

// #region 타입
export interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
	title: string;
	subtitle?: string;
	rightActions?: ReactNode;
}
// #endregion

export default function PageHeader({
	title,
	subtitle,
	rightActions,
	children,
	className,
	...props
}: PageHeaderProps) {
	// 뒤로가기 기능
	const { handleBack } = useBackNavigation();
	
	// children이 있으면 rightActions로 처리 (하위 호환성)
	const finalRightActions = rightActions || children;

	// #region 렌더링
	return (
		<div
			className={cn('flex relative items-start', className)}
			{...props}
		>
			{/* 좌측 영역 - 뒤로가기 버튼 */}
			<div className="flex absolute bottom-0 left-0 gap-2 items-center">
				<Button
					variant="ghost"
					size="sm"
					onClick={handleBack}
					title="뒤로가기"
				>
					<ArrowLeft className="w-4 h-4" />
				</Button>
			</div>

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
			
			{/* 우측 영역 - 서브타이틀 라인에 정렬 */}
			{finalRightActions && (
				<div className="flex absolute right-0 bottom-0 gap-2 items-center">
					{finalRightActions}
				</div>
			)}
		</div>
	);
	// #endregion
} 