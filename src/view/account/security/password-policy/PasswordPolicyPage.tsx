'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';

export default function PasswordPolicyPage() {
  usePageDescription('비밀번호 보안 정책을 설정합니다.');
  
  return (
    <div>비밀번호 정책</div>
  );
} 