'use client';

import React from 'react';
import { Button } from '@/components/ui/ui-input/button/Button';
import { ToastProvider, toast } from '@/components/ui/ui-effects/toast/Toast';
import { useTranslations } from '@/hooks/useI18n';

export default function ToastPage() {
  const t = useTranslations();

  return (
    <ToastProvider>
      <div className="container py-10">
        <h1 className="mb-8 text-3xl font-bold">{t('토스트_제목')}</h1>
        <div className="flex flex-col space-y-4">
          <Button onClick={() => toast(t('토스트_기본메시지'))}>Default</Button>
          <Button onClick={() => toast.success(t('토스트_성공메시지'))}>Success</Button>
          <Button onClick={() => toast.error(t('토스트_에러메시지'))}>Error</Button>
          <Button onClick={() => {
            const id = toast.loading(t('토스트_로딩중'));
            setTimeout(() => toast.success(t('토스트_완료'), { id }), 2000);
          }}>Loading</Button>
        </div>
      </div>
    </ToastProvider>
  );
} 