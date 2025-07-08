'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function IntegrationExternalServicesPage() {
  usePageDescription('외부 서비스 연동을 설정하고 관리합니다.');
  
  return (
    <div>외부 서비스</div>
  );
} 