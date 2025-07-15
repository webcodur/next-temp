/* 
  파일명: /app/member/entryexit/page.tsx
  기능: 회원 출입 관리 페이지 컴포넌트
  책임: 회원 출입 관리 뷰 컴포넌트를 export하는 라우터 페이지
*/

'use client';

import React from 'react';

import MemberEntryExitPage from '@/components/view/member/entry-exit/MemberEntryExitPage';

// #region 렌더링
export default function MemberEntryExitRoute() {
  return <MemberEntryExitPage />;
}
// #endregion 