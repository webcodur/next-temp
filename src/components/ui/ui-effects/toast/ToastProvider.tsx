"use client";

import * as React from "react";
import { Toaster, toast } from "sonner";

// #region ToastProvider 컴포넌트
const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    {children}
    <Toaster position="bottom-center" richColors toastOptions={{ duration: 3000 }} />
  </>
);
// #endregion

export { ToastProvider, toast }; 