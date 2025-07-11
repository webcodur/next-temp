'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function GeneralNoticesPage() {
  usePageDescription('일반 공지사항을 작성하고 관리합니다.');
  
  return (
    <div>일반 공지</div>
  );
} 