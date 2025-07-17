# 환경 변수 설정 가이드

프로젝트 실행을 위해 환경 변수를 설정해야 합니다.

## 📝 설정 방법

1. 프로젝트 루트에 `.env.local` 파일을 생성합니다:

```bash
touch .env.local
```

2. 아래 내용을 복사해서 `.env.local` 파일에 붙여넣습니다:

```env
# API 설정
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_API_TIMEOUT=10000

# 개발 환경 설정
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=주차관리시스템
NEXT_PUBLIC_APP_VERSION=1.0.0

# 인증 설정
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# 로깅 설정
NEXT_PUBLIC_LOG_LEVEL=debug

# 캐시 설정
NEXT_PUBLIC_CACHE_TTL=300000
```

## 🔧 설정 항목 설명

### API 설정
- `NEXT_PUBLIC_API_URL`: 백엔드 API 서버 주소
- `NEXT_PUBLIC_API_TIMEOUT`: API 요청 타임아웃 (밀리초)

### 인증 설정
- `NEXTAUTH_SECRET`: JWT 토큰 서명용 시크릿 키 (운영환경에서는 반드시 변경)
- `NEXTAUTH_URL`: 프론트엔드 앱 주소

### 로깅 설정
- `NEXT_PUBLIC_LOG_LEVEL`: 로그 레벨 (debug, info, warn, error)

### 캐시 설정
- `NEXT_PUBLIC_CACHE_TTL`: 캐시 지속 시간 (밀리초)

## 🌍 환경별 설정

### 개발 환경 (.env.local)
```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_LOG_LEVEL=debug
```

### 스테이징 환경 (.env.staging)
```env
NODE_ENV=staging
NEXT_PUBLIC_API_URL=https://staging-api.example.com/api
NEXT_PUBLIC_LOG_LEVEL=info
```

### 운영 환경 (.env.production)
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.example.com/api
NEXT_PUBLIC_LOG_LEVEL=warn
NEXTAUTH_SECRET=production-secret-key-very-long-and-secure
```

## ⚠️ 보안 주의사항

1. **시크릿 키**: `NEXTAUTH_SECRET`는 운영환경에서 반드시 강력한 값으로 변경
2. **환경 파일 관리**: `.env.local`, `.env.production` 등은 Git에 커밋하지 않음
3. **API URL**: 운영환경에서는 HTTPS 사용 필수

## 🚀 설정 확인

환경 변수가 올바르게 설정되었는지 확인하려면:

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3000 접속
# 개발자 도구 콘솔에서 API 호출 로그 확인
```

## 📋 체크리스트

- [ ] `.env.local` 파일 생성
- [ ] API URL 설정 (`NEXT_PUBLIC_API_URL`)
- [ ] 인증 시크릿 설정 (`NEXTAUTH_SECRET`)
- [ ] 개발 서버 실행 확인
- [ ] API 요청 로깅 확인
- [ ] `.gitignore`에 `.env.local` 포함 확인

## ❓ 문제 해결

### API 연결 실패
- `NEXT_PUBLIC_API_URL`이 올바른지 확인
- 백엔드 서버가 실행 중인지 확인
- CORS 설정 확인

### 인증 문제
- `NEXTAUTH_SECRET` 설정 확인
- 쿠키 설정 확인

### 환경 변수 인식 안됨
- 파일명이 `.env.local`인지 확인
- 서버 재시작 필요
- `NEXT_PUBLIC_` 접두사 확인 