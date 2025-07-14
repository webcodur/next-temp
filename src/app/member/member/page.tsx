/* 
  파일명: /app/member/member/page.tsx
  기능: 회원 차량 등록 페이지 컴포넌트
  책임: 회원 차량 등록 뷰 컴포넌트를 동적 로드하는 라우터 페이지
*/ // ------------------------------
'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// #region 동적 임포트
const MemberVehicleRegistrationPage = dynamic(() => import('@/components/view/member/vehicle-registration/MemberVehicleRegistrationPage'), { ssr: false });
// #endregion

// #region 렌더링
export default function MemberVehicleRegistrationRoute() {
  return <MemberVehicleRegistrationPage />;
}
// #endregion 