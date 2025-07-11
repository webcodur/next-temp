'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function EmergencyNoticesPage() {
  usePageDescription('긴급 공지사항을 즉시 발송하고 관리합니다.');
  
  return (
    <div>긴급 공지</div>
  );
} 