'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 스케일 재요청 방지
            staleTime: 60 * 1000, // 1분
            // 백그라운드에서 자동 재요청
            refetchOnWindowFocus: false,
            // 네트워크 재연결 시 재요청
            refetchOnReconnect: true,
            // 에러 재시도 설정
            retry: (failureCount, error) => {
              // 인증 에러나 404는 재시도하지 않음
              if (error instanceof Error) {
                const errorWithStatus = error as Error & { status?: number; code?: number };
                const status = errorWithStatus.status || errorWithStatus.code;
                if (status === 401 || status === 403 || status === 404) {
                  return false;
                }
              }
              return failureCount < 3;
            },
            // 재시도 지연
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // 뮤테이션 에러 재시도 설정
            retry: (failureCount, error) => {
              // 클라이언트 에러는 재시도하지 않음
              if (error instanceof Error) {
                const errorWithStatus = error as Error & { status?: number; code?: number };
                const status = errorWithStatus.status || errorWithStatus.code;
                if (status && status >= 400 && status < 500) {
                  return false;
                }
              }
              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
} 