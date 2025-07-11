'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function OneToOneBoardPage() {
  usePageDescription('주민과 관리사무소 간 1:1 소통을 관리합니다.');
  
  return (
    <div>1:1 게시판</div>
  );
} 