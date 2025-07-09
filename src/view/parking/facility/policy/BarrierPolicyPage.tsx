import React from 'react';
import Tab1BarrierPolicy from './unit/Tab1-BarrierPolicy';
import { usePageDescription } from '@/hooks/usePageDescription';

// BarrierPolicyPage: 차단기 정책 페이지
export default function BarrierPolicyPage() {
  usePageDescription('차단기 정책을 설정합니다.');
  return <Tab1BarrierPolicy />;
} 