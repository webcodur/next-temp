"use client";

import * as React from "react";
import { Toaster, toast } from "sonner";
import "./toast.css";

// #region 토스트 스타일 상수
const TOAST_STYLES = {
  // 공통 텍스트 스타일
  text: {
    fontFamily: 'var(--font-multilang)',
    fontWeight: '700',
    fontSize: '16px',
    lineHeight: '1.5',
    letterSpacing: '-0.02em',
    textRendering: 'optimizeLegibility' as const,
    WebkitFontSmoothing: 'antialiased' as const,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
  },
  // 공통 컨테이너 스타일
  container: {
    padding: '16px 20px',
    borderRadius: '10px',
    border: '2px solid',
    minHeight: '56px',
    display: 'flex',
    alignItems: 'center',
  },
  // 그림자 효과
  shadow: {
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15)',
  }
} as const;

const ENHANCED_TOAST_OPTIONS = {
  duration: 4000,
  style: {
    ...TOAST_STYLES.text,
    ...TOAST_STYLES.container,
    ...TOAST_STYLES.shadow,
    background: 'hsl(var(--card))',
    color: 'hsl(var(--card-foreground))',
    borderColor: 'hsl(var(--border))',
    minHeight: '64px',
  },
} as const;
// #endregion

// #region ToastProvider 컴포넌트
const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        richColors
        toastOptions={ENHANCED_TOAST_OPTIONS}
        className="toast-container"
      />
    </>
  );
};
// #endregion

// #region 커스텀 토스트 함수들
// 공통 토스트 생성 함수
const createEnhancedToast = (
  type: string,
  background: string,
  borderColor: string,
  color: string
) => {
  return (message: string, options?: Record<string, unknown>) => {
    return toast.custom(
      () => (
        <div 
          className={`toast-${type}-content`}
          style={{
            ...TOAST_STYLES.text,
            ...TOAST_STYLES.container,
            ...TOAST_STYLES.shadow,
            background,
            borderColor,
            color,
            minHeight: '64px',
          }}
        >
          {message}
        </div>
      ),
      { duration: 4000, ...options }
    );
  };
};

// 각 색상별 토스트 함수 생성
const primaryToast = createEnhancedToast(
  'primary',
  'hsl(var(--primary))',
  'hsl(var(--primary-7))',
  'hsl(var(--primary-foreground))'
);

const secondaryToast = createEnhancedToast(
  'secondary',
  'hsl(var(--secondary))',
  'hsl(var(--secondary-7))',
  'hsl(var(--secondary-foreground))'
);

const successToast = createEnhancedToast(
  'success',
  'hsl(var(--success))',
  'hsl(142 71% 30%)',
  'hsl(var(--success-foreground))'
);

const errorToast = createEnhancedToast(
  'error',
  'hsl(var(--destructive))',
  'hsl(0 72% 35%)',
  'hsl(var(--destructive-foreground))'
);

const warningToast = createEnhancedToast(
  'warning',
  'hsl(var(--warning))',
  'hsl(38 92% 35%)',
  'hsl(var(--warning-foreground))'
);

const infoToast = createEnhancedToast(
  'info',
  'hsl(var(--primary))',
  'hsl(var(--primary-7))',
  'hsl(var(--primary-foreground))'
);

// 기존 toast 함수를 확장한 객체
const customToast = {
  ...toast,
  primary: primaryToast,
  secondary: secondaryToast,
  success: successToast,
  error: errorToast,
  warning: warningToast,
  info: infoToast,
};
// #endregion

export { ToastProvider, toast, customToast }; 