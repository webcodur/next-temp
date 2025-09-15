/*
  파일명: PageHeader.tsx
  기능: 페이지 상단에 표시되는 헤더 컴포넌트
  책임: 페이지 제목과 좌우측 액션 버튼들을 포함하는 헤더 영역을 제공한다
      상세/편집/생성 페이지에서는 자동으로 "목록으로" 버튼을 추가한다

  📱 반응형 버튼:
  - xl 이상: 아이콘 + 텍스트, 적절한 너비
  - xl 미만: 아이콘만, 40px × 40px 정사각형 (CrudButton과 동일한 규격)

  사용 예시:
  <PageHeader 
    title="IP 차단 전체 히스토리" 
    subtitle="비정상적인 방식으로 허브에 접속하다가 차단된 모든 IP를 검색 조회합니다."
    rightActions={<Button>검색</Button>}
    hasChanges={hasUnsavedChanges} // 선택사항: 수정사항이 있을 때 확인창 표시
  />
*/

'use client';

import React from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/ui-input/button/Button';
import { ArrowLeft, List } from 'lucide-react';
import { useBackNavigation } from '@/hooks/useBackNavigation';
import { useListNavigation } from '@/hooks/ui-hooks/useListNavigation';
import { useTranslations } from '@/hooks/ui-hooks/useI18n';

// #region 타입
export interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
	title: string;
	subtitle?: string;
	rightActions?: ReactNode;
	hasChanges?: boolean; // 수정사항 존재 여부 (목록으로 이동 시 확인용)
}
// #endregion

export default function PageHeader({
	title,
	subtitle,
	rightActions,
	hasChanges = false,
	children,
	className,
	...props
}: PageHeaderProps) {
	// 다국어 번역 함수
	const t = useTranslations();
	
	// 뒤로가기 기능
	const { handleBack } = useBackNavigation({ hasChanges });
	
	// 목록으로 이동 기능
	const { shouldShowList, handleGoToList, listPageTitle } = useListNavigation({ hasChanges });
	
	// children이 있으면 rightActions로 처리 (하위 호환성)
	const finalRightActions = rightActions || children;

	// #region 렌더링
	return (
		<div
			className={cn('flex relative items-start', className)}
			{...props}
		>
			{/* 좌측 영역 - 네비게이션 버튼들 */}
			<div className="flex absolute bottom-0 gap-2 items-center start-0">
				<Button
					variant="primary"
					size="sm"
					onClick={handleBack}
					title={t('뒤로가기')}
					className="px-0 w-10 min-w-0 h-10 xl:w-auto xl:min-w-20 xl:px-4"
				>
					<ArrowLeft className="w-5 h-5" />
					<span className="hidden xl:inline">{t('뒤로가기')}</span>
				</Button>
				
				{/* 상세/편집/생성 페이지에서만 목록으로 버튼 표시 */}
				{shouldShowList && (
					<Button
						variant="outline"
						size="sm"
						onClick={handleGoToList}
						title={t('{title} 목록으로 이동', { title: listPageTitle })}
						className="px-0 w-10 min-w-0 h-10 xl:w-auto xl:min-w-20 xl:px-4"
					>
						<List className="w-5 h-5" />
						<span className="hidden xl:inline">{t('목록으로')}</span>
					</Button>
				)}
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
				<div className="flex absolute bottom-0 gap-2 items-center end-0">
					{finalRightActions}
				</div>
			)}
		</div>
	);
	// #endregion
} 