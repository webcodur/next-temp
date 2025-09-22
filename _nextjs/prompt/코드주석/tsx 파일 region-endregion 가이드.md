# TSX 파일 구조 및 주석 가이드

## 1. 파일 헤더 주석 (필수)

모든 `.tsx` 파일 최상단에는 파일의 목적을 명확히 하는 헤더 주석을 작성한다.

- **내용**: 파일 경로, 핵심 기능, 단일 책임을 3줄 이내로 간결하게 기술한다.
- **구분**: 헤더와 코드 영역은 `// ------------------------------` 구분선으로 분리한다.

**예시:**

```tsx
/* 
  파일명: /components/ui/button/Button.tsx
  기능: UI 시스템의 기본 버튼 컴포넌트
  책임: 상태(raised, inset)에 따른 뉴모피즘 스타일을 적용한다.
*/ // ------------------------------  
```

## 2. Import 정렬 규칙 (필수)

헤더 주석 다음에는 import 문을 정렬한다. 그룹 간 1줄 공백을 두며, 그룹 내부는 알파벳 오름차순으로 정렬한다.

1. **React 핵심**: `react`, `next` 등
2. **서드파티 라이브러리**: `@tanstack/*`, `framer-motion` 등
3. **절대경로 모듈**: `@/components/*`, `@/hooks/*` 등
4. **상대경로 모듈**: `./utils`, `../types` 등
5. **타입 및 스타일**: `type … from`, `import './styles.css'`

## 3. 코드 구조화: Region (권장)

컴포넌트의 내부 로직은 가독성 향상을 위해 논리적 단위에 따라 `#region`과 `#endregion`으로 그룹화한다.

- **순서**: **타입 → 상수 → 상태 → 훅 → 핸들러 → 렌더링** 순서를 따른다.
- **생략**: 필요 없는 섹션은 생략할 수 있다.

## 4. 전체 구조 예시

```tsx
/* 
  파일명: /components/auth/LoginForm.tsx
  기능: 로그인 페이지에서 사용되는 폼 컴포넌트
  책임: 사용자 인증 및 입력값 검증을 처리한다.
*/ // ------------------------------

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button/Button';
import { Field } from '@/components/ui/input/field';
import { useAuth } from '@/store/auth';

import type { LoginCredentials } from '@/types/auth';

// #region 타입 및 스키마
const loginSchema = z.object({
	email: z.string().email('유효한 이메일을 입력하세요.'),
	password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
});
// #endregion

// #region 상수
const FORM_ID = 'login-form';
// #endregion

export function LoginForm() {
	// #region 상태
	const [isLoading, setIsLoading] = useState(false);
	// #endregion

	// #region 훅
	const { login } = useAuth();
	const form = useForm<LoginCredentials>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: '', password: '' },
	});
	// #endregion

	// #region 핸들러
	const handleSubmit = async (values: LoginCredentials) => {
		setIsLoading(true);
		try {
			await login(values);
			// 성공/실패 토스트 알림 로직 추가 가능
		} catch (error) {
			console.error('Login failed:', error);
		} finally {
			setIsLoading(false);
		}
	};
	// #endregion

	// #region 렌더링
	return (
		<form id={FORM_ID} onSubmit={form.handleSubmit(handleSubmit)}>
			<Field.Text
				form={form}
				name="email"
				label="이메일"
				placeholder="email@example.com"
			/>
			<Field.Text
				form={form}
				name="password"
				label="비밀번호"
				type="password"
			/>
			<Button type="submit" disabled={isLoading}>
				{isLoading ? '로그인 중...' : '로그인'}
			</Button>
		</form>
	);
	// #endregion
}
```
