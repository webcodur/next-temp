# Carousel 컴포넌트

이미지와 콘텐츠를 슬라이드 형태로 표시하는 캐러셀 컴포넌트입니다.

## 주요 특징

- **자동 재생**: 설정 가능한 자동 슬라이드
- **터치 지원**: 모바일 스와이프 제스처
- **키보드 네비게이션**: 화살표 키 지원
- **인디케이터**: 현재 위치 표시
- **무한 루프**: 끝에서 처음으로 순환

## 기본 사용법

```tsx
import { Carousel } from '@/components/ui/ui-display/carousel/Carousel';

function MyComponent() {
  const slides = [
    {
      id: 1,
      image: '/images/slide1.jpg',
      title: '첫 번째 슬라이드',
      description: '설명 텍스트'
    },
    {
      id: 2,
      image: '/images/slide2.jpg',
      title: '두 번째 슬라이드',
      description: '설명 텍스트'
    }
  ];

  return (
    <Carousel
      slides={slides}
      autoPlay={true}
      interval={3000}
      showIndicators={true}
      showArrows={true}
    />
  );
}
```

## Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `slides` | `Slide[]` | - | 슬라이드 데이터 (필수) |
| `autoPlay` | `boolean` | `false` | 자동 재생 활성화 |
| `interval` | `number` | `3000` | 자동 재생 간격 (ms) |
| `showIndicators` | `boolean` | `true` | 인디케이터 표시 |
| `showArrows` | `boolean` | `true` | 화살표 버튼 표시 |
| `pauseOnHover` | `boolean` | `true` | 호버시 일시정지 |
| `infinite` | `boolean` | `true` | 무한 루프 |
| `className` | `string` | `''` | 추가 CSS 클래스 |

### Slide 인터페이스

```tsx
interface Slide {
  id: number | string;
  image: string;
  title?: string;
  description?: string;
  link?: string;
  content?: React.ReactNode;
}
```

## 사용 예시

### 기본 이미지 캐러셀

```tsx
function BasicCarousel() {
  const imageSlides = [
    { id: 1, image: '/hero1.jpg', title: '환영합니다' },
    { id: 2, image: '/hero2.jpg', title: '새로운 기능' },
    { id: 3, image: '/hero3.jpg', title: '지금 시작하세요' }
  ];

  return (
    <Carousel
      slides={imageSlides}
      autoPlay={true}
      interval={4000}
      className="h-96"
    />
  );
}
```

### 콘텐츠 캐러셀

```tsx
function ContentCarousel() {
  const contentSlides = [
    {
      id: 1,
      content: (
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">고객 후기</h2>
          <p>"정말 훌륭한 서비스입니다!"</p>
          <p className="mt-2 text-sm text-gray-600">- 김고객</p>
        </div>
      )
    },
    {
      id: 2,
      content: (
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">만족도 높음</h2>
          <p>"사용하기 매우 편리해요"</p>
          <p className="mt-2 text-sm text-gray-600">- 이사용자</p>
        </div>
      )
    }
  ];

  return (
    <Carousel
      slides={contentSlides}
      autoPlay={true}
      showIndicators={false}
      className="bg-gray-50"
    />
  );
}
```

### 상품 캐러셀

```tsx
function ProductCarousel() {
  const products = [
    {
      id: 1,
      image: '/product1.jpg',
      title: '노트북',
      description: '고성능 게이밍 노트북',
      link: '/products/1'
    },
    {
      id: 2,
      image: '/product2.jpg',
      title: '마우스',
      description: '무선 게이밍 마우스',
      link: '/products/2'
    }
  ];

  return (
    <Carousel
      slides={products}
      autoPlay={false}
      showArrows={true}
      infinite={false}
      className="max-w-md mx-auto"
    />
  );
}
``` 