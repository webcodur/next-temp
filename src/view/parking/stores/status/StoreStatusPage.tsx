'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function StoreStatusPage() {
  usePageDescription('상가 임대 현황과 주차 배정 상태를 관리합니다.');
  
  return (
    <div>상가 현황</div>
  );
} 