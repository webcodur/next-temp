/* 메뉴 설명: 시스템 설정 수정 */
'use client';

import React from 'react';
import SystemConfigEditPage from '@/components/view/system/config/edit/SystemConfigEditPage';

interface PageProps {
  params: Promise<{
    key: string;
  }>;
}

export default function Page({ params }: PageProps) {
  const resolvedParams = React.use(params);
  return <SystemConfigEditPage configKey={decodeURIComponent(resolvedParams.key)} />;
} 