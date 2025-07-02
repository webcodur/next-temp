'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// 그라데이션 배경과 양각용 그림자
const BACKGROUND = 'linear-gradient(135deg, hsl(var(--card) / 0.95), hsl(var(--muted) / 0.8))';
const RAISED_LIGHT_SIDE = 'rgba(0, 0, 0, 0.03)';
const RAISED_SHADE_SIDE = 'rgba(0, 0, 0, 0.15)';

type RaisedContainerProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export const RaisedContainer: React.FC<RaisedContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div 
      className={cn('p-4 rounded-md', className)}
      style={{
        background: BACKGROUND,
        boxShadow: `-8px -8px 20px ${RAISED_LIGHT_SIDE}, 8px 8px 20px ${RAISED_SHADE_SIDE}`,
      }}
    >
      {children}
    </div>
  );
};