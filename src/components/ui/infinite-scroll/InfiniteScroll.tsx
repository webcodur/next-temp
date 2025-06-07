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
        { threshold },
      );
      observer.current.observe(node);
    },
    [isLoading, hasMore, loadMore, threshold],
  );
  // #endregion

  return (
    <div>
      {children}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-4">
          {isLoading ? <span className="text-gray-500">로딩 중...</span> : <span />}
        </div>
      )}
    </div>
  );
};
// #endregion

export default InfiniteScroll; 