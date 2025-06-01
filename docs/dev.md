# 개발 가이드

## 프로젝트 개요

Next.js 15 기반의 모던 웹 애플리케이션 보일러플레이트

### 기술 스택

- **프레임워크**: Next.js 15.3.3 (Turbopack)
- **언어**: TypeScript 5
- **스타일링**: Tailwind CSS 3.4.0
- **아이콘**: lucide-react 0.511.0
- **상태 관리**: Jotai 2.12.5
- **서버 상태**: TanStack React Query 5.79.0
- **폼 관리**: React Hook Form 7.56.4
- **스키마 검증**: Zod 3.25.43
- **애니메이션**: Framer Motion 12.15.0
- **차트**: Recharts 2.15.3
- **알림**: Sonner 2.0.4

## 작업별 라이브러리 사용

### 상태 관리

- **전역 상태 관리**: Jotai
- **서버 상태 관리**: TanStack React Query
- **로컬 상태 관리**: React useState

### 폼 처리

- **폼 상태 관리**: React Hook Form
- **스키마 검증**: Zod
- **날짜 처리**: date-fns

### 스타일링

- **CSS 프레임워크**: Tailwind CSS
- **조건부 클래스**: clsx
- **클래스 병합**: tailwind-merge
- **컴포넌트 변형**: class-variance-authority

### UI 컴포넌트

- **아이콘**: lucide-react
- **데이터 테이블**: TanStack React Table
- **차트**: Recharts
- **알림**: Sonner

### 애니메이션

- **컴포넌트 애니메이션**: Framer Motion
- **페이지 전환**: Framer Motion
- **간단한 전환**: CSS Transitions

### 테스트

- **단위 테스트**: Vitest
- **컴포넌트 테스트**: Testing Library

### 개발 도구

- **린팅**: ESLint
- **포매팅**: Prettier
- **타입 체크**: TypeScript
- **번들링**: Turbopack

## 프로젝트 구조

```plaintext
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # 전역 스타일
│   ├── layout.tsx      # 루트 레이아웃
│   └── page.tsx        # 홈페이지
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/             # 기본 UI 컴포넌트
│   └── layout/         # 레이아웃 컴포넌트
├── lib/                # 유틸리티 함수
├── hooks/              # 커스텀 훅
├── stores/             # Jotai 스토어
└── types/              # TypeScript 타입 정의
```

## 개발 스크립트

```plaintext
npm run dev      # 개발 서버 실행 (Turbopack)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```

## 향후 계획

### 단기 목표 (1-2주)

- [ ] 다크 모드 토글 기능 (Jotai 활용)
- [ ] 기본 폼 컴포넌트 (React Hook Form + Zod)
- [ ] 데이터 테이블 구성 (TanStack Table)

### 중기 목표 (1개월)

- [ ] 사용자 인증 시스템
- [ ] API 연동 (React Query)
- [ ] 차트 대시보드 (Recharts)

### 장기 목표 (3개월)

- [ ] 고급 애니메이션 (Framer Motion)
- [ ] 실시간 알림 시스템 (Sonner)
- [ ] 성능 최적화

## 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Tailwind CSS 가이드](https://tailwindcss.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Jotai 문서](https://jotai.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Framer Motion](https://www.framer.com/motion/)
