'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// 그라데이션 배경
const BACKGROUND = 'linear-gradient(135deg, hsl(var(--card) / 0.95), hsl(var(--muted) / 0.8))';

type FlatContainerProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export const FlatContainer: React.FC<FlatContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div 
      className={cn('p-4 rounded-md border', className)}
      style={{
        background: BACKGROUND,
        // 평면은 그림자 없이 미묘한 border로 구분
        borderColor: 'hsl(var(--border) / 0.3)',
      }}
    >
      {children}
    </div>
  );
}; 