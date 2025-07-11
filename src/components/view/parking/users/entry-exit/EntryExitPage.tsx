'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function EntryExitPage() {
  usePageDescription('주차장 입출차 현황을 실시간으로 관리합니다.');
  
  return (
    <div>입출차 관리</div>
  );
} 