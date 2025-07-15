# 🚨 에러 핸들링 시스템 구축 보고서

## 📋 프로젝트 개요

**목표**: Next.js 기반 주차관리 시스템에 간소하면서도 체계적인 에러 핸들링 시스템 구축  
**범위**: Next.js 자체 백엔드 서버 로깅 + 클라이언트 에러 표시  
**전략**: 80/20 법칙 (서버 로깅 80% + 클라이언트 표시 20%)

## 🎯 핵심 판단 근거

### ✅ **구현 필요 영역**
- **Next.js API 라우트 에러**: 자체 백엔드 서버로 동작시 로깅 필수
- **클라이언트 에러 표시**: 사용자 경험 개선 (토스트 + 콘솔)
- **구조화된 에러 시스템**: 타입 안전성 및 유지보수성

### ❌ **구현 불필요 영역**  
- **클라이언트 → 서버 에러 전송**: 복잡성 대비 효과 미미
- **외부 API 에러 로깅**: 백엔드 서버에서 이미 처리됨
- **복잡한 에러 분석**: 주차관리 시스템 특성상 과도함

## 🏗️ 시스템 아키텍처

### **1. 에러 타입 시스템**
```typescript
// src/types/error.ts
enum ErrorType {
  NETWORK = 'NETWORK',        // API 호출 실패
  VALIDATION = 'VALIDATION',  // 폼 검증 에러
  BUSINESS = 'BUSINESS',      // 비즈니스 로직 에러
  AUTH = 'AUTH',             // 인증 에러
  RUNTIME = 'RUNTIME'        // 런타임 에러
}

interface AppError {
  type: ErrorType;
  code: string;
  message: string;
  context?: Record<string, any>;
  timestamp: number;
}
```

### **2. 서버 로깅 시스템** (Winston + PM2)
```typescript
// src/lib/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

export class AppLogger {
  static error(message: string, meta?: any) {
    logger.error(message, { ...meta, service: 'hub-new' });
  }
  
  static info(message: string, meta?: any) {
    logger.info(message, { ...meta, service: 'hub-new' });
  }
}
```

### **3. 클라이언트 에러 표시** (다국어 지원)
```typescript
// src/lib/client-error-handler.ts  
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useI18n';

export class ClientErrorHandler {
  static show(error: AppError) {
    const t = useTranslations();
    
    // 토스트 표시 (다국어 처리)
    toast.error(t(`에러_${error.type}`), {
      description: t(`에러_${error.code}`) || error.message,
      action: error.type === 'NETWORK' ? {
        label: t('공통_재시도'),
        onClick: () => window.location.reload()
      } : undefined
    });
    
    // 개발환경 콘솔 출력
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 Client Error:', error);
    }
  }
}
```

**⚠️ 다국어 처리 참고사항**:
- 클라이언트 에러는 사용자에게 표시되므로 다국어 지원 필수
- 서버 에러 로깅은 개발자/운영팀용이므로 다국어 불필요
- 다국어 키 추가는 추후 작업으로 예정 (Phase 5로 이관)

## 📦 구현 계획

### **Phase 1: 기반 구축** (1일)
1. **Winston 설치 및 설정**
   ```bash
   npm install winston
   ```

2. **에러 타입 정의**
   - `src/types/error.ts` 생성
   - 기본 에러 인터페이스 구현

3. **서버 로거 구현**
   - `src/lib/logger.ts` 생성
   - PM2 호환 설정

### **Phase 2: API 에러 처리** (1일)
1. **API 라우트 에러 핸들러**
   ```typescript
   // src/lib/api-error-handler.ts
   export function withErrorHandler(handler: Function) {
     return async (req: Request) => {
       try {
         return await handler(req);
       } catch (error) {
         AppLogger.error('API Error', {
           method: req.method,
           url: req.url,
           error: error.message,
           stack: error.stack
         });
         
         return Response.json(
           { error: 'Internal Server Error' }, 
           { status: 500 }
         );
       }
     };
   }
   ```

2. **기존 API 라우트에 적용**

### **Phase 3: 클라이언트 에러 표시** (1일)
1. **에러 표시 컴포넌트**
   - `ClientErrorHandler` 클래스 구현
   - 기존 Sonner 토스트 시스템 확장

2. **기본 에러 메시지** (영어/한국어 하드코딩)
   - 다국어 시스템 준비되기 전까지 임시 메시지
   - 에러 타입별 차별화된 메시지

3. **React Error Boundary**
   ```typescript
   // src/components/ErrorBoundary.tsx
   class ErrorBoundary extends Component {
     componentDidCatch(error: Error, errorInfo: ErrorInfo) {
       ClientErrorHandler.show({
         type: ErrorType.RUNTIME,
         code: 'COMPONENT_CRASH',
         message: error.message,
         context: { componentStack: errorInfo.componentStack },
         timestamp: Date.now()
       });
     }
   }
   ```

### **Phase 4: PM2 설정 최적화** (0.5일)
1. **ecosystem.config.js 생성**
   ```javascript
   module.exports = {
     apps: [{
       name: 'hub-new',
       script: 'npm',
       args: 'start',
       log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
       merge_logs: true,
       max_restarts: 10,
       min_uptime: '10s'
     }]
   };
   ```

2. **로그 디렉토리 생성**
   ```bash
   mkdir logs
   ```

### **Phase 5: 다국어 에러 메시지** (추후 작업)
⚠️ **현재는 수행하지 않고 추후 처리 예정**

1. **에러 메시지 다국어 키 추가**
   - `src/locales/ko.json`: 한국어 에러 메시지
   - `src/locales/en.json`: 영어 에러 메시지  
   - `src/locales/ar.json`: 아랍어 에러 메시지

2. **클라이언트 에러 핸들러 다국어 연동**
   - 하드코딩된 메시지를 다국어 키로 교체
   - 에러 코드별 세분화된 메시지

## 🔧 사용법 예시

### **API 라우트에서**
```typescript
// src/app/api/parking/route.ts
import { withErrorHandler } from '@/lib/api-error-handler';

export const POST = withErrorHandler(async (request: Request) => {
  // 에러 발생시 자동으로 로깅됨
  const data = await parkingService.create(body);
  return Response.json(data);
});
```

### **클라이언트에서**
```typescript
// 컴포넌트에서 에러 처리
try {
  await fetch('/api/parking', { method: 'POST', body });
} catch (error) {
  ClientErrorHandler.show({
    type: ErrorType.NETWORK,
    code: 'API_CALL_FAILED',
    message: error.message,
    timestamp: Date.now()
  });
}
```

### **PM2 로그 확인**
```bash
# 실시간 로그 확인
pm2 logs hub-new

# 에러 로그만 확인
pm2 logs hub-new --err

# 로그 파일 직접 확인  
tail -f logs/error.log
```

## 📊 예상 효과

### **개발 생산성**
- 구조화된 에러 추적으로 디버깅 시간 단축
- 타입 안전한 에러 처리로 버그 예방
- PM2 로그 통합으로 모니터링 효율성 증대

### **사용자 경험**
- 명확한 에러 메시지로 사용자 혼란 방지  
- 다국어 에러 메시지로 접근성 향상
- 재시도 버튼 등 복구 액션 제공

### **운영 안정성**
- 서버 에러 체계적 로깅으로 장애 대응 신속화
- JSON 구조화 로그로 분석 도구 연동 용이
- 점진적 확장 가능한 아키텍처

## 🚫 제외 사항

1. **클라이언트 → 서버 에러 전송**: 복잡성 대비 효과 미미
2. **외부 로깅 서비스**: Sentry 등은 추후 필요시 도입
3. **복잡한 에러 분석**: 현재 프로젝트 규모에 과도함
4. **실시간 알림**: 이메일/슬랙 알림 등은 운영 단계에서 고려

## 📅 총 소요 예상 시간: 3.5일 (다국어 제외)

- **Phase 1-4**: 3.5일 (즉시 구현)
- **Phase 5**: 추후 작업 (다국어 시스템 구축 후)

이 시스템으로 **Next.js 자체 백엔드 에러는 체계적 로깅**, **클라이언트 에러는 명확한 표시**가 가능하며, 향후 다국어 확장성도 확보된다. 