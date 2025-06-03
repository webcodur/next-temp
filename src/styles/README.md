# 스타일 구조 가이드

이 디렉토리는 프로젝트의 모든 CSS 스타일을 체계적으로 관리한다.

## 📁 디렉토리 구조

```plaintext
src/styles/
├── globals.css          # 메인 진입점 (모든 CSS import)
├── variables.css        # CSS 변수 정의
├── base.css            # 기본 HTML 스타일
├── components.css      # 재사용 컴포넌트 클래스
├── fonts.css           # 폰트 설정
└── neumorphism/        # 뉴모피즘 스타일 모음
    ├── index.css       # 뉴모피즘 진입점
    ├── base.css        # 기본 뉴모피즘 스타일
    ├── buttons.css     # 버튼 관련 스타일
    ├── inputs.css      # 입력 필드 관련 스타일
    ├── containers.css  # 컨테이너 관련 스타일
    └── cards.css       # 카드 관련 스타일
```

## 📄 파일별 역할

### `globals.css`

- **역할**: 모든 CSS 파일의 진입점
- **내용**: 다른 CSS 파일들을 import하고 Tailwind 지시어 포함
- **수정**: 새로운 CSS 파일 추가 시에만 수정

### `variables.css` (68줄)

- **역할**: 프로젝트 전체에서 사용하는 CSS 변수 정의
- **내용**:
  - 기본 색상값 변수 (white, black, gray 계열, red 계열)
  - 의미론적 색상 변수 (primary, secondary, background 등)
  - 다크모드 변수
- **수정**: 새로운 색상이나 테마 변수 추가 시

### `base.css` (47줄)

- **역할**: 기본 HTML 요소 스타일과 유틸리티 클래스
- **내용**:
  - HTML 기본 스타일 (\*, body, html)
  - 자동 foreground 시스템 (.bg-primary, .bg-secondary 등)
- **수정**: 전역 기본 스타일 변경 시

### `components.css` (30줄)

- **역할**: 재사용 가능한 컴포넌트 단축 클래스
- **내용**:
  - 버튼 클래스 (.btn-primary, .btn-secondary, .btn-destructive)
  - 카드 클래스 (.card)
  - 텍스트 클래스 (.text-main, .text-sub, .text-accent)
- **수정**: 새로운 컴포넌트 단축 클래스 추가 시

### `fonts.css`

- **역할**: 폰트 관련 설정
- **내용**: Pretendard 폰트 등 웹폰트 정의
- **수정**: 새로운 폰트 추가 시

## 🎨 뉴모피즘 스타일 (`neumorphism/`)

### `neumorphism/index.css`

- **역할**: 뉴모피즘 스타일 진입점
- **내용**: 모든 뉴모피즘 CSS 파일 import

### `neumorphism/base.css` (37줄)

- **역할**: 기본 뉴모피즘 스타일
- **클래스**:
  - `.neumorphic` - 기본 뉴모피즘 컨테이너
  - `.neumorphic-active` - 활성/선택 상태

### `neumorphism/buttons.css` (84줄)

- **역할**: 버튼 관련 뉴모피즘 스타일
- **클래스**:
  - `.neumorphic-button` - 기본 뉴모피즘 버튼
  - `.neumorphic-toggle` - 토글 버튼

### `neumorphism/inputs.css` (72줄)

- **역할**: 입력 필드 관련 뉴모피즘 스타일
- **클래스**:
  - `.neumorphic-input` - 기본 입력 필드
  - `.neumorphic-search` - 검색바

### `neumorphism/containers.css` (20줄)

- **역할**: 컨테이너 관련 뉴모피즘 스타일
- **클래스**:
  - `.neumorphic-container` - 패널, 사이드바 등

### `neumorphism/cards.css` (32줄)

- **역할**: 카드 관련 뉴모피즘 스타일
- **클래스**:
  - `.neumorphic-card` - 뉴모피즘 카드

## 🔧 사용법

### 1. 기본 컴포넌트 클래스 사용

```jsx
// 버튼
<button className="btn-primary">주요 버튼</button>
<button className="btn-secondary">보조 버튼</button>

// 카드
<div className="card">카드 내용</div>

// 텍스트
<p className="text-main">주요 텍스트</p>
<p className="text-sub">보조 텍스트</p>
```

### 2. 뉴모피즘 스타일 사용

```jsx
// 기본 뉴모피즘
<div className="neumorphic p-4">기본 컨테이너</div>

// 뉴모피즘 버튼
<button className="neumorphic-button px-4 py-2">뉴모피즘 버튼</button>

// 뉴모피즘 입력
<input className="neumorphic-input px-3 py-2" />

// 뉴모피즘 카드
<div className="neumorphic-card p-6">카드 내용</div>
```

### 3. 색상 변수 사용

```css
/* CSS에서 */
.custom-element {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border: 1px solid hsl(var(--border));
}

/* Tailwind에서 */
<div className="bg-primary text-primary-foreground border border-border">
```

## 📝 수정 가이드

### 새로운 스타일 추가 시

1. **컴포넌트 클래스**: `components.css`에 추가
2. **뉴모피즘 스타일**: 해당 카테고리의 `neumorphism/` 파일에 추가
3. **색상 변수**: `variables.css`에 추가
4. **새로운 카테고리**: 새 파일 생성 후 `globals.css`에 import 추가

### 파일 크기 권장사항

- 각 파일은 **200줄 이하** 유지
- 파일이 커지면 기능별로 추가 분리 고려

### 네이밍 규칙

- **컴포넌트 클래스**: `btn-`, `card-`, `text-` 등 용도별 접두사
- **뉴모피즘 클래스**: `neumorphic-` 접두사 사용
- **변수**: 의미론적 이름 사용 (`--primary`, `--background` 등)

## 🌙 다크모드 지원

모든 스타일은 다크모드를 지원한다. `.dark` 클래스가 적용되면 자동으로 다크 테마로 전환된다.

```css
/* 라이트모드 */
.neumorphic-button {
	box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.15);
}

/* 다크모드 */
.dark .neumorphic-button {
	box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
}
```
