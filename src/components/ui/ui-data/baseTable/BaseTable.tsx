/* 
  파일명: /components/ui/ui-data/baseTable/BaseTable.tsx
  기능: 순수 테이블 컴포넌트 (A)
  책임: 데이터 렌더링, 정렬, tooltip 기능만 담당
*/ // ------------------------------

'use client';

import React from 'react';
import { useLocale } from '@/hooks/useI18n';
import { cn } from '@/lib/utils';

import { BaseTableProps } from './types';
import { useSortableData } from '../shared/useSortableData';
import { BaseTableHeader } from './BaseTableHeader/BaseTableHeader';
import { BaseTableBody } from './BaseTableBody/BaseTableBody';
import { TooltipProvider } from '@/components/ui/ui-effects/tooltip/Tooltip';

const BaseTable = <T extends Record<string, unknown>>({
	data,
	columns,
	className = '',
	headerClassName = '',
	rowClassName = '',
	cellClassName = '',
	pageSize = 10,
	loadingRows = 5,
	onRowClick,
}: BaseTableProps<T>) => {
	// #region 훅 및 상태
	const { isRTL } = useLocale();
	
	// 정렬 기능
	const {
		sortState,
		sortedData,
		handleSort,
	} = useSortableData({ data });

	// 계산된 값
	const isInitialLoading = data === null;
	// #endregion

	// #region 렌더링
	return (
		<TooltipProvider>
			<div
				className={cn(
					'rounded-lg neu-flat-primary',
					className,
				)}
			>
				{/* 테이블 헤더 */}
				<BaseTableHeader
					columns={columns}
					sortState={sortState}
					onSort={handleSort}
					headerClassName={headerClassName}
					isRTL={isRTL}
				/>

				{/* 테이블 바디 */}
				<BaseTableBody
					data={sortedData}
					columns={columns}
					isInitialLoading={isInitialLoading}
					pageSize={pageSize}
					loadingRows={loadingRows}
					rowClassName={rowClassName}
					cellClassName={cellClassName}
					onRowClick={onRowClick}
					isRTL={isRTL}
				/>
			</div>
		</TooltipProvider>
	);
	// #endregion
};

export { BaseTable };
export type { BaseTableColumn, BaseTableProps } from './types'; 