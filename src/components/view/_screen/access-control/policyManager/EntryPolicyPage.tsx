/* 메뉴 설명: 출입 정책 관리 페이지 */
'use client';

import React from 'react';
import { mockBarriers } from '@/data/mockParkingData';
import AccessControlManager from '@/components/view/_screen/access-control/AccessControlManager';

// EntryPolicyPage: 출입 정책 페이지 - AccessControlManager 공통 모듈 사용
export default function EntryPolicyPage() {
  return (
    <section>
      <AccessControlManager barriers={mockBarriers} />
    </section>
  );
} 