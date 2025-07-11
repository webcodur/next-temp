'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function VisitorsPage() {
  usePageDescription('방문자 차량을 사전 등록하고 입출차를 관리합니다.');
  
  return (
    <div>방문자 관리</div>
  );
} 