'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// #region 타입 정의
type NeumorphicProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

type NeumorphicButtonProps = NeumorphicProps & {
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

type NeumorphicContainerProps = NeumorphicProps;
// #endregion

// #region 양각 컴포넌트
export const RaisedButton: React.FC<NeumorphicButtonProps> = ({
  children,
  className,
  onClick,
  disabled = false,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      className={cn(
        'neu-raised px-4 py-2 rounded-lg text-sm font-medium',
        'focus:outline-none focus:ring-2 focus:ring-primary/20',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const RaisedContainer: React.FC<NeumorphicContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('neu-raised p-4 rounded-lg', className)}>
      {children}
    </div>
  );
};
// #endregion

// #region 음각 컴포넌트
export const InsetButton: React.FC<NeumorphicButtonProps> = ({
  children,
  className,
  onClick,
  disabled = false,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      className={cn(
        'neu-inset px-4 py-2 rounded-lg text-sm font-medium',
        'focus:outline-none focus:ring-2 focus:ring-primary/20',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const InsetContainer: React.FC<NeumorphicContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('neu-inset p-4 rounded-lg', className)}>
      {children}
    </div>
  );
};
// #endregion

// #region 평면 컴포넌트
export const FlatContainer: React.FC<NeumorphicContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('neu-flat p-4 rounded-lg', className)}>
      {children}
    </div>
  );
};
// #endregion 