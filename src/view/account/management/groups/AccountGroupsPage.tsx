'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function AccountGroupsPage() {
  usePageDescription('사용자 그룹을 생성하고 관리합니다.');
  
  return (
    <div>그룹 관리</div>
  );
} 