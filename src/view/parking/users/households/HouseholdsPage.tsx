'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function HouseholdsPage() {
  usePageDescription('아파트 세대별 정보와 주차 할당을 관리합니다.');
  
  return (
    <div>세대 관리</div>
  );
} 