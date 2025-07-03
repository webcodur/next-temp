# Editor 컴포넌트

TinyMCE 기반의 리치 텍스트 에디터 컴포넌트입니다.

## 주요 특징

- **WYSIWYG 편집**: 실시간 시각적 편집 환경
- **뉴모피즘 디자인**: `neu-flat` 스타일로 일관된 디자인
- **다크 모드 지원**: CSS 변수를 활용한 테마 적응
- **풍부한 플러그인**: 텍스트 포맷팅, 이미지, 테이블, 링크 등
- **반응형 인터페이스**: 창 크기에 맞는 도구 모음
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원

## 기본 사용법

```tsx
import { Editor } from '@/components/ui/ui-input/editor/Editor';

function MyComponent() {
  const [content, setContent] = useState('');

  return (
    <Editor
      value={content}
      onChange={setContent}
      placeholder="내용을 입력하세요..."
    />
  );
}
```

## Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `value` | `string` | - | 에디터 내용 (필수) |
| `onChange` | `(content: string) => void` | - | 내용 변경 콜백 (필수) |
| `placeholder` | `string` | `'내용을 입력하세요...'` | 플레이스홀더 텍스트 |
| `height` | `number \| string` | `400` | 에디터 높이 |
| `className` | `string` | - | 추가 CSS 클래스 |
| `init` | `Record<string, unknown>` | - | TinyMCE 초기화 설정 오버라이드 |

## 주요 기능

### 텍스트 포맷팅
- 굵게, 기울임, 밑줄, 취소선
- 글꼴 색상 및 배경색
- 제목 스타일 (H1~H6)
- 단락 정렬 (좌, 중앙, 우, 양쪽)

### 목록 및 구조
- 순서 목록 및 무순서 목록
- 들여쓰기 및 내어쓰기
- 인용구 및 코드 블록

### 미디어 삽입
- 이미지 업로드 및 삽입
- 미디어 파일 삽입
- 링크 생성 및 편집
- 테이블 생성 및 편집

### 도구 및 유틸리티
- 실행 취소/다시 실행
- 검색 및 바꾸기
- 전체 화면 모드
- HTML 소스 코드 편집
- 이모티콘 삽입

## 사용 예시

### 기본 에디터

```tsx
function BlogEditor() {
  const [content, setContent] = useState('');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">블로그 작성</h1>
      <Editor
        value={content}
        onChange={setContent}
        height={500}
        placeholder="블로그 내용을 작성하세요..."
      />
    </div>
  );
}
```

### 높이 조정된 에디터

```tsx
function CommentEditor() {
  const [comment, setComment] = useState('');

  return (
    <Editor
      value={comment}
      onChange={setComment}
      height={200}
      placeholder="댓글을 입력하세요..."
      className="border-2 border-gray-200"
    />
  );
}
```

### 커스텀 설정 에디터

```tsx
function MinimalEditor() {
  const [content, setContent] = useState('');

  return (
    <Editor
      value={content}
      onChange={setContent}
      init={{
        menubar: false,
        toolbar: 'bold italic | link | bullist numlist',
        plugins: ['link', 'lists'],
        statusbar: false,
      }}
    />
  );
}
```

## 도구 모음 구성

### 기본 도구 모음
- `undo redo`: 실행 취소/다시 실행
- `blocks`: 블록 형식 (제목, 단락 등)
- `bold italic`: 굵게/기울임
- `forecolor backcolor`: 글자색/배경색
- `alignleft aligncenter alignright alignjustify`: 정렬
- `bullist numlist`: 목록
- `outdent indent`: 들여쓰기
- `removeformat`: 서식 제거
- `table image link emoticons`: 삽입 도구
- `code fullscreen help`: 유틸리티

### 빠른 도구 모음
- **선택 시**: `bold italic | quicklink h2 h3 blockquote`
- **삽입 시**: `image media table hr`

## 컨텍스트 메뉴
우클릭 시 나타나는 메뉴:
- `link`: 링크 편집
- `image`: 이미지 편집  
- `table`: 테이블 편집

## 스타일 커스터마이징

### 에디터 컨테이너
```tsx
<Editor
  className="border-4 border-blue-300 shadow-lg"
  // ...
/>
```

### 내부 콘텐츠 스타일
```tsx
<Editor
  init={{
    content_style: `
      body { 
        font-family: 'Custom Font', serif;
        font-size: 18px;
        line-height: 1.8;
      }
      h1 { color: #333; }
      p { margin: 16px 0; }
    `
  }}
  // ...
/>
```

## 환경 설정

### API 키 설정
`.env.local` 파일에 TinyMCE API 키를 설정:
```env
NEXT_PUBLIC_API_KEY_EDITOR=your_tinymce_api_key_here
```

### 플러그인 추가
```tsx
<Editor
  init={{
    plugins: [
      // 기본 플러그인들...
      'codesample', // 코드 하이라이팅
      'hr', // 구분선
      'pagebreak', // 페이지 나누기
    ]
  }}
  // ...
/>
```

## 접근성 기능

- **키보드 단축키**: Ctrl+B (굵게), Ctrl+I (기울임) 등
- **스크린 리더**: ARIA 라벨 및 역할 자동 설정
- **포커스 관리**: 도구 모음과 편집 영역 간 탭 네비게이션
- **고대비 모드**: 시스템 설정에 따른 자동 적응

## 제한사항

- TinyMCE API 키 필요 (상용 라이선스)
- 인터넷 연결 필요 (CDN 기반)
- 초기 로딩 시간 존재
- 모바일에서 일부 기능 제한

## 문제 해결

### 에디터가 로드되지 않는 경우
1. API 키 확인
2. 인터넷 연결 상태 확인
3. 브라우저 콘솔에서 오류 메시지 확인

### 스타일이 적용되지 않는 경우
1. CSS 변수 정의 확인 (`--foreground`, `--background` 등)
2. `content_style` 설정 검토
3. 다크 모드 토글 후 새로고침 