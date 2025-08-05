# ImagePreview

이미지를 모달 형태로 미리보기할 수 있는 컴포넌트입니다. 단일 이미지 또는 갤러리 형태로 여러 이미지를 표시할 수 있으며, 확대/축소, 회전, 다운로드 등의 기능을 제공합니다.

## 주요 기능

- **모달 기반 이미지 뷰어**: React Portal을 사용한 전체 화면 모달
- **갤러리 네비게이션**: 여러 이미지 간 탐색 (이전/다음)
- **확대/축소**: 마우스 휠 또는 버튼으로 이미지 확대/축소
- **회전**: 90도 단위로 이미지 회전
- **드래그 이동**: 확대된 이미지를 드래그로 이동
- **썸네일 네비게이션**: 하단 썸네일로 빠른 이미지 전환
- **키보드 단축키**: ESC, 화살표, +/- 등 키보드 제어
- **다운로드**: 이미지 다운로드 기능
- **터치/마우스 지원**: 다양한 입력 방식 지원

## Props

### ImagePreviewProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `ImageData[]` | - | 표시할 이미지 배열 |
| `isOpen` | `boolean` | - | 모달 열림 상태 |
| `onClose` | `() => void` | - | 모달 닫기 콜백 |
| `initialIndex` | `number` | `0` | 초기 표시할 이미지 인덱스 |
| `showThumbnails` | `boolean` | `true` | 썸네일 네비게이션 표시 여부 |
| `enableZoom` | `boolean` | `true` | 확대/축소 기능 활성화 |
| `enableRotation` | `boolean` | `true` | 회전 기능 활성화 |
| `enableDownload` | `boolean` | `true` | 다운로드 기능 활성화 |
| `maxZoom` | `number` | `5` | 최대 확대 비율 |
| `minZoom` | `number` | `0.1` | 최소 축소 비율 |
| `className` | `string` | `''` | 추가 CSS 클래스 |

### ImageData

| Prop | Type | Description |
|------|------|-------------|
| `src` | `string` | 이미지 URL |
| `alt` | `string?` | 이미지 대체 텍스트 |
| `title` | `string?` | 이미지 제목 |
| `description` | `string?` | 이미지 설명 |

## 키보드 단축키

| 키 | 기능 |
|----|------|
| `ESC` | 모달 닫기 |
| `←` | 이전 이미지 |
| `→` | 다음 이미지 |
| `+` / `=` | 확대 |
| `-` | 축소 |
| `0` | 원본 크기로 초기화 |

## 마우스/터치 제스처

- **마우스 휠**: 확대/축소
- **드래그**: 확대된 이미지 이동 (확대 상태에서만)
- **클릭**: 썸네일 클릭으로 이미지 전환

## 기본 사용법

```tsx
import { ImagePreview, ImageData } from '@/components/ui/ui-effects/image-preview/ImagePreview';

const images: ImageData[] = [
  {
    src: '/images/photo1.jpg',
    alt: '사진 1',
    title: '아름다운 풍경',
    description: '멋진 자연 풍경 사진입니다.'
  },
  {
    src: '/images/photo2.jpg',
    alt: '사진 2',
    title: '도시 야경'
  }
];

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        이미지 보기
      </button>
      
      <ImagePreview
        images={images}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
```

## 갤러리 모드

```tsx
function GalleryComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openAtIndex = (index: number) => {
    setSelectedIndex(index);
    setIsOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            onClick={() => openAtIndex(index)}
            className="cursor-pointer hover:opacity-80"
          />
        ))}
      </div>
      
      <ImagePreview
        images={images}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialIndex={selectedIndex}
        showThumbnails={true}
      />
    </>
  );
}
```

## 커스텀 설정

```tsx
<ImagePreview
  images={images}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  enableZoom={false}           // 확대/축소 비활성화
  enableRotation={false}       // 회전 비활성화
  enableDownload={false}       // 다운로드 비활성화
  showThumbnails={false}       // 썸네일 숨기기
  maxZoom={3}                  // 최대 확대 3배
  minZoom={0.5}                // 최소 축소 50%
/>
```

## 스타일링

컴포넌트는 Tailwind CSS 클래스를 사용하며, 다음과 같은 CSS 변수를 사용합니다:

- 배경: `bg-black/90` (반투명 검은색)
- 툴바: `bg-black/50` (반투명 검은색)
- 텍스트: `text-white`
- 호버 효과: `hover:bg-black/70`

## 접근성

- 키보드 네비게이션 완전 지원
- ARIA 레이블 자동 적용
- 포커스 관리
- 스크린 리더 호환

## 성능 최적화

- 이미지 지연 로딩
- 메모이제이션된 콜백 함수
- 효율적인 상태 관리
- React Portal 사용으로 렌더링 최적화

## 주의사항

- 이미지가 로드되지 않을 경우의 에러 처리 필요
- 큰 이미지의 경우 로딩 시간 고려
- 모바일 환경에서의 터치 제스처 테스트 권장
- CORS 정책에 따른 이미지 접근 제한 확인