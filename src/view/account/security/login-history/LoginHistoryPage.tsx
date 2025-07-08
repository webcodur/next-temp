'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function LoginHistoryPage() {
  usePageDescription('사용자 로그인 이력을 조회합니다.');
  
  return (
    <div>로그인 이력</div>
  );
} 