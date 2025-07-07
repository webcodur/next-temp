/*
  파일명: src/app/lab/ui-data/infinite-scroll/page.tsx
  기능: 무한 스크롤(Infinite Scroll) 기능을 테스트하는 페이지
  책임: `InfiniteScroll` 컴포넌트를 사용하여 스크롤이 끝에 도달할 때마다 새로운 데이터를 비동기적으로 로드하고 목록에 추가한다.
*/

'use client';

import React, { useCallback, useEffect, useState } from 'react';

import InfiniteScroll from '@/components/ui/ui-data/infinite-scroll/InfiniteScroll';
import { useTranslations } from '@/hooks/useI18n';

// #region 상수
const PAGE_SIZE = 20;
// #endregion

export default function Page() {
  // #region 훅
  const t = useTranslations();
  // #endregion

  // #region 상태
  const [items, setItems] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // #endregion

  // #region 핸들러
  const loadMore = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setItems(prevItems => {
        const newItems = Array.from(
          { length: PAGE_SIZE },
          (_, i) => `${t('무한스크롤_아이템')} ${prevItems.length + i + 1}`
        );
        const updated = [...prevItems, ...newItems];
        setHasMore(updated.length < PAGE_SIZE * 5); // 총 5페이지 로딩 후 종료
        return updated;
      });
      setIsLoading(false);
    }, 1000);
  }, [t]);
  // #endregion

  // #region useEffect: 초기 데이터 로드
  useEffect(() => {
    loadMore();
  }, [loadMore]);
  // #endregion

  // #region 렌더링
  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">{t('무한스크롤_제목')}</h1>
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
  // #endregion
} 