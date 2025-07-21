/* 
  파일명: /components/ui/ui-data/infiniteTable/InfiniteTable.tsx
  기능: 무한스크롤 테이블 컴포넌트 (A+x)
  책임: BaseTable + 무한스크롤 기능 조합
*/ // ------------------------------

'use client';

import React from 'react';
import { BaseTable } from '../baseTable/BaseTable';
import { useInfiniteScroll } from '../shared/useInfiniteScroll';
import { InfiniteTableProps } from './types';

const InfiniteTable = <T extends Record<string, unknown>>({
	// 무한스크롤 props
	loadMore,
	hasMore,
	isLoadingMore = false,
	threshold = 0.1,
	
	// BaseTable props
	data,
	columns,
	className = '',
	headerClassName = '',
	rowClassName = '',
	cellClassName = '',
	pageSize = 10,
	loadingRows = 5,
	onRowClick,
}: InfiniteTableProps<T>) => {
	// #region 무한스크롤 기능
	const { sentinelRef } = useInfiniteScroll({
		threshold,
		isLoadingMore,
		hasMore,
		loadMore,
	});
	// #endregion

	// #region 렌더링
	return (
		<div className="space-y-4">
			{/* BaseTable 렌더링 */}
			<BaseTable
				data={data}
				columns={columns}
				className={className}
				headerClassName={headerClassName}
				rowClassName={rowClassName}
				cellClassName={cellClassName}
				pageSize={pageSize}
				loadingRows={loadingRows}
				onRowClick={onRowClick}
			/>

			{/* 무한 스크롤 센티넬 */}
			{hasMore && (
				<div
					ref={sentinelRef}
					className="w-full h-1 opacity-0 pointer-events-none"
					aria-hidden="true"
				/>
			)}

			{/* 추가 로딩 인디케이터 */}
			{isLoadingMore && (
				<div className="flex justify-center py-4">
					<div className="flex gap-2 items-center text-muted-foreground">
						<div className="w-4 h-4 rounded-full border-2 animate-spin border-border border-t-primary"></div>
						<span className="text-sm font-multilang">데이터 로딩 중...</span>
					</div>
				</div>
			)}

			{/* 모든 데이터 로드 완료 메시지 */}
			{!hasMore && !isLoadingMore && data && data.length > 0 && (
				<div className="py-3 text-xs text-center text-muted-foreground/70">
					<span className="font-multilang">모든 데이터를 불러왔습니다</span>
				</div>
			)}
		</div>
	);
	// #endregion
};

export { InfiniteTable };
export type { InfiniteTableProps, BaseTableColumn } from './types'; 