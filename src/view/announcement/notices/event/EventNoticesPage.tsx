'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function EventNoticesPage() {
  usePageDescription('이벤트 및 행사 공지사항을 관리합니다.');
  
  return (
    <div>이벤트 공지</div>
  );
} 