'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function PatrolLogPage() {
  usePageDescription('보안 순찰 기록과 특이사항을 관리합니다.');
  
  return (
    <div>순찰 기록</div>
  );
} 