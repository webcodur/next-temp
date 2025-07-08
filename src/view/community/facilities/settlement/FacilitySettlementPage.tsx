'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function FacilitySettlementPage() {
  usePageDescription('커뮤니티 시설 이용료 정산을 관리합니다.');
  
  return (
    <div>시설 정산</div>
  );
} 