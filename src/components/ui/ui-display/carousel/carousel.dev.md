# Carousel 기술 문서

## 아키텍처 개요

터치/마우스 제스처와 자동재생을 지원하는 반응형 캐러셀 컴포넌트입니다.

## 핵심 구현

### 상태 관리
```typescript
const [currentSlide, setCurrentSlide] = useState(0);
const [isPlaying, setIsPlaying] = useState(autoPlay);
const [touchStart, setTouchStart] = useState(0);
const [touchEnd, setTouchEnd] = useState(0);
```

### 자동재생 시스템
```typescript
useEffect(() => {
  if (!isPlaying) return;
  
  const timer = setInterval(() => {
    setCurrentSlide(prev => 
      infinite ? (prev + 1) % slides.length : 
      prev < slides.length - 1 ? prev + 1 : 0
    );
  }, interval);
  
  return () => clearInterval(timer);
}, [isPlaying, interval, slides.length, infinite]);
```

### 터치 제스처
```typescript
const handleTouchStart = (e: TouchEvent) => {
  setTouchStart(e.targetTouches[0].clientX);
};

const handleTouchEnd = () => {
  const distance = touchStart - touchEnd;
  const threshold = 50;
  
  if (distance > threshold) nextSlide();
  if (distance < -threshold) prevSlide();
};
```

### 키보드 지원
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

## 애니메이션

### CSS Transform 활용
```css
.carousel-track {
  transform: translateX(-${currentSlide * 100}%);
  transition: transform 0.5s ease-in-out;
}
```

### 페이드 효과 (선택적)
```css
.carousel-fade .slide {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.carousel-fade .slide.active {
  opacity: 1;
}
```

## 접근성

### ARIA 지원
```typescript
<div
  role="region"
  aria-label="이미지 캐러셀"
  aria-live="polite"
>
  <div
    role="group"
    aria-roledescription="슬라이드"
    aria-label={`${currentSlide + 1} / ${slides.length}`}
  >
```

### 키보드 네비게이션
- 좌우 화살표: 슬라이드 이동
- Space: 재생/일시정지 토글
- Home/End: 첫/마지막 슬라이드

## 성능 최적화

### 이미지 지연 로딩
```typescript
const [loadedImages, setLoadedImages] = useState(new Set());

const preloadImage = (src: string) => {
  const img = new Image();
  img.onload = () => setLoadedImages(prev => new Set([...prev, src]));
  img.src = src;
};
```

### 가상화 (대량 슬라이드)
```typescript
const visibleSlides = useMemo(() => {
  const start = Math.max(0, currentSlide - 1);
  const end = Math.min(slides.length, currentSlide + 2);
  return slides.slice(start, end);
}, [slides, currentSlide]);
``` 