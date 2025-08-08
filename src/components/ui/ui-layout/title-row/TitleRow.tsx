'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TitleRowProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  endContent?: React.ReactNode;
  className?: string;
  // 밀집 모드 (여백 축소)
  dense?: boolean;
}

const TitleRow: React.FC<TitleRowProps> = ({
  title,
  subtitle,
  endContent,
  className,
  dense = false,
}) => {
  const rowSizing = dense ? 'h-10 px-2' : 'h-12 px-4';
  return (
    <div
      className={cn(
        'flex gap-4 justify-between items-center',
        rowSizing,
        className,
      )}
    >
      <div className="flex gap-2 items-baseline min-w-0">
        <span className="text-lg font-semibold whitespace-nowrap text-foreground">
          {title}
        </span>
        {subtitle && (
          <span className="text-sm truncate text-muted-foreground">
            {subtitle}
          </span>
        )}
      </div>
      {endContent && (
        <div className="flex flex-shrink-0 gap-2 items-center">
          {endContent}
        </div>
      )}
    </div>
  );
};

export default TitleRow;


