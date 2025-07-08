'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function PreferencesLanguagePage() {
  usePageDescription('언어 및 지역 설정을 관리합니다.');
  
  return (
    <div>언어 설정</div>
  );
} 