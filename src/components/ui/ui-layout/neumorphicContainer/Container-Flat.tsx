'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// 그라데이션 배경
const BACKGROUND = 'linear-gradient(135deg, hsl(var(--card) / 0.95), hsl(var(--muted) / 0.8))';

type FlatContainerProps = {
  children: React.ReactNode;
  className?: string;
  colorVariant?: 'primary' | 'secondary';
  onClick?: () => void;
};

export const FlatContainer: React.FC<FlatContainerProps> = ({
  children,
  className,
  colorVariant = 'primary',
}) => {
  // 색상 variant에 따른 border 색상
  const borderColor = colorVariant === 'primary' 
    ? 'hsl(var(--primary) / 0.3)'
    : 'hsl(var(--secondary) / 0.3)';

  return (
    <div 
      className={cn('p-4 rounded-md border', className)}
      style={{
        background: BACKGROUND,
        // 평면은 그림자 없이 미묘한 border로 구분
        borderColor,
      }}
    >
      {children}
    </div>
  );
};
