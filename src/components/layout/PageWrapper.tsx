/* 
  파일명: /components/layout/PageWrapper.tsx
  기능: 페이지 레이아웃 래퍼 컴포넌트
  책임: 페이지 콘텐츠와 푸터를 포함한 기본 레이아웃 제공
*/ // ------------------------------
import { ReactNode } from 'react';

import Footer from '@/components/layout/footer/Footer';

// #region 타입
interface PageWrapperProps {
  children: ReactNode;
}
// #endregion

// #region 메인 컴포넌트
export default function PageWrapper({ children }: PageWrapperProps) {
  // #region 렌더링
  return (
    <>
      {/* 페이지 콘텐츠 */}
      <div className="flex-1 pb-16">
        {children}
      </div>

      {/* 구분선 */}
      <div className="h-px bg-gradient-to-r from-transparent to-transparent border-t border-border/30 via-border/20"></div>

      {/* 푸터 */}
      <Footer />
    </>
  );
  // #endregion
}
// #endregion 