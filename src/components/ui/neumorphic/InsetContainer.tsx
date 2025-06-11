'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// 그라데이션 배경 (더 옅게) 과 음각용 그림자
const BACKGROUND = 'linear-gradient(135deg, hsl(var(--card) / 0.85), hsl(var(--muted) / 0.7))';
const INSET_LIGHT_SIDE = 'rgba(0, 0, 0, 0.03)';
const INSET_SHADE_SIDE = 'rgba(0, 0, 0, 0.2)';

type InsetContainerProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export const InsetContainer: React.FC<InsetContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div 
      className={cn('p-4 rounded-md', className)}
      style={{
        background: BACKGROUND,
        boxShadow: `inset 6px 6px 16px ${INSET_SHADE_SIDE}, inset -6px -6px 16px ${INSET_LIGHT_SIDE}`,
      }}
    >
      {children}
    </div>
  );
}; 