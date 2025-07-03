# Editor 컴포넌트 기술 문서

## 아키텍처 개요

TinyMCE React 컴포넌트를 래핑하여 프로젝트 요구사항에 맞게 커스터마이징한 WYSIWYG 에디터입니다. 뉴모피즘 디자인과 다크 모드 지원을 포함한 일관된 UI/UX를 제공합니다.

## 핵심 기술 스택

### 외부 의존성
- **@tinymce/tinymce-react**: TinyMCE의 공식 React 래퍼
- **TinyMCE Cloud**: CDN 기반 에디터 라이브러리
- **환경 변수**: API 키 관리

### 설계 원칙
- **래핑 패턴**: 외부 라이브러리를 프로젝트 표준에 맞게 추상화
- **CSS-in-JS**: content_style을 통한 동적 스타일 주입
- **타입 안전성**: TypeScript Props 인터페이스
- **확장성**: init props를 통한 설정 오버라이드

## 구현 세부사항

### 1. 컴포넌트 래핑 구조

```typescript
export const Editor = ({
  value,
  onChange,
  placeholder = '내용을 입력하세요...',
  height = 400,
  className,
  init,
}: EditorProps) => {
  const editorRef = useRef<any>(null);
  // ...
}
```

**특징:**
- 필수 Props (`value`, `onChange`)와 선택적 Props 분리
- useRef를 통한 에디터 인스턴스 접근
- 기본값 제공으로 사용성 향상

### 2. 설정 병합 시스템

```typescript
const editorInit = {
  height,
  menubar: true,
  placeholder,
  plugins: [...defaultPlugins],
  toolbar: 'undo redo | blocks | ...',
  content_style: `/* CSS 변수 기반 스타일 */`,
  // ... 기본 설정들
  ...init, // 사용자 설정으로 오버라이드
};
```

**병합 전략:**
- 기본 설정을 먼저 정의
- 사용자 제공 `init` props로 최종 오버라이드
- 스프레드 연산자를 활용한 얕은 병합

### 3. 다크 모드 통합

```css
content_style: `
  body { 
    color: hsl(var(--foreground));
    background: hsl(var(--background));
  }
  a { color: hsl(var(--primary)); }
  h1, h2, h3, h4, h5, h6 { color: hsl(var(--foreground)); }
`
```

**핵심 기술:**
- CSS 변수 (`--foreground`, `--background`)를 통한 동적 테마
- HSL 함수와 CSS var() 조합
- 에디터 내부 iframe에 스타일 주입

### 4. 플러그인 시스템

```typescript
plugins: [
  'advlist', 'autolink', 'lists', 'link', 'image',
  'charmap', 'preview', 'anchor', 'searchreplace',
  'visualblocks', 'code', 'fullscreen', 'insertdatetime',
  'media', 'table', 'help', 'wordcount', 'emoticons',
]
```

**선택 기준:**
- 기본적인 텍스트 편집 기능
- 미디어 삽입 및 테이블 기능
- 접근성 및 사용성 향상 도구
- 개발자 도구 (코드 뷰, 도움말)

### 5. 도구 모음 구성

```typescript
toolbar: 
  'undo redo | blocks | ' +
  'bold italic forecolor backcolor | alignleft aligncenter ' +
  'alignright alignjustify | bullist numlist outdent indent | ' +
  'removeformat | table image link emoticons | code fullscreen help'
```

**그룹화 전략:**
- `|` 파이프로 논리적 그룹 분리
- 사용 빈도 순으로 배치
- 모바일 화면 고려한 필수 기능 우선

## 스타일링 시스템

### 1. 뉴모피즘 컨테이너

```jsx
<div className={cn('neu-flat p-4 rounded-lg', className)}>
  <TinyMCEEditor />
</div>
```

**구성 요소:**
- `neu-flat`: 뉴모피즘 평면 효과
- `p-4`: 내부 여백으로 에디터와 컨테이너 분리
- `rounded-lg`: 모서리 둥글게 처리
- `cn()`: clsx 기반 조건부 클래스 병합

### 2. 플레이스홀더 스타일링

```css
.mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
  margin-top: 6px;
  margin-left: 22px;
  color: hsl(var(--muted-foreground));
  font-style: italic;
  display: flex;
  align-items: center;
  line-height: 1.6;
}
```

**기술적 세부사항:**
- CSS 속성 선택자로 플레이스홀더 상태 감지
- `::before` 가상 요소로 스타일 구현
- Flexbox로 정확한 위치 조정
- CSS 변수로 테마 일관성 유지

### 3. 반응형 도구 모음

```typescript
quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
quickbars_insert_toolbar: 'image media table hr',
```

**적응형 인터페이스:**
- 텍스트 선택 시 나타나는 빠른 도구 모음
- 삽입 위치에서의 컨텍스트 도구 모음
- 모바일 환경에서의 터치 최적화

## 성능 최적화

### 1. 지연 로딩

TinyMCE는 CDN에서 동적으로 로드되므로:
- 컴포넌트 마운트 시점에 스크립트 요청
- 캐싱을 통한 재방문 시 빠른 로딩
- 번들 크기에 영향 없음

### 2. 메모이제이션 고려사항

```typescript
// 현재 구현
const editorInit = {
  // ... 매 렌더링마다 객체 생성
};

// 최적화 가능
const editorInit = useMemo(() => ({
  // ... 의존성 배열 기반 메모이제이션
}), [height, placeholder, init]);
```

### 3. 이벤트 핸들러 최적화

```typescript
onEditorChange={(newValue) => {
  onChange(newValue);
}}
```

**현재 한계:**
- 익명 함수로 매 렌더링마다 새 함수 생성
- 향후 useCallback으로 최적화 가능

## 접근성 구현

### 1. ARIA 지원

TinyMCE 내장 접근성 기능:
- 도구 모음 버튼에 ARIA 라벨 자동 적용
- 키보드 네비게이션 완전 지원
- 스크린 리더와의 호환성

### 2. 키보드 단축키

```typescript
// TinyMCE 기본 단축키
// Ctrl+B: Bold
// Ctrl+I: Italic  
// Ctrl+U: Underline
// Ctrl+Z: Undo
// Ctrl+Y: Redo
```

### 3. 포커스 관리

```typescript
onInit={(_, editor) => {
  editorRef.current = editor;
}}
```

**포커스 제어:**
- 외부에서 에디터 포커스 가능
- 모달 내부에서의 포커스 트랩
- 탭 순서 관리

## 환경 설정 및 배포

### 1. API 키 관리

```typescript
apiKey={process.env.NEXT_PUBLIC_API_KEY_EDITOR || ''}
```

**보안 고려사항:**
- 클라이언트 사이드에서 접근 가능한 환경 변수
- 도메인 제한으로 보안 강화 가능
- API 키 없이도 기본 기능 동작 (로딩 지연 발생)

### 2. CDN 의존성

**장점:**
- 최신 버전 자동 업데이트
- 전 세계 CDN을 통한 빠른 로딩
- 번들 크기 최소화

**단점:**
- 네트워크 의존성
- 오프라인 환경에서 동작 불가
- 버전 고정 어려움

## 확장 가능성

### 1. 커스텀 플러그인 개발

```typescript
init={{
  plugins: [...defaultPlugins, 'custom-plugin'],
  custom_plugin_option: 'value'
}}
```

### 2. 테마 시스템 확장

```typescript
content_style: `
  body { 
    font-family: var(--font-content);
    font-size: var(--text-size-base);
    line-height: var(--line-height-relaxed);
  }
`
```

### 3. 다국어 지원

```typescript
init={{
  language: 'ko_KR',
  language_url: '/tinymce/langs/ko_KR.js'
}}
```

## 알려진 이슈 및 해결방안

### 1. iframe 기반 제한사항

**문제:** 에디터 내용이 iframe에서 렌더링되어 외부 CSS 적용 어려움
**해결:** `content_style`을 통한 CSS 주입

### 2. 초기 로딩 지연

**문제:** CDN에서 스크립트 로드 시간
**해결:** 로딩 스피너 또는 스켈레톤 UI 표시

### 3. 모바일 최적화

**문제:** 터치 인터페이스에서 일부 기능 제한
**해결:** 반응형 도구 모음 및 터치 최적화 설정

## 테스트 전략

### 1. 단위 테스트
- Props 전달 확인
- 이벤트 핸들러 동작 검증
- 기본값 적용 테스트

### 2. 통합 테스트
- TinyMCE 로딩 시나리오
- 사용자 입력 및 출력 검증
- 다양한 브라우저에서의 호환성

### 3. 접근성 테스트
- 키보드 네비게이션
- 스크린 리더 호환성
- 고대비 모드 지원

## 유지보수 가이드

### 1. 업데이트 고려사항
- TinyMCE 버전 업데이트 시 API 변경 확인
- 플러그인 호환성 검증
- 브라우저 지원 범위 검토

### 2. 성능 모니터링
- 초기 로딩 시간 측정
- 메모리 사용량 확인
- 큰 문서에서의 성능 검증 