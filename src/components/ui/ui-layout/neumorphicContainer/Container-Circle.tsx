'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// 그라데이션 배경과 원형용 그림자
const BACKGROUND = 'linear-gradient(135deg, hsl(var(--card) / 0.95), hsl(var(--muted) / 0.8))';
const CIRCLE_LIGHT_SIDE = 'hsl(var(--primary) / 0.12)';
const CIRCLE_SHADE_SIDE = 'hsl(var(--primary) / 0.28)';
const CIRCLE_INSET_LIGHT_SIDE = 'hsl(var(--primary) / 0.15)';
const CIRCLE_INSET_SHADE_SIDE = 'hsl(var(--primary) / 0.35)';

type CircleContainerProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export const CircleContainer: React.FC<CircleContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div 
      className={cn(
        'flex justify-center items-center relative h-64 w-64 rounded-full',
        'after:content-[""] after:absolute after:h-[80%] after:w-[80%]',
        'after:bg-transparent after:rounded-full',
        className
      )}
      style={{
        background: BACKGROUND,
        boxShadow: `-10px -10px 25px ${CIRCLE_LIGHT_SIDE}, 10px 10px 25px ${CIRCLE_SHADE_SIDE}`,
      }}
    >
      <div 
        className="absolute h-[80%] w-[80%] rounded-full"
        style={{
          boxShadow: `inset 8px 8px 20px ${CIRCLE_INSET_SHADE_SIDE}, inset -8px -8px 20px ${CIRCLE_INSET_LIGHT_SIDE}`,
        }}
      />
      <div className="z-10">{children}</div>
    </div>
  );
};
