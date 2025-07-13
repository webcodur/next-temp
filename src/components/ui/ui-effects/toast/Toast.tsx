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
        position="bottom-center"
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

export { ToastProvider, toast }; 