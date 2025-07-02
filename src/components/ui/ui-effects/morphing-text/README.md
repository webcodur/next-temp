# Morphing Text

동적 텍스트 모핑 애니메이션을 제공하는 컴포넌트이다.

## 특징

- **부드러운 전환**: 블러와 투명도를 활용한 자연스러운 텍스트 변환
- **다국어 폰트**: font-multilang 자동 적용
- **반응형**: 모바일과 데스크톱에 최적화된 크기
- **이벤트 기반 제어**: 특정 이벤트나 요청에 의한 수동 텍스트 변경 지원
- **자동/수동 전환**: autoPlay 옵션으로 자동 순환과 수동 제어 전환 가능
- **최적화**: requestAnimationFrame 기반 성능 최적화

## 사용법

### 기본 사용

```tsx
import { MorphingText } from '@/components/ui/morphing-text';

<MorphingText 
  texts={["안녕하세요", "Hello", "مرحبا"]} 
/>
```

### 자동 순환 (기본값)
```tsx
<MorphingText 
  texts={["첫 번째", "두 번째", "세 번째"]}
  autoPlay={true}
  onTextChange={(index) => console.log('현재 텍스트:', index)}
/>
```

### 수동 제어
```tsx
const [currentIndex, setCurrentIndex] = useState(0);

<MorphingText 
  texts={["첫 번째", "두 번째", "세 번째"]}
  currentIndex={currentIndex}
  autoPlay={false}
/>

// 버튼으로 텍스트 변경
<button onClick={() => setCurrentIndex(1)}>
  두 번째 텍스트로 변경
</button>
```

### 커스텀 스타일링
```tsx
<MorphingText 
  texts={["첫 번째", "두 번째", "세 번째"]}
  className="text-primary mx-auto max-w-lg"
/>
```

## Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| texts | string[] | - | 순환할 텍스트 배열 |
| currentIndex | number | undefined | 현재 표시할 텍스트 인덱스 (수동 제어용) |
| autoPlay | boolean | true | 자동 순환 여부 |
| onTextChange | (index: number) => void | undefined | 텍스트 변경 시 콜백 |
| className | string | - | 추가 CSS 클래스 |

## 기본 크기

- **모바일**: h-16, text-[40pt] (높이 64px, 폰트 40pt)
- **데스크톱**: h-24, lg:text-[6rem] (높이 96px, 폰트 6rem)

## 애니메이션 타이밍

- **모핑 시간**: 1.5초
- **대기 시간**: 0.5초
- **자동 순환**: 무한 반복

## 다국어 지원

`font-multilang` 클래스가 자동 적용되어 한국어, 영어, 아랍어 등 다양한 언어의 최적 폰트가 문자별로 자동 선택된다.

## 주의사항

- SVG 필터를 사용하므로 브라우저 호환성 확인 필요
- 텍스트 배열은 최소 2개 이상 권장
- 긴 텍스트는 컨테이너 크기를 고려하여 사용
