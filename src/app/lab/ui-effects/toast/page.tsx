'use client';

import React from 'react';
import { Button } from '@/components/ui/ui-input/button/Button';
import { ToastProvider, toast } from '@/components/ui/ui-effects/toast/Toast';

export default function ToastPage() {
  return (
    <ToastProvider>
      <div className="container py-10">
        <h1 className="mb-8 text-3xl font-bold">Toast 컴포넌트</h1>
        <div className="flex flex-col space-y-4">
          <Button onClick={() => toast('기본 메시지')}>Default</Button>
          <Button onClick={() => toast.success('성공 메시지')}>Success</Button>
          <Button onClick={() => toast.error('에러 메시지')}>Error</Button>
          <Button onClick={() => {
            const id = toast.loading('로딩중...');
            setTimeout(() => toast.success('완료!', { id }), 2000);
          }}>Loading</Button>
        </div>
      </div>
    </ToastProvider>
  );
} 