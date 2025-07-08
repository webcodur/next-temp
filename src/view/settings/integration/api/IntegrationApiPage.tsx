'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function IntegrationApiPage() {
  usePageDescription('API 키 및 연동 설정을 관리합니다.');
  
  return (
    <div>API 설정</div>
  );
} 