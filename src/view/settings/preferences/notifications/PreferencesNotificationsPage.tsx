'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function PreferencesNotificationsPage() {
  usePageDescription('알림 및 메시지 설정을 관리합니다.');
  
  return (
    <div>알림 설정</div>
  );
} 