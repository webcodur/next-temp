/* 
  파일명: /hooks/input-hooks/useGlobalKeyboard.ts
  기능: 전역 키보드 단축키 통합 관리 훅
  책임: 애플리케이션 전역에서 사용되는 모든 키보드 단축키 처리
  
  주요 기능:
  - Ctrl+Y: 테마(라이트/다크) 토글
  - Ctrl+B: 사이드바 토글
  - Alt+1,2,3: 언어 전환 (한국어, English, العربية)
  - 전역 키보드 이벤트 리스너 관리
  - 입력 필드에서 단축키 무시 처리
*/ // ------------------------------

'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { toggleThemeAtom } from '@/store/theme';
import { sidebarCollapsedAtom } from '@/store/ui';
import { useLocale } from '@/hooks/ui-hooks/useI18n';

// #region 타입 정의
interface GlobalKeyboardConfig {
  enableThemeToggle?: boolean;
  enableSidebarToggle?: boolean;
  enableLanguageSwitch?: boolean;
}
// #endregion

// #region 유틸리티 함수
/**
 * 현재 포커스된 요소가 입력 필드인지 확인
 */
const isInputFocused = (): boolean => {
  const activeElement = document.activeElement;
  if (!activeElement) return false;
  
  const tagName = activeElement.tagName.toLowerCase();
  const inputTypes = ['input', 'textarea', 'select'];
  const contentEditable = activeElement.getAttribute('contenteditable') === 'true';
  
  return inputTypes.includes(tagName) || contentEditable;
};
// #endregion

// #region 메인 훅
/**
 * 전역 키보드 단축키 관리 훅
 * 
 * @param config - 활성화할 단축키 설정
 * @param config.enableThemeToggle - 테마 토글 활성화 (기본값: true)
 * @param config.enableSidebarToggle - 사이드바 토글 활성화 (기본값: true)
 * @param config.enableLanguageSwitch - 언어 전환 활성화 (기본값: true)
 */
export function useGlobalKeyboard(config: GlobalKeyboardConfig = {}) {
  const {
    enableThemeToggle = true,
    enableSidebarToggle = true,
    enableLanguageSwitch = true,
  } = config;

  const [, toggleTheme] = useAtom(toggleThemeAtom);
  const [isCollapsed, setSidebarCollapsed] = useAtom(sidebarCollapsedAtom);
  const { changeLocale } = useLocale();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 입력 필드에 포커스가 있으면 단축키 무시
      if (isInputFocused()) return;

      // Ctrl 키 조합 처리
      if (event.ctrlKey) {
        const key = event.key.toLowerCase();

        switch (key) {
          case 'y':
          case 'ㅛ': // 한글 자판에서 Y 위치
            if (enableThemeToggle) {
              event.preventDefault();
              toggleTheme();
            }
            break;

          case 'b':
          case 'ㅠ': // 한글 자판에서 B 위치
            if (enableSidebarToggle) {
              event.preventDefault();
              setSidebarCollapsed(!isCollapsed);
            }
            break;

          default:
            break;
        }
        return;
      }

      // Alt 키 조합 처리 (언어 전환)
      if (event.altKey && enableLanguageSwitch) {
        const key = event.key;
        
        switch (key) {
          case '1':
            // Alt+1: 한국어 (ko)
            event.preventDefault();
            changeLocale('ko');
            break;

          case '2':
            // Alt+2: 영어 (en)
            event.preventDefault();
            changeLocale('en');
            break;

          case '3':
            // Alt+3: 아랍어 (ar)
            event.preventDefault();
            changeLocale('ar');
            break;

          default:
            break;
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enableThemeToggle, enableSidebarToggle, enableLanguageSwitch, toggleTheme, isCollapsed, setSidebarCollapsed, changeLocale]);
}
// #endregion
