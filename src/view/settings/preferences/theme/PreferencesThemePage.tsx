'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function PreferencesThemePage() {
  usePageDescription('테마 및 디스플레이 설정을 관리합니다.');
  
  return (
    <div>테마 설정</div>
  );
} 