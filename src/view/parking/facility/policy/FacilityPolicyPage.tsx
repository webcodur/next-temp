'use client';

import React from 'react';
import Tabs from '@/components/ui/ui-layout/tabs/Tabs';
import { Button } from '@/components/ui/ui-input/button/Button';

import ParkingPolicyTab from './unit/ParkingPolicyTab';
import BarrierOrderTab from './unit/BarrierOrderTab';
import EntryPolicyTab from './unit/EntryPolicyTab';
import BlacklistPolicyTab from './unit/BlacklistPolicyTab';

// 탭 메타데이터
const tabs = [
  { id: 'parking', label: '주차정책 설정' },
  { id: 'order', label: '차단기 순서 설정' },
  { id: 'entry', label: '출입 정책 설정' },
  { id: 'blacklist', label: '블랙리스트 정책 설정' },
];

export default function FacilityPolicyPage() {
  return (
    <Tabs tabs={tabs} align="start" variant="default">
      <ParkingPolicyTab />
      <BarrierOrderTab />
      <EntryPolicyTab />
      <BlacklistPolicyTab />

      {/* 적용 버튼 - 페이지 우측 하단 고정 */}
      <Button variant="primary" className="fixed right-6 bottom-6 w-24">
        적용
      </Button>
    </Tabs>
  );
} 