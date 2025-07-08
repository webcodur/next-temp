'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function SystemLogsPage() {
  usePageDescription('시스템 로그를 조회하고 관리합니다.');
  
  return (
    <div>로그 관리</div>
  );
} 