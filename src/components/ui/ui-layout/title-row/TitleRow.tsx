'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TitleRowProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  endContent?: React.ReactNode;
  // className?: string;
}

const TitleRow: React.FC<TitleRowProps> = ({
  title,
  subtitle,
  endContent,
  // className,
}) => {
  return (
    <div
      className={cn(
        'flex gap-4 justify-between items-center',
        // className,
      )}
    >
      <div className="flex flex-1 gap-2 items-baseline min-w-0">
        <span className="text-lg font-semibold whitespace-nowrap text-foreground">
          {title}
        </span>
        {subtitle && (
          <span className="min-w-0 text-sm truncate text-muted-foreground">
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


