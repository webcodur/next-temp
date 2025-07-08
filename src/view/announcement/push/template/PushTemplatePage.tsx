'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function PushTemplatePage() {
  usePageDescription('푸시 알림 템플릿을 생성하고 관리합니다.');
  
  return (
    <div>템플릿 관리</div>
  );
} 