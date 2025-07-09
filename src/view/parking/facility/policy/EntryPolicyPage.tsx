import React from 'react';
import Tab2EntryPolicy from './unit/Tab2-EntryPolicy';
import { usePageDescription } from '@/hooks/usePageDescription';

// EntryPolicyPage: 출입 정책 페이지
export default function EntryPolicyPage() {
  usePageDescription('출입 정책을 설정합니다.');
  return <Tab2EntryPolicy />;
} 