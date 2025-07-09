'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function MemberBlacklistPage() {
  usePageDescription('출입 금지 차량을 관리합니다.');

  return <div>블랙리스트 관리</div>;
} 