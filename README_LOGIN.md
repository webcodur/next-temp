# 로그인 기능 사용 가이드

## 🚀 완성된 기능

### 1. 로그인 시스템
- **로그인 페이지**: `/login`
- **자동 리다이렉트**: 로그인 후 원래 페이지로 이동
- **토큰 기반 인증**: JWT 토큰을 쿠키에 저장
- **상태 관리**: Jotai를 사용한 전역 상태 관리

### 2. API 연동 방식

#### 🔧 개발/테스트용 (현재 기본 설정)
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3003/api
```

### 3. 지원하는 API 엔드포인트

| 메소드 | 경로 | 설명 | 클라이언트 함수 |
|--------|------|------|-----------------|
| `POST` | `/auth/signin` | 사용자 로그인 | `signInWithCredentials()` |
| `GET` | `/auth/logout` | 사용자 로그아웃 | `logout()` |
| `POST` | `/auth/refresh` | 토큰 갱신 | `refreshTokenWithString()` |

### 4. 데모 계정 (개발용)
| 계정 | 비밀번호 | 권한 |
|------|----------|------|
| `demo` | `1234` | 일반 사용자 |
| `admin` | `admin123` | 관리자 |

## 🛠️ 실제 API 연동 설정

### 1. 환경변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```bash
# 실제 백엔드 API 서버
NEXT_PUBLIC_API_BASE_URL=http://your-api-server:port/api

# 타임아웃 설정 (선택사항)
NEXT_PUBLIC_API_TIMEOUT=30000

# 인증 설정
JWT_SECRET=your-jwt-secret-key
```

### 2. API 서버 요구사항

백엔드 API 서버는 다음 응답 형식을 지원해야 합니다:

#### 로그인 API (`POST /auth/signin`)

**요청:**
```json
{
  "account": "user_account",
  "password": "user_password"
}
```

**성공 응답:**
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here", 
    "expiresIn": 86400,
    "user": {
      "id": 1,
      "account": "user_account",
      "name": "사용자명",
      "email": "user@example.com",
      "role": {
        "id": 1,
        "name": "admin" // 또는 "user"
      }
    }
  }
}
```

**실패 응답:**
```json
{
  "success": false,
  "errorMsg": "아이디 또는 비밀번호가 올바르지 않습니다."
}
```

#### 로그아웃 API (`GET /auth/logout`)

**성공 응답:**
```json
{
  "success": true,
  "message": "로그아웃이 완료되었습니다."
}
```

#### 토큰 갱신 API (`POST /auth/refresh`)

**요청:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**성공 응답:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token",
    "refreshToken": "new_refresh_token",
    "expiresIn": 86400
  }
}
```

### 3. 인증 헤더

모든 보호된 API 요청에는 자동으로 다음 헤더가 추가됩니다:

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

## 🔧 사용 방법

### 1. 개발 서버 실행
```bash
npm run dev
```

### 2. 실제 API 연동 테스트
1. `.env.local`에 실제 API 서버 URL 설정
2. `http://localhost:3000/login` 접속
3. 실제 계정으로 로그인 테스트
4. 네트워크 탭에서 API 호출 확인

### 3. 모킹 API vs 실제 API 전환
- **모킹 API**: `NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api`
- **실제 API**: `NEXT_PUBLIC_API_BASE_URL=http://your-server/api`

## 📁 주요 파일 구조

```
src/
├── services/auth/
│   ├── auth_signin_POST.ts     # 로그인 API 클라이언트
│   ├── auth_logout_GET.ts      # 로그아웃 API 클라이언트
│   └── auth_refresh_POST.ts    # 토큰 갱신 API 클라이언트
├── hooks/
│   ├── useAuth.ts              # 통합 인증 훅
│   └── useAuthCookie.ts        # 쿠키 관리 훅
├── app/api/auth/               # 개발용 모킹 API
│   ├── signin/route.ts         # 모킹 로그인 API
│   └── logout/route.ts         # 모킹 로그아웃 API
└── services/fetchClient.ts    # HTTP 클라이언트
```

## 🔒 보안 기능

### 자동 토큰 관리
- 쿠키 기반 토큰 저장 (js-cookie 사용)
- 자동 만료 처리 및 갱신
- 보안 설정 (secure, sameSite)

### 미들웨어 보호
- 보호된 경로 자동 인증 체크
- 토큰 검증 실패 시 자동 로그인 페이지 이동
- API 요청에 인증 헤더 자동 추가

## 🐛 문제 해결

### API 연결 오류
1. **네트워크 에러**: API 서버 실행 상태 확인
2. **CORS 에러**: 백엔드에서 CORS 설정 확인
3. **인증 실패**: 토큰 형식 및 만료 시간 확인

### 환경변수 적용 안 됨
1. 서버 재시작: `npm run dev` 재실행
2. 브라우저 캐시 삭제
3. `.env.local` 파일 경로 확인

### 토큰 관련 문제
1. **토큰 저장 안 됨**: 쿠키 설정 및 도메인 확인
2. **자동 로그아웃**: 토큰 만료 시간 확인
3. **권한 오류**: 사용자 역할 및 API 권한 확인

## 🎯 다음 단계

1. **실제 백엔드 연동**: API 서버 설정 및 연동 테스트
2. **JWT 라이브러리**: 서버사이드 JWT 검증 강화
3. **권한 관리**: 세분화된 역할 기반 접근 제어
4. **소셜 로그인**: OAuth 프로바이더 연동 