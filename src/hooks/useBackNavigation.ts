import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface UseBackNavigationOptions {
  fallbackPath?: string;
  hasChanges?: boolean;
  confirmMessage?: string;
}

/**
 * 브라우저 뒤로가기 기능을 제공하는 훅
 * - 히스토리가 있으면 뒤로가기
 * - 히스토리가 없으면 fallbackPath로 이동
 * - hasChanges가 true면 확인 메시지 표시
 */
export function useBackNavigation(options: UseBackNavigationOptions = {}) {
  const router = useRouter();
  const {
    fallbackPath = '/',
    hasChanges = false,
    confirmMessage = '수정된 내용이 있습니다. 정말로 나가시겠습니까?'
  } = options;

  const handleBack = useCallback(() => {
    // 변경사항이 있으면 확인
    if (hasChanges) {
      if (!confirm(confirmMessage)) {
        return;
      }
    }

    // 히스토리가 있으면 뒤로가기, 없으면 fallback 경로로
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackPath);
    }
  }, [hasChanges, confirmMessage, router, fallbackPath]);

  return { handleBack };
}
