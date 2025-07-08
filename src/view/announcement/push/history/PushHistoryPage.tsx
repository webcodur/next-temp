'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function PushHistoryPage() {
  usePageDescription('푸시 알림 발송 이력을 조회합니다.');
  
  return (
    <div>발송 이력</div>
  );
} 