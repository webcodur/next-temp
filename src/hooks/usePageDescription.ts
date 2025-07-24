/* 
  파일명: /hooks/usePageDescription.ts
  기능: 페이지 설명 설정 훅
  책임: 페이지별 설명 텍스트를 전역 상태에 설정
  
  주요 기능:
  - 페이지 마운트 시 설명 텍스트 자동 설정
  - 전역 상태 업데이트
*/ // ------------------------------

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