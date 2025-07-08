'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function PatrolConfigPage() {
  usePageDescription('순찰 구역과 스케줄을 설정합니다.');
  
  return (
    <div>순찰 설정</div>
  );
} 