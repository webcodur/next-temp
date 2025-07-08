'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function AccountUsersPage() {
  usePageDescription('시스템 사용자 계정을 관리합니다.');
  
  return (
    <div>사용자 관리</div>
  );
} 