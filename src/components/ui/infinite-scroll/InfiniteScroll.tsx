import React, { FC, useRef, useCallback } from 'react';

interface InfiniteScrollProps {
	loadMore: () => void;
	hasMore: boolean;
	isLoading: boolean;
	threshold?: number;
	children: React.ReactNode;
}

// #region InfiniteScroll 컴포넌트
const InfiniteScroll: FC<InfiniteScrollProps> = ({
	loadMore,
	hasMore,
	isLoading,
	threshold = 0.1,
	children,
}) => {
	// #region Intersection Observer 설정
	const observer = useRef<IntersectionObserver | null>(null);
	const sentinelRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (isLoading) return;
			observer.current?.disconnect();
			if (!node) return;
			observer.current = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting && hasMore) {
						loadMore();
					}
				},
				{ threshold }
			);
			observer.current.observe(node);
		},
		[isLoading, hasMore, loadMore, threshold]
	);
	// #endregion

	return (
		<div className="w-full">
			{children}
			{hasMore && (
				<div
					ref={sentinelRef}
					className="flex justify-center py-3 border-t border-gray-100">
					{isLoading ? (
						<div className="flex items-center gap-2 text-gray-500">
							<div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
							<span className="text-xs">데이터 로딩 중...</span>
						</div>
					) : (
						<div className="text-xs text-gray-400">스크롤하여 더 보기</div>
					)}
				</div>
			)}
			{!hasMore && (
				<div className="flex justify-center py-3 border-t border-gray-100">
					<span className="text-xs text-gray-400">
						모든 데이터를 불러왔습니다
					</span>
				</div>
			)}
		</div>
	);
};
// #endregion

export default InfiniteScroll;
