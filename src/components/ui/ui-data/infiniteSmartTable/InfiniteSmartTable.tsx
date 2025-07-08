
// 새 컴포넌트: InfiniteSmartTable
// -----------------------------------------------------------------------------
'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import InfiniteScroll from '@/components/ui/ui-data/infinite-scroll/InfiniteScroll';
import {
	SmartTable,
	SmartTableColumn,
} from '@/components/ui/ui-data/smartTable/SmartTable';

// #region 타입 정의
interface InfiniteSmartTableProps<T> {
	/* SmartTable 데이터 */
	data: T[] | null;
	/* SmartTable 컬럼 정의 */
	columns: SmartTableColumn<T>[];
	/* 추가 데이터 로드 함수 */
	loadMore: () => void;
	/* 더 로드할 데이터가 있는지 여부 */
	hasMore: boolean;
	/* 현재 데이터 로딩 중인지 */
	isFetching?: boolean;
	/* SmartTable 기본 스타일 커스터마이즈 */
	className?: string;
	headerClassName?: string;
	rowClassName?: string | ((item: T, index: number) => string);
	cellClassName?: string;
	/* SmartTable 기타 동작 */
	pageSize?: number;
	emptyMessage?: string;
	loadingRows?: number;
	/* IntersectionObserver threshold */
	threshold?: number;
}
// #endregion

// #region InfiniteSmartTable 컴포넌트
const InfiniteSmartTable = <T extends Record<string, any>>({
	data,
	columns,
	loadMore,
	hasMore,
	isFetching = false,
	threshold,
	...tableProps
}: InfiniteSmartTableProps<T>) => {
	// 추가 로딩 상태 (초기 로딩은 SmartTable에서 처리)
	const isLoadingMore = isFetching && data !== null;
	
	return (
		<InfiniteScroll
			loadMore={loadMore}
			hasMore={hasMore}
			isLoading={isLoadingMore}
			threshold={threshold}
		>
			<SmartTable
				data={data}
				columns={columns}
				{...tableProps}
			/>
		</InfiniteScroll>
	);
};
// #endregion

export { InfiniteSmartTable }; 