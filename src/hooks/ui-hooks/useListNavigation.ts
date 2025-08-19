/*
  파일명: useListNavigation.ts
  기능: 목록 페이지로 이동하는 네비게이션 훅
  책임: 현재 페이지에서 목록 페이지로의 이동 기능을 제공한다
*/

import { useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { shouldShowListButton, getListPageUrl, getListPageTitle } from '@/utils/navigationUtils';

interface UseListNavigationOptions {
  hasChanges?: boolean;
  confirmMessage?: string;
}

/**
 * 목록 페이지로 이동하는 기능을 제공하는 훅
 * - 현재 URL이 상세/편집/생성 페이지인지 자동 감지
 * - 목록 페이지 URL 자동 생성 및 이동
 * - hasChanges가 true면 확인 메시지 표시
 */
export function useListNavigation(options: UseListNavigationOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  
  const {
    hasChanges = false,
    confirmMessage = '수정된 내용이 있습니다. 목록으로 이동하시겠습니까?'
  } = options;

  // 목록으로 버튼을 표시할지 여부
  const shouldShowList = useMemo(() => 
    shouldShowListButton(pathname), 
    [pathname]
  );

  // 목록 페이지 URL
  const listPageUrl = useMemo(() => 
    getListPageUrl(pathname), 
    [pathname]
  );

  // 목록 페이지 제목
  const listPageTitle = useMemo(() => 
    getListPageTitle(pathname), 
    [pathname]
  );

  // 목록으로 이동 핸들러
  const handleGoToList = useCallback(() => {
    // 변경사항이 있으면 확인
    if (hasChanges) {
      if (!confirm(confirmMessage)) {
        return;
      }
    }

    // 목록 페이지로 이동
    router.push(listPageUrl);
  }, [hasChanges, confirmMessage, router, listPageUrl]);

  return {
    shouldShowList,
    listPageUrl,
    listPageTitle,
    handleGoToList
  };
}
