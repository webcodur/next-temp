'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function PushSendPage() {
  usePageDescription('푸시 알림을 즉시 발송합니다.');
  
  return (
    <div>알림 발송</div>
  );
} 