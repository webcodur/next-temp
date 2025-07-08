'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function SessionManagementPage() {
  usePageDescription('활성 세션을 모니터링하고 관리합니다.');
  
  return (
    <div>세션 관리</div>
  );
} 