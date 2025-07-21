import { useRef, useCallback } from 'react';

interface UseInfiniteScrollProps {
	threshold?: number;
	isLoadingMore?: boolean;
	hasMore?: boolean;
	loadMore?: () => void;
}

interface UseInfiniteScrollReturn {
	sentinelRef: (node: HTMLDivElement | null) => void;
}

export const useInfiniteScroll = ({
	threshold = 0.1,
	isLoadingMore = false,
	hasMore = false,
	loadMore,
}: UseInfiniteScrollProps): UseInfiniteScrollReturn => {
	// #region refs
	const observer = useRef<IntersectionObserver | null>(null);
	// #endregion

	// #region 무한 스크롤 sentinel ref 콜백
	const sentinelRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (isLoadingMore || !loadMore) return;
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
		[isLoadingMore, hasMore, loadMore, threshold]
	);
	// #endregion

	return {
		sentinelRef,
	};
}; 