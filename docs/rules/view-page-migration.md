# View 폴더 페이지 마이그레이션 가이드

## 1. 작업 개요

- **실제 페이지 구현 위치**: `src/app/**` 에 있던 `page.tsx` 코드는 `src/view/**` 로 이동한다.
- **파일 네이밍 규칙**: `page.tsx` 금지. 의미 있는 컴포넌트명(`Home.tsx`, `FacilityInfoPage.tsx` 등)을 사용한다.
- **Bridge 패턴**: `src/app/**/page.tsx` 파일은 다음과 같이 간단히 View 페이지를 재-export 한다.

```tsx
'use client';
export { default } from '@/view/경로/ActualPageFile';
```

- **신규 페이지 작성**: 원본 `page.tsx` 가 존재하지 않을 경우, View 폴더에 새 페이지 컴포넌트를 만들고 `src/app` 에는 위와 같은 Bridge 파일만 추가한다.
- **절대경로 import**: `@/view/**` 경로가 그대로 동작하도록 `tsconfig.json` 의 `paths` 설정을 활용한다.
- **범위**: `lab` 디렉토리와 동적 [miltMenu] 등 실험용 페이지는 제외하고 실제 제품 페이지만 마이그레이션한다.

---
