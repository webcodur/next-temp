'use client';

import { QueryProvider } from './QueryProvider';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * 앱의 모든 Provider들을 통합
 * 순서 중요: 외부에서 내부 순으로 의존성이 있는 경우를 고려
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // 글로벌 에러 처리
        console.error('글로벌 에러:', error);
        console.error('에러 정보:', errorInfo);
        
        // 에러 리포팅 서비스로 전송
        // reportToErrorService(error, errorInfo);
      }}
    >
      <QueryProvider>
        {children}
      </QueryProvider>
    </ErrorBoundary>
  );
} 