# Next.js 프로젝트

## 🎨 스타일 시스템

### 뉴모피즘 디자인

화이트 테마 기반의 뉴모피즘 스타일을 사용합니다.

#### 핵심 클래스

- `.neu-raised` - 양각 (튀어나온 효과) - 기본 버튼
- `.neu-inset` - 음각 (눌린 효과) - 활성 버튼
- `.neu-base` - 평면 효과 - 컨테이너

#### 기존 호환성

- `.neumorphic-button` → `.neu-raised`
- `.neumorphic-active` → `.neu-inset`
- `.neumorphic-container` → `.neu-base`

#### 사용법

```tsx
// 기본 패턴
<button className="neu-raised">버튼</button>
<button className="neu-inset">활성 버튼</button>

// 커스텀 조합
<div className="neu-base bg-card/90 rounded-xl">
```

#### 참고 파일

- 색상 변수: `src/styles/variables.css`
- 뉴모피즘 클래스: `src/styles/neumorphism/base.css`
- Tailwind 설정: `tailwind.config.js`

## �� 실행

Next.js 기반의 웹 애플리케이션 프로젝트다.

Node.js 18 이상이 필요하다.

## 설치

```bash
npm install
```

## 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속한다.

## 빌드

```bash
npm run build
npm start
```

## 환경 변수

프로젝트 루트에 `.env.local` 파일을 생성하여 환경 변수를 설정한다.

## 📁 프로젝트 구조

```
src/
├── styles/
│   ├── variables.css      # 핵심 색상 변수
│   ├── neumorphism/       # 뉴모피즘 스타일
│   └── globals.css        # 전역 스타일
└── components/
    └── layout/
        └── sidebar/       # 사이드바 컴포넌트
```
