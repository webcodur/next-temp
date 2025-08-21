# 🖥️ 서버 에러 핸들링 가이드

## 📌 핵심 원칙

모든 에러를 구조화된 로그로 기록하고, 민감한 정보 노출 없이 안정적인 서비스를 유지한다.

## 🎯 에러 우선순위

- **CRITICAL**: 시스템 전체 장애 → 즉시 알림
- **HIGH**: 특정 기능 장애 → 빠른 대응
- **MEDIUM**: 개별 요청 실패 → 재시도로 해결 가능
- **LOW**: 성능/리소스 경고 → 모니터링 필요

## 🛠️ 구현 방법

### 1. Winston 로깅
```javascript
// JSON 구조화 로그
{
  "timestamp": "2024-01-01T10:00:00Z",
  "level": "error",
  "service": "hub-new",
  "message": "API 호출 실패",
  "context": { "endpoint": "/api/parking", "userId": "123" }
}
```

### 2. PM2 설정
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'hub-new',
    script: 'npm start',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: './logs/error.log',
    out_file: './logs/out.log'
  }]
};
```

### 3. API 에러 핸들러
```typescript
// withErrorHandler로 API 라우트 감싸기
export const POST = withErrorHandler(async (request) => {
  // 에러 발생시 자동 로깅 + 안전한 응답
});
```

### 4. 민감정보 보호
- 프로덕션: 클라이언트에 일반 메시지만 전송
- 개발환경: 상세 에러 정보 콘솔 출력
- 로그: 패스워드/토큰 자동 마스킹 