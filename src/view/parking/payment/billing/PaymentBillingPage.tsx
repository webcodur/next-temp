'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function PaymentBillingPage() {
  usePageDescription('실시간 주차 요금 결제를 관리합니다.');
  
  return (
    <div>요금 결제</div>
  );
} 