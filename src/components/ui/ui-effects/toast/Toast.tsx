"use client";

import * as React from "react";
import { Toaster, toast } from "sonner";
import "./toast.css";

// #region ToastProvider 컴포넌트
const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          duration: 3000,
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            boxShadow: '0 4px 12px hsl(var(--foreground) / 0.1)',
            fontFamily: 'var(--font-multilang)',
          },
        }}
        className="toast-container"
      />
    </>
  );
};
// #endregion

// #region 커스텀 토스트 함수들
const primaryToast = (message: string, options?: Record<string, unknown>) => {
  return toast.custom(
    () => (
      <div 
        className="toast-primary-content"
        style={{
          background: 'hsl(var(--primary) / 0.9)',
          borderColor: 'hsl(var(--primary) / 0.8)',
          color: 'hsl(var(--primary-foreground))',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid',
          boxShadow: '0 4px 12px hsl(var(--foreground) / 0.1)',
          fontFamily: 'var(--font-multilang)',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
        }}
      >
        {message}
      </div>
    ),
    options
  );
};

const secondaryToast = (message: string, options?: Record<string, unknown>) => {
  return toast.custom(
    () => (
      <div 
        className="toast-secondary-content"
        style={{
          background: 'hsl(var(--secondary) / 0.9)',
          borderColor: 'hsl(var(--secondary) / 0.8)',
          color: 'hsl(var(--secondary-foreground))',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid',
          boxShadow: '0 4px 12px hsl(var(--foreground) / 0.1)',
          fontFamily: 'var(--font-multilang)',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
        }}
      >
        {message}
      </div>
    ),
    options
  );
};

// 기존 toast 함수를 확장한 객체
const customToast = {
  ...toast,
  primary: primaryToast,
  secondary: secondaryToast,
};
// #endregion

export { ToastProvider, toast, customToast }; 