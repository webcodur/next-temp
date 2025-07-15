# 🚧 에러 핸들링 시스템 구현 작업 계획

## 📌 작업 개요
**목표**: Next.js 주차관리 시스템에 에러 핸들링 시스템 구현  
**기간**: 3.5일 (다국어 제외)  
**담당**: 개발팀  

## 📋 Phase 1: 기반 구축 (1일)

### 🎯 **Day 1 - 오전 (4시간)**

#### **1.1 Winston 설치 및 의존성 추가**
```bash
npm install winston
npm install --save-dev @types/winston
```

#### **1.2 에러 타입 시스템 구축**
**파일**: `src/types/error.ts`
```typescript
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION', 
  BUSINESS = 'BUSINESS',
  AUTH = 'AUTH',
  RUNTIME = 'RUNTIME'
}

export interface AppError {
  type: ErrorType;
  code: string;
  message: string;
  context?: Record<string, any>;
  timestamp: number;
}

export class CustomError extends Error implements AppError {
  type: ErrorType;
  code: string;
  context?: Record<string, any>;
  timestamp: number;

  constructor(type: ErrorType, code: string, message: string, context?: Record<string, any>) {
    super(message);
    this.type = type;
    this.code = code;
    this.context = context;
    this.timestamp = Date.now();
    this.name = 'CustomError';
  }
}
```

### 🎯 **Day 1 - 오후 (4시간)**

#### **1.3 서버 로거 구현**
**파일**: `src/lib/logger.ts`
```typescript
import winston from 'winston';
import path from 'path';

const logDir = path.join(process.cwd(), 'logs');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'hub-new' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log') 
    })
  ]
});

export class AppLogger {
  static error(message: string, meta?: any) {
    logger.error(message, { ...meta, timestamp: new Date().toISOString() });
  }
  
  static warn(message: string, meta?: any) {
    logger.warn(message, { ...meta, timestamp: new Date().toISOString() });
  }
  
  static info(message: string, meta?: any) {
    logger.info(message, { ...meta, timestamp: new Date().toISOString() });
  }
  
  static debug(message: string, meta?: any) {
    logger.debug(message, { ...meta, timestamp: new Date().toISOString() });
  }
}
```

#### **1.4 로그 디렉토리 생성**
```bash
mkdir logs
echo "logs/" >> .gitignore
```

## 📋 Phase 2: API 에러 처리 (1일)

### 🎯 **Day 2 - 오전 (4시간)**

#### **2.1 API 에러 핸들러 구현**
**파일**: `src/lib/api-error-handler.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { AppLogger } from './logger';
import { CustomError, ErrorType } from '@/types/error';

export function withErrorHandler(handler: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      // 에러 로깅
      const errorMeta = {
        method: req.method,
        url: req.url,
        userAgent: req.headers.get('user-agent'),
        timestamp: new Date().toISOString()
      };

      if (error instanceof CustomError) {
        AppLogger.error(`Custom Error: ${error.message}`, {
          ...errorMeta,
          type: error.type,
          code: error.code,
          context: error.context
        });
        
        return NextResponse.json(
          { 
            error: error.message,
            code: error.code,
            type: error.type
          }, 
          { status: getStatusCode(error.type) }
        );
      } else {
        AppLogger.error(`Unexpected Error: ${error.message}`, {
          ...errorMeta,
          stack: error.stack
        });
        
        return NextResponse.json(
          { error: 'Internal Server Error' }, 
          { status: 500 }
        );
      }
    }
  };
}

function getStatusCode(errorType: ErrorType): number {
  switch (errorType) {
    case ErrorType.VALIDATION: return 400;
    case ErrorType.AUTH: return 401;
    case ErrorType.BUSINESS: return 422;
    case ErrorType.NETWORK: return 503;
    default: return 500;
  }
}
```

### 🎯 **Day 2 - 오후 (4시간)**

#### **2.2 기존 API 라우트에 적용**
**대상 파일들**:
- `src/app/api/parking/*/route.ts`
- `src/app/api/member/*/route.ts`
- `src/app/api/community/*/route.ts`

**적용 예시**:
```typescript
// Before
export async function POST(request: Request) {
  // 로직
}

// After  
import { withErrorHandler } from '@/lib/api-error-handler';

export const POST = withErrorHandler(async (request: Request) => {
  // 로직
});
```

#### **2.3 API 에러 테스트**
**파일**: `src/app/api/test-error/route.ts`
```typescript
import { withErrorHandler } from '@/lib/api-error-handler';
import { CustomError, ErrorType } from '@/types/error';

export const POST = withErrorHandler(async (request: Request) => {
  const { errorType } = await request.json();
  
  switch (errorType) {
    case 'validation':
      throw new CustomError(ErrorType.VALIDATION, 'INVALID_INPUT', '입력값이 올바르지 않습니다.');
    case 'business':
      throw new CustomError(ErrorType.BUSINESS, 'PARKING_FULL', '주차장이 만석입니다.');
    case 'runtime':
      throw new Error('예기치 못한 에러');
    default:
      return Response.json({ message: '정상 처리' });
  }
});
```

## 📋 Phase 3: 클라이언트 에러 표시 (1일)

### 🎯 **Day 3 - 오전 (4시간)**

#### **3.1 클라이언트 에러 핸들러 구현**
**파일**: `src/lib/client-error-handler.ts`
```typescript
import { toast } from 'sonner';
import { AppError, ErrorType } from '@/types/error';

// 임시 다국어 메시지 (추후 i18n 연동)
const ERROR_MESSAGES = {
  ko: {
    [ErrorType.NETWORK]: '네트워크 오류',
    [ErrorType.VALIDATION]: '입력값 오류', 
    [ErrorType.BUSINESS]: '비즈니스 로직 오류',
    [ErrorType.AUTH]: '인증 오류',
    [ErrorType.RUNTIME]: '시스템 오류'
  },
  en: {
    [ErrorType.NETWORK]: 'Network Error',
    [ErrorType.VALIDATION]: 'Validation Error',
    [ErrorType.BUSINESS]: 'Business Logic Error', 
    [ErrorType.AUTH]: 'Authentication Error',
    [ErrorType.RUNTIME]: 'System Error'
  }
} as const;

export class ClientErrorHandler {
  static show(error: AppError, locale: 'ko' | 'en' = 'ko') {
    const messages = ERROR_MESSAGES[locale];
    
    // 토스트 표시
    toast.error(messages[error.type] || '알 수 없는 오류', {
      description: error.message,
      action: error.type === ErrorType.NETWORK ? {
        label: locale === 'ko' ? '재시도' : 'Retry',
        onClick: () => window.location.reload()
      } : undefined,
      duration: 5000
    });
    
    // 개발환경 콘솔 출력
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Client Error');
      console.error('Type:', error.type);
      console.error('Code:', error.code);
      console.error('Message:', error.message);
      console.error('Context:', error.context);
      console.error('Timestamp:', new Date(error.timestamp));
      console.groupEnd();
    }
  }
  
  static fromApiError(response: any, locale: 'ko' | 'en' = 'ko') {
    const error: AppError = {
      type: response.type || ErrorType.NETWORK,
      code: response.code || 'API_ERROR',
      message: response.error || response.message || '알 수 없는 오류가 발생했습니다.',
      timestamp: Date.now()
    };
    
    this.show(error, locale);
    return error;
  }
}
```

### 🎯 **Day 3 - 오후 (4시간)**

#### **3.2 React Error Boundary 구현**
**파일**: `src/components/ErrorBoundary.tsx`
```typescript
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ClientErrorHandler } from '@/lib/client-error-handler';
import { ErrorType } from '@/types/error';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    ClientErrorHandler.show({
      type: ErrorType.RUNTIME,
      code: 'COMPONENT_CRASH',
      message: error.message,
      context: { 
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      },
      timestamp: Date.now()
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="neu-flat p-6 rounded-lg max-w-md mx-auto mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            오류가 발생했습니다
          </h2>
          <p className="text-secondary mb-4">
            페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
          </p>
          <button 
            className="neu-raised px-4 py-2 rounded-lg"
            onClick={() => window.location.reload()}
          >
            새로고침
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### **3.3 API 호출 유틸리티 구현**
**파일**: `src/lib/api-client.ts`
```typescript
import { ClientErrorHandler } from './client-error-handler';
import { ErrorType } from '@/types/error';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  code?: string;
  type?: ErrorType;
}

export class ApiClient {
  static async request<T>(
    url: string, 
    options: RequestInit = {}, 
    locale: 'ko' | 'en' = 'ko'
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        ClientErrorHandler.fromApiError(data, locale);
        throw new Error(data.error || 'API 요청 실패');
      }

      return data.data || data as T;
    } catch (error) {
      if (error instanceof TypeError) {
        // 네트워크 에러
        ClientErrorHandler.show({
          type: ErrorType.NETWORK,
          code: 'NETWORK_FAILURE',
          message: '네트워크 연결을 확인해주세요.',
          timestamp: Date.now()
        }, locale);
      }
      throw error;
    }
  }

  static get<T>(url: string, locale?: 'ko' | 'en') {
    return this.request<T>(url, { method: 'GET' }, locale);
  }

  static post<T>(url: string, body?: any, locale?: 'ko' | 'en') {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }, locale);
  }

  static put<T>(url: string, body?: any, locale?: 'ko' | 'en') {
    return this.request<T>(url, {
      method: 'PUT', 
      body: JSON.stringify(body)
    }, locale);
  }

  static delete<T>(url: string, locale?: 'ko' | 'en') {
    return this.request<T>(url, { method: 'DELETE' }, locale);
  }
}
```

## 📋 Phase 4: PM2 설정 최적화 (0.5일)

### 🎯 **Day 4 - 오전 (4시간)**

#### **4.1 PM2 Ecosystem 설정**
**파일**: `ecosystem.config.js`
```javascript
module.exports = {
  apps: [{
    name: 'hub-new',
    script: 'npm',
    args: 'start',
    cwd: './',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_file: './logs/combined.log',
    merge_logs: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000
  }]
};
```

#### **4.2 로그 로테이션 설정**
**파일**: `pm2-logrotate.config.js`
```javascript
module.exports = {
  max_size: '10M',        // 10MB로 로그 파일 분할
  retain: 30,             // 30개 파일 보관
  compress: true,         // gzip 압축
  dateFormat: 'YYYY-MM-DD_HH-mm-ss',
  workerInterval: 30,     // 30초마다 체크
  rotateInterval: '0 0 * * *'  // 매일 자정 로테이션
};
```

#### **4.3 Package.json 스크립트 추가**
```json
{
  "scripts": {
    "pm2:start": "pm2 start ecosystem.config.js",
    "pm2:stop": "pm2 stop hub-new",
    "pm2:restart": "pm2 restart hub-new", 
    "pm2:logs": "pm2 logs hub-new",
    "pm2:monitor": "pm2 monit",
    "pm2:flush": "pm2 flush"
  }
}
```

## 📋 통합 테스트 및 검증 (Day 4 - 오후)

### **4.4 에러 핸들링 테스트 시나리오**

#### **서버 에러 테스트**
```bash
# 1. 서버 시작
npm run pm2:start

# 2. API 에러 테스트
curl -X POST http://localhost:3000/api/test-error \
  -H "Content-Type: application/json" \
  -d '{"errorType": "validation"}'

# 3. 로그 확인
pm2 logs hub-new
tail -f logs/error.log
```

#### **클라이언트 에러 테스트**
**파일**: `src/app/error-test/page.tsx`
```typescript
'use client';

import { ApiClient } from '@/lib/api-client';
import { ClientErrorHandler } from '@/lib/client-error-handler';
import { ErrorType } from '@/types/error';

export default function ErrorTestPage() {
  const testServerError = async () => {
    try {
      await ApiClient.post('/api/test-error', { errorType: 'validation' });
    } catch (error) {
      console.log('서버 에러 테스트 완료');
    }
  };

  const testClientError = () => {
    ClientErrorHandler.show({
      type: ErrorType.BUSINESS,
      code: 'TEST_ERROR',
      message: '클라이언트 테스트 에러입니다.',
      timestamp: Date.now()
    });
  };

  const testRuntimeError = () => {
    throw new Error('런타임 에러 테스트');
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">에러 핸들링 테스트</h1>
      
      <button 
        onClick={testServerError}
        className="neu-raised px-4 py-2 rounded-lg"
      >
        서버 에러 테스트
      </button>
      
      <button 
        onClick={testClientError}
        className="neu-raised px-4 py-2 rounded-lg"
      >
        클라이언트 에러 테스트
      </button>
      
      <button 
        onClick={testRuntimeError}
        className="neu-raised px-4 py-2 rounded-lg"
      >
        런타임 에러 테스트
      </button>
    </div>
  );
}
```

## 📋 체크리스트

### **Phase 1 완료 확인**
- [ ] Winston 설치 완료
- [ ] `src/types/error.ts` 생성 및 타입 정의
- [ ] `src/lib/logger.ts` 구현
- [ ] `logs/` 디렉토리 생성
- [ ] .gitignore에 logs 추가

### **Phase 2 완료 확인**
- [ ] `src/lib/api-error-handler.ts` 구현
- [ ] 기존 API 라우트에 withErrorHandler 적용
- [ ] API 에러 테스트 라우트 생성
- [ ] 로그 파일에 에러 기록 확인

### **Phase 3 완료 확인**
- [ ] `src/lib/client-error-handler.ts` 구현
- [ ] `src/components/ErrorBoundary.tsx` 구현
- [ ] `src/lib/api-client.ts` 구현
- [ ] 토스트 에러 표시 확인

### **Phase 4 완료 확인**
- [ ] `ecosystem.config.js` 생성
- [ ] PM2 스크립트 추가
- [ ] 로그 로테이션 설정
- [ ] PM2로 서버 실행 테스트

### **최종 검증**
- [ ] 서버 에러 → 로그 파일 기록 확인
- [ ] 클라이언트 에러 → 토스트 표시 확인
- [ ] Error Boundary → 컴포넌트 크래시 처리 확인
- [ ] PM2 로그 → 실시간 모니터링 확인

## 🚨 주의사항

1. **로그 파일 권한**: PM2 실행 시 로그 디렉토리 쓰기 권한 확인
2. **메모리 관리**: 로그 파일 크기 모니터링 (로테이션 설정 필수)
3. **에러 메시지**: 민감한 정보 노출 방지 (프로덕션 환경)
4. **다국어 대응**: Phase 5에서 하드코딩 메시지를 i18n 키로 교체

## 📅 예상 일정

| Phase | 작업 내용 | 소요 시간 | 완료 예정일 |
|-------|-----------|-----------|-------------|
| 1 | 기반 구축 | 1일 | Day 1 |
| 2 | API 에러 처리 | 1일 | Day 2 |  
| 3 | 클라이언트 에러 표시 | 1일 | Day 3 |
| 4 | PM2 설정 및 테스트 | 0.5일 | Day 4 |
| **총계** | | **3.5일** | |

이 계획에 따라 구현하면 견고하고 확장 가능한 에러 핸들링 시스템이 완성된다. 