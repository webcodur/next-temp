/* 
  파일명: /app/member/visitor/page.tsx
  기능: 회원 방문자 페이지 컴포넌트
  책임: 회원 방문자 뷰 컴포넌트를 동적 로드하는 라우터 페이지
*/ // ------------------------------
'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// #region 동적 임포트
const MemberVisitorPage = dynamic(() => import('@/components/view/member/visitor/MemberVisitorPage'), { ssr: false });
// #endregion

// #region 렌더링
export default function MemberVisitorRoute() {
  return <MemberVisitorPage />;
}
// #endregion 