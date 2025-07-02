'use client';

import React, { useState, useEffect } from 'react';
import InfiniteScroll from '@/components/ui/ui-data/infinite-scroll/InfiniteScroll';

const PAGE_SIZE = 20;

// #region 페이지 컴포넌트
export default function Page() {
  const [items, setItems] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setItems(prevItems => {
        const newItems = Array.from(
          { length: PAGE_SIZE },
          (_, i) => `아이템 ${prevItems.length + i + 1}`
        );
        const updated = [...prevItems, ...newItems];
        setHasMore(updated.length < PAGE_SIZE * 5); // 총 5페이지 로딩 후 종료
        return updated;
      });
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">무한 스크롤 예시</h1>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} isLoading={isLoading}>
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item} className="p-4 bg-white shadow-sm rounded">
              {item}
            </li>
          ))}
        </ul>
      </InfiniteScroll>
    </div>
  );
}
// #endregion 