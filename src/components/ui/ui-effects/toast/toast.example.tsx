'use client';

import React from 'react';
import { Button } from '@/components/ui/ui-input/button/Button';
import { ToastProvider, toast } from './Toast';
import { useTranslations } from '@/hooks/ui-hooks/useI18n';

export default function ToastExample() {
  const t = useTranslations();

  return (
    <ToastProvider>
      <div className="container py-10">
        
        {/* 디버깅용 CSS 변수 확인 */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-4 neu-flat">
            <div className="mb-2 text-sm font-medium">Success</div>
            <div className="w-12 h-12 rounded bg-[hsl(var(--success))]"></div>
            <div className="mt-1 text-xs">--success</div>
          </div>
          <div className="p-4 neu-flat">
            <div className="mb-2 text-sm font-medium">Error</div>
            <div className="w-12 h-12 rounded bg-[hsl(var(--destructive))]"></div>
            <div className="mt-1 text-xs">--destructive</div>
          </div>
          <div className="p-4 neu-flat">
            <div className="mb-2 text-sm font-medium">Warning</div>
            <div className="w-12 h-12 rounded bg-[hsl(var(--warning))]"></div>
            <div className="mt-1 text-xs">--warning</div>
          </div>
          <div className="p-4 neu-flat">
            <div className="mb-2 text-sm font-medium">Info</div>
            <div className="w-12 h-12 rounded bg-[hsl(var(--primary))]"></div>
            <div className="mt-1 text-xs">--primary</div>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <Button onClick={() => toast(t('토스트_기본메시지'))}>Default</Button>
          <Button onClick={() => toast.success(t('토스트_성공메시지'))}>Success</Button>
          <Button onClick={() => toast.error(t('토스트_에러메시지'))}>Error</Button>
          <Button onClick={() => toast.warning('경고 메시지')}>Warning</Button>
          <Button onClick={() => toast.info('정보 메시지')}>Info</Button>
          <Button onClick={() => {
            const id = toast.loading(t('토스트_로딩중'));
            setTimeout(() => toast.success(t('토스트_완료'), { id }), 2000);
          }}>Loading</Button>
        </div>
      </div>
    </ToastProvider>
  );
} 