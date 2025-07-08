'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function SystemBackupPage() {
  usePageDescription('시스템 백업 스케줄과 복원을 관리합니다.');
  
  return (
    <div>백업 관리</div>
  );
} 