# 🖥️ 클라이언트 에러 핸들링 가이드

## 📌 핵심 원칙

사용자에게 명확한 에러 메시지를 다국어로 제공하고, 가능한 경우 복구 방법을 함께 안내한다.

## 🎯 에러 분류

- **NETWORK**: API 호출 실패 → 재시도 버튼 제공
- **VALIDATION**: 입력값 오류 → 해당 필드 하이라이트
- **BUSINESS**: 비즈니스 룰 위반 → 규칙 설명 및 대안 제시
- **AUTH**: 인증 문제 → 로그인 페이지 이동
- **RUNTIME**: 시스템 오류 → Error Boundary로 포착

## 🛠️ 구현 방법

### 1. 에러 표시
- **Sonner 토스트**: 에러 타입별 색상/아이콘 차별화
- **Error Boundary**: React 컴포넌트 크래시 방지
- **개발 콘솔**: 개발환경에서 상세 정보 출력

### 2. 다국어 지원
```typescript
// 기본 구조
const ERROR_MESSAGES = {
  ko: { NETWORK_ERROR: '네트워크 오류가 발생했습니다' },
  en: { NETWORK_ERROR: 'Network error occurred' },
  ar: { NETWORK_ERROR: 'حدث خطأ في الشبكة' }
};
```

### 3. 복구 액션
- 네트워크 에러 → 재시도 버튼
- 검증 에러 → 문제 필드 포커스
- 인증 에러 → 로그인 페이지 이동 