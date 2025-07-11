'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function VehicleRegistrationPage() {
  usePageDescription('등록된 차량을 관리하고 신규 차량을 등록합니다.');
  
  return (
    <div>차량 등록</div>
  );
} 