'use client';

import React, { createContext, useContext, useCallback, useRef, useEffect, useState, useMemo } from 'react';
import { useAtom } from 'jotai';
import { sectionNavVisibleAtom, currentSectionIdAtom } from '@/store/ui';

// #region 타입 정의
export interface SectionInfo {
  id: string;
  title: string;
  element: HTMLElement | null;
  level: number; // 중첩 레벨 (0: 최상위, 1: 하위, ...)
}

interface SectionNavigationContextType {
  sections: SectionInfo[];
  registerSection: (id: string, title: string, element: HTMLElement | null, level?: number) => void;
  unregisterSection: (id: string) => void;
  scrollToSection: (sectionId: string) => void;
  currentSectionId: string;
}
// #endregion

// #region Context 생성
const SectionNavigationContext = createContext<SectionNavigationContextType | null>(null);

export const useSectionNavigation = () => {
  const context = useContext(SectionNavigationContext);
  if (!context) {
    // Provider가 없는 경우 기본값 반환 (hooks 일관성 유지)
    return {
      sections: [],
      registerSection: () => {},
      unregisterSection: () => {},
      scrollToSection: () => {},
      currentSectionId: '',
    };
  }
  return context;
};
// #endregion

// #region Provider 컴포넌트
interface SectionNavigationProviderProps {
  children: React.ReactNode;
}

export const SectionNavigationProvider: React.FC<SectionNavigationProviderProps> = ({ children }) => {
  const [sections, setSections] = useState<SectionInfo[]>([]);
  const [, setSectionNavVisible] = useAtom(sectionNavVisibleAtom);
  const [currentSectionId, setCurrentSectionId] = useAtom(currentSectionIdAtom);
  
  // Intersection Observer 인스턴스
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 섹션 등록
  const registerSection = useCallback((id: string, title: string, element: HTMLElement | null, level: number = 0) => {
    setSections(prev => {
      // 이미 존재하는 섹션인지 확인
      const existingIndex = prev.findIndex(section => section.id === id);
      
      if (existingIndex >= 0) {
        // 기존 섹션과 비교하여 실제로 변경되었는지 확인
        const existing = prev[existingIndex];
        if (existing.title === title && existing.element === element && existing.level === level) {
          return prev; // 변경사항 없으면 기존 배열 반환
        }
        
        // 기존 섹션 업데이트
        const updated = [...prev];
        updated[existingIndex] = { id, title, element, level };
        return updated;
      } else {
        // 새 섹션 추가
        return [...prev, { id, title, element, level }];
      }
    });
  }, []);

  // 섹션 등록 해제
  const unregisterSection = useCallback((id: string) => {
    setSections(prev => prev.filter(section => section.id !== id));
  }, []);

  // 섹션으로 스크롤
  const scrollToSection = useCallback((sectionId: string) => {
    setSections(currentSections => {
      const section = currentSections.find(s => s.id === sectionId);
      if (section?.element) {
        section.element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
      return currentSections; // 상태 변경 없음
    });
  }, []);

  // 섹션 가시성 업데이트
  useEffect(() => {
    setSectionNavVisible(sections.length >= 2);
  }, [sections.length, setSectionNavVisible]);

  // Intersection Observer 초기화 (한번만)
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setCurrentSectionId(entry.target.id);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px' // 헤더 높이만큼 마진
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, [setCurrentSectionId]);

  // 섹션 변경시 Observer 업데이트
  useEffect(() => {
    if (!observerRef.current || sections.length < 2) return;

    // 기존 관찰 중지
    observerRef.current.disconnect();

    // 새로운 섹션들 관찰 시작
    sections.forEach(section => {
      if (section.element) {
        observerRef.current?.observe(section.element);
      }
    });
  }, [sections]);

  const contextValue: SectionNavigationContextType = useMemo(() => ({
    sections,
    registerSection,
    unregisterSection,
    scrollToSection,
    currentSectionId,
  }), [sections, registerSection, unregisterSection, scrollToSection, currentSectionId]);

  return (
    <SectionNavigationContext.Provider value={contextValue}>
      {children}
    </SectionNavigationContext.Provider>
  );
};
// #endregion
