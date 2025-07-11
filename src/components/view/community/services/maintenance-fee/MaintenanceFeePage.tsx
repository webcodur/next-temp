'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function MaintenanceFeePage() {
  usePageDescription('아파트 관리비를 조회하고 관리합니다.');
  
  return (
    <div>관리비</div>
  );
} 