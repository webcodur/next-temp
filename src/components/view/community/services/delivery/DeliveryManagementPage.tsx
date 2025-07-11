'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function DeliveryManagementPage() {
  usePageDescription('택배 보관함과 배송 현황을 관리합니다.');
  
  return (
    <div>택배 관리</div>
  );
} 