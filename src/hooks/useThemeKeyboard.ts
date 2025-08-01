/* 
  파일명: /hooks/useThemeKeyboard.ts
  기능: 테마 키보드 단축키 훅
  책임: Ctrl+Y 조합으로 다크/라이트 테마 토글
  
  주요 기능:
  - Ctrl+Y 키 조합 감지
  - 다크/라이트 테마 전환
  - 전역 키보드 이벤트 리스너 관리
*/ // ------------------------------

'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { toggleThemeAtom } from '@/store/theme';

/**
 * 테마 키보드 단축키 훅
 * - Ctrl+Y, Ctrl+Shift+Y, Ctrl+ㅛ 조합으로 테마(라이트/다크) 토글
 */
export function useThemeKeyboard() {
  const [, toggleTheme] = useAtom(toggleThemeAtom);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey) return;

      const key = event.key;
      // 물리적 Y 키에 해당하는 모든 입력값 허용 (영문 Y/y, 한글 ㅛ 등)
      if (key === 'y' || key === 'Y' || key === 'ㅛ') {
        event.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);
} 