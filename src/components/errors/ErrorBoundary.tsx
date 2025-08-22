'use client';

import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw, ArrowLeft, Home } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import { Portal } from '@/components/ui/ui-layout/portal/Portal';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 로깅
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // 사용자 정의 에러 핸들러 호출
    this.props.onError?.(error, errorInfo);
    
    // 에러 리포팅 서비스에 전송 (예: Sentry)
    // reportError(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoBack = () => {
    // 에러 상태 리셋 후 뒤로가기
    this.setState({ hasError: false, error: null });
    window.history.back();
  };

  handleGoHome = () => {
    // 에러 상태 리셋 후 홈으로
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  handleCopyError = async () => {
    if (!this.state.error) return;
    
    const errorText = `Error: ${this.state.error.message}\n\nStack Trace:\n${this.state.error.stack}`;
    
    try {
      await navigator.clipboard.writeText(errorText);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  render() {
    if (this.state.hasError) {
      // 사용자 정의 fallback이 있으면 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 UI
      return (
        <Portal containerId="error-boundary-portal">
          <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-background font-multilang">
            <div className="w-full max-w-md text-center">
              {/* 메인 컨테이너 */}
              <div className="p-8 space-y-8 rounded-2xl neu-elevated">
                {/* 에러 아이콘 */}
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <AlertCircle className="w-20 h-20 text-red-500" />
                  </div>
                  <div className="mx-auto w-24 h-1 rounded-full bg-red-500/20"></div>
                </div>

                {/* 메시지 */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold font-multilang text-primary">
                    문제가 발생했습니다
                  </h2>
                  <p className="leading-relaxed font-multilang text-foreground/70">
                    예상치 못한 오류가 발생했습니다.
                    <br />
                    페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
                  </p>
                </div>

                {/* 액션 버튼 */}
                <div className="space-y-3">
                  <Button onClick={this.handleGoHome} className="w-full neu-raised">
                    <Home size={18} className="me-2" />
                    홈으로 이동
                  </Button>

                  <div className="flex gap-3">
                    <Button
                      onClick={this.handleGoBack}
                      variant="outline"
                      className="flex-1 neu-raised">
                      <ArrowLeft size={18} className="me-2" />
                      뒤로가기
                    </Button>
                    <Button
                      onClick={this.handleRetry}
                      variant="outline"
                      className="flex-1 neu-raised">
                      <RefreshCw size={18} className="me-2" />
                      다시 시도
                    </Button>
                  </div>
                </div>

                {/* 추가 정보 */}
                <div className="pt-4 border-t border-foreground/10">
                  <p className="text-sm font-multilang text-foreground/50">
                    Error Code: COMPONENT_ERROR
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook 형태의 에러 바운더리 (함수형 컴포넌트용)
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
} 