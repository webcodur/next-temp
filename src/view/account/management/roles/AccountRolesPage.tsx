'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function AccountRolesPage() {
  usePageDescription('사용자 역할과 권한을 관리합니다.');
  
  return (
    <div>역할 관리</div>
  );
} 