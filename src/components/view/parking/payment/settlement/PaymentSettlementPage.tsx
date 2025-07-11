'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function PaymentSettlementPage() {
  usePageDescription('주차 요금 정산 내역을 관리합니다.');
  
  return (
    <div>정산 관리</div>
  );
} 