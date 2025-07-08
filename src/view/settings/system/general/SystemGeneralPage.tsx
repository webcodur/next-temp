'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function SystemGeneralPage() {
  usePageDescription('시스템 일반 설정을 관리합니다.');
  
  return (
    <div>일반 설정</div>
  );
} 