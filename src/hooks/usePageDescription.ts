'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { pageDescriptionAtom } from '@/store/page';

/**
 * 페이지 컴포넌트에서 호출하여 설명을 설정한다.
 * 언마운트 시 빈 문자열로 리셋한다.
 */
export function usePageDescription(description: string) {
  const setDescription = useSetAtom(pageDescriptionAtom);
  useEffect(() => {
    setDescription(description);
    return () => setDescription('');
  }, [description, setDescription]);
} 