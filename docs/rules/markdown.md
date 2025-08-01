# 마크다운 및 ASCII ART 작성 가이드라인

## 📝 마크다운 린트 준수

### 헤딩 구조

- 볼드 텍스트(`**텍스트**`) 대신 적절한 헤딩 레벨 사용 (MD036)
- 모든 헤딩 아래에 빈 줄 추가 (MD022)
- 중복된 헤딩 내용 금지 - 고유한 제목 사용 (MD024)
- 리스트 앞뒤에 빈 줄 추가 (MD032)
- 줄 끝 공백 제거 - 0개 또는 2개만 허용 (MD009)
- 파일 끝에 단일 개행 문자로 마무리 (MD047)

### 헤딩 레벨 가이드

```ASCII_ART
# 문서 제목 (H1)
## 주요 섹션 (H2)  
### 하위 섹션 (H3)
#### 세부 항목 (H4)
```

### MD024 중복 헤딩 해결법

동일한 헤딩 반복 시 컨텍스트를 추가한다.

- `#### 경로 정보` → `#### [컴포넌트명] 경로 정보`
- `#### 구현 세부사항` → `#### [컴포넌트명] 구현 세부사항`

## 🎨 ASCII ART 규칙

- 박스 내부 텍스트는 **반드시 영어**로 작성
- 코드 블록에 `ASCII ART` 언어 태그 명시
- 정렬이 맞는 구조로 작성

### ASCII ART 예시

어려운 내용 설명 시 아스키아트 활용.

```ASCII ART
┌─────────────────────────────────────┐
│        Progress Indicator           │
│      ○ ── ● ── ○ ── ○ ── ○          │
│    Step1 Step2 Step3 Step4 Step5    │
├─────────────────────────────────────┤
│            Content Area             │
│       (Step Content Here)           │
├─────────────────────────────────────┤
│        [Previous]      [Next]       │
│            Navigation Bar           │
└─────────────────────────────────────┘
```

## 📋 문서 구조 원칙

### 원리원칙

- 코드 예시 금지 - 개념과 원칙만 설명
- 간결한 문체 사용 (있다, 이다, 하다 등)
- 헤딩 태그 뒤에 넘버링 정보를 부착
- 중요한 내용은 줄글형태로 안내하고 추가적으로 리스팅 활용

### 개념 추상화

- 국문/영문 대응표 작성
- 컴포넌트 명칭 정의
- 상태 및 액션 명칭 표준화
