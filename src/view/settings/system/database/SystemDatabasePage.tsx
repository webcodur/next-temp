'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function SystemDatabasePage() {
  usePageDescription('데이터베이스 연결 및 설정을 관리합니다.');
  
  return (
    <div>데이터베이스</div>
  );
} 