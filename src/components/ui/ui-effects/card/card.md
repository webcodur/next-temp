# Card 컴포넌트

정보를 그룹화하고 구조화하여 표시하는 컨테이너 컴포넌트입니다.

## 구성 요소

### 기본 컴포넌트
- `Card` - 기본 카드 컨테이너
- `CardHeader` - 카드 상단 영역 (제목, 설명)
- `CardTitle` - 카드 제목
- `CardDescription` - 카드 설명
- `CardContent` - 카드 본문 내용
- `CardFooter` - 카드 하단 영역 (액션 버튼 등)

### 확장 컴포넌트
- `CardActions` - 카드 우상단 액션 버튼 영역
- `CardAction` - 개별 액션 버튼
- `CardBadge` - 카드 내 상태/카테고리 표시 배지

## 사용법

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardActions,
  CardAction,
  CardBadge,
} from '@/components/ui/ui-effects/card/Card';

// 기본 사용
<Card>
  <CardHeader>
    <CardTitle>카드 제목</CardTitle>
    <CardDescription>카드 설명입니다.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>카드 본문 내용</p>
  </CardContent>
  <CardFooter>
    <button>액션 버튼</button>
  </CardFooter>
</Card>

// variant 별 사용
<Card variant="outline-solid">기본 테두리</Card>
<Card variant="elevated">높은 그림자</Card>

// 호버 효과
<Card hoverEffect>호버 시 효과</Card>

// 액션 버튼과 배지
<Card className="relative">
  <CardActions>
    <CardAction>⋯</CardAction>
    <CardAction>❤</CardAction>
  </CardActions>
  <CardHeader>
    <CardBadge variant="success">완료</CardBadge>
    <CardTitle>프로젝트 카드</CardTitle>
  </CardHeader>
</Card>
```

## Props

### Card
- `variant`: "default" | "outline-solid" | "elevated" - 카드 스타일 변형
- `hoverEffect`: boolean - 호버 시 뉴모피즘 효과 활성화
- `className`: string - 추가 CSS 클래스

### CardBadge
- `variant`: "default" | "primary" | "secondary" | "success" | "warning" | "danger" - 배지 색상 변형

## 기능

- **뉴모피즘 디자인**: `neu-flat`, `neu-raised` 스타일로 일관된 디자인
- **유연한 구조**: 헤더, 콘텐츠, 푸터를 자유롭게 조합
- **액션 시스템**: 카드 우상단에 액션 버튼 배치 가능
- **상태 표시**: 배지를 통한 상태/카테고리 시각화
- **반응형**: 다양한 화면 크기에 적응
- **접근성**: 의미론적 HTML 구조 지원 