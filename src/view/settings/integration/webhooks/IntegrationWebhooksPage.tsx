'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function IntegrationWebhooksPage() {
  usePageDescription('웹훅 엔드포인트를 설정하고 관리합니다.');
  
  return (
    <div>웹훅 관리</div>
  );
} 