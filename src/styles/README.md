# 🎨 통합 디자인 시스템 가이드

## 1. 🏗️ 핵심 아키텍처

- **Tailwind 4.0**: `@import 'tailwindcss'` 기반의 최신 문법 사용
- **통합 CSS**: 모든 스타일은 `src/styles/design-system.css` 파일 하나로 통합 관리
- **CSS 변수**: HSL 색상 모델 기반의 체계적인 변수 시스템
- **뉴모피즘**: 사전 정의된 클래스셋을 통한 일관된 UI 질감

## 2. 🎨 색상 시스템: 이중 매핑 원칙

### 🎯 핵심 철학: 요소별 차별화된 매핑

다크모드는 단순히 색상을 반전시키는 것이 아니다. **요소의 역할**에 따라 서로 다른 매핑 전략을 적용하여 일관된 사용자 경험을 제공한다.

### ① 레이아웃 요소: 순차 매핑 (명도 관계 유지)

- **원칙**: 라이트/다크 모드에서 시각적 계층(밝고 어두움)을 동일하게 유지한다.
- **변수**: `--surface-1` (가장 밝음), `--surface-2` (중간), `--surface-3` (가장 어두움)
- **사용**: `bg-surface-1`, `bg-surface-2`, `bg-surface-3` 클래스 사용

```jsx
// ✅ 올바른 사용법
<main className="bg-surface-1">
	{' '}
	// 가장 밝은 본문
	<aside className="bg-surface-2">
		{' '}
		// 중간 밝기 사이드바
		<footer className="bg-surface-3"> // 가장 어두운 푸터</footer>
	</aside>
</main>
```

이 방식을 통해 사용자는 두 테마에서 동일한 공간감과 깊이를 느낄 수 있다.

### ② 콘텐츠 요소: 역순 매핑 (의미적 역할 유지)

- **원칙**: 텍스트, 아이콘 등 콘텐츠의 시각적 중요도를 두 테마에서 동일하게 유지한다.
- **변수**: `--foreground`, `--primary`, `--secondary`, `--accent` 등
- **사용**: `text-foreground`, `bg-primary` 등 일반적인 유틸리티 클래스 사용

```jsx
// ✅ 올바른 사용법
// 라이트: 어두운 글자(20%) vs 밝은 배경(98%)
// 다크: 밝은 글자(85%) vs 어두운 배경(8%)
<h1 className="text-primary">중요 제목</h1>
```

이를 통해 Primary 텍스트는 항상 배경과 최고 대비를 이루어 가독성을 보장한다.

### ③ 10단계 그레이 스케일

모든 색상 변수는 10단계 그레이 스케일(`--gray-0` ~ `--gray-9`)을 기반으로 체계적으로 정의되었다. 자세한 내용은 `src/styles/system/02-variables.css` 참고.

## 3. 📐 뉴모피즘 시스템

- **`.neu-flat`**: 평면 (기본 컨테이너, 패널)
- **`.neu-raised`**: 양각 (기본 버튼, 클릭 가능 요소)
- **`.neu-inset`**: 음각 (활성/선택된 상태)
- **`.sidebar-container`**: 사이드바 전용 (안정적인 그림자, 호버 효과 없음)

## 4. 🔧 핵심 사용 규칙

1.  **레이아웃 계층**: 반드시 `bg-surface-*` 클래스를 사용한다.
2.  **일반 컴포넌트**: `bg-card`, `bg-background`, `bg-muted`를 사용한다.
3.  **콘텐츠 색상**: `text-foreground`, `text-primary` 등 시맨틱 변수를 사용한다.
4.  **뉴모피즘**: 제공된 `neu-*` 클래스 외 커스텀 `box-shadow`를 만들지 않는다.
5.  **하드코딩 금지**: `bg-gray-200`, `text-[#333]` 와 같은 하드코딩된 색상 사용을 금지한다.

---

**📍 참고 문서:**

- **변수 상세**: `docs/design-system-variables.md`
- **다크모드 매핑**: `docs/dark-mode-color-mapping.md`
- **접근성 가이드**: `docs/accessibility-contrast-guide.md`
