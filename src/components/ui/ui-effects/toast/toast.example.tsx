'use client';

import React from 'react';
import { Button } from '@/components/ui/ui-input/button/Button';
import { ToastProvider, toast, customToast } from './Toast';
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

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">기본 토스트</h3>
            <div className="flex flex-col space-y-2">
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

          <div>
            <h3 className="text-lg font-semibold mb-4">크기 및 시인성 개선 커스텀 토스트</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => customToast.primary('Primary 토스트 - 큰 크기로 업그레이드됨!')}
                className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
              >
                Primary (대형)
              </Button>
              <Button 
                onClick={() => customToast.secondary('Secondary 토스트 - 텍스트가 더 커지고 쨍함!')}
                className="bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]"
              >
                Secondary (대형)
              </Button>
              <Button 
                onClick={() => customToast.success('Success 토스트 - 성공 메시지가 더 크고 선명함!')}
                className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]"
              >
                Success (대형)
              </Button>
              <Button 
                onClick={() => customToast.error('Error 토스트 - 에러 메시지를 확실히 인식!')}
                className="bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]"
              >
                Error (대형)
              </Button>
              <Button 
                onClick={() => customToast.warning('Warning 토스트 - 경고가 더 눈에 잘 띔!')}
                className="bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]"
              >
                Warning (대형)
              </Button>
              <Button 
                onClick={() => customToast.info('Info 토스트 - 정보 전달이 더 효과적!')}
                className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
              >
                Info (대형)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
} 