# Modal 컴포넌트

React Portal과 Framer Motion을 활용한 모달 다이얼로그 컴포넌트입니다.

## 주요 특징

- **Portal 렌더링**: document.body에 직접 렌더링하여 z-index 문제 해결
- **애니메이션**: Framer Motion으로 부드러운 나타남/사라짐 효과
- **접근성**: ESC 키 지원 및 포커스 트랩
- **백드롭 클릭**: 바깥 영역 클릭으로 모달 닫기 (선택적)
- **반응형**: 화면 크기에 맞는 최대 너비 설정
- **SSR 호환**: 서버 사이드 렌더링 환경에서 안전한 처리

## 기본 사용법

```tsx
import Modal from '@/components/ui/ui-layout/modal/Modal';

function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        모달 열기
      </button>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="기본 모달"
      >
        <p>모달 내용이 여기에 들어갑니다.</p>
      </Modal>
    </>
  );
}
```

## Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `isOpen` | `boolean` | - | 모달 표시 여부 (필수) |
| `onClose` | `() => void` | - | 모달 닫기 콜백 (필수) |
| `title` | `string` | - | 모달 제목 (선택적) |
| `children` | `ReactNode` | - | 모달 내용 (필수) |
| `maxWidth` | `string` | `'max-w-3xl'` | 모달 최대 너비 (Tailwind 클래스) |
| `exitByClickOutside` | `boolean` | `true` | 바깥 영역 클릭으로 닫기 활성화 |

## 사용 예시

### 기본 모달

```tsx
function BasicModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        기본 모달 열기
      </button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="공지사항"
      >
        <div className="space-y-4">
          <p>시스템 업데이트가 완료되었습니다.</p>
          <p>새로운 기능들을 확인해보세요!</p>
        </div>
      </Modal>
    </>
  );
}
```

### 큰 크기 모달

```tsx
function LargeModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        큰 모달 열기
      </button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="상세 정보"
        maxWidth="max-w-6xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>왼쪽 내용</div>
          <div>오른쪽 내용</div>
        </div>
      </Modal>
    </>
  );
}
```

### 제목 없는 모달

```tsx
function TitlelessModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        제목 없는 모달
      </button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="text-center">
          <h3 className="text-lg font-bold mb-4">커스텀 제목</h3>
          <p>제목 영역 없이 자유롭게 구성할 수 있습니다.</p>
        </div>
      </Modal>
    </>
  );
}
```

### 바깥 클릭 비활성화

```tsx
function PersistentModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        지속 모달 열기
      </button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="중요한 알림"
        exitByClickOutside={false}
      >
        <div className="space-y-4">
          <p>이 모달은 바깥 영역을 클릭해도 닫히지 않습니다.</p>
          <p>X 버튼이나 ESC 키를 사용해서 닫아주세요.</p>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-full py-2 bg-primary text-primary-foreground rounded"
          >
            확인
          </button>
        </div>
      </Modal>
    </>
  );
}
```

### 폼 모달

```tsx
function FormModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('제출된 데이터:', formData);
    setIsOpen(false);
    setFormData({ name: '', email: '' });
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        폼 모달 열기
      </button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="정보 입력"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              이름
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({
                ...formData,
                name: e.target.value
              })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              이메일
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({
                ...formData,
                email: e.target.value
              })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-primary text-primary-foreground rounded"
            >
              제출
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2 bg-secondary text-secondary-foreground rounded"
            >
              취소
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
```

### 이미지 갤러리 모달

```tsx
function GalleryModal() {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    { id: 1, src: '/image1.jpg', alt: '이미지 1' },
    { id: 2, src: '/image2.jpg', alt: '이미지 2' },
    { id: 3, src: '/image3.jpg', alt: '이미지 3' },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.src}
            alt={image.alt}
            className="w-full h-32 object-cover cursor-pointer rounded"
            onClick={() => setSelectedImage(image)}
          />
        ))}
      </div>
      
      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="max-w-4xl"
      >
        {selectedImage && (
          <div className="text-center">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
            <p className="mt-4 text-muted-foreground">
              {selectedImage.alt}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
```

## 스타일링 옵션

### 최대 너비 설정

사용 가능한 Tailwind 클래스:
- `max-w-sm` (384px)
- `max-w-md` (448px)
- `max-w-lg` (512px)
- `max-w-xl` (576px)
- `max-w-2xl` (672px)
- `max-w-3xl` (768px) - 기본값
- `max-w-4xl` (896px)
- `max-w-5xl` (1024px)
- `max-w-6xl` (1152px)
- `max-w-7xl` (1280px)

### 커스텀 스타일링

모달 내용에 커스텀 클래스 적용:

```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="커스텀 스타일"
>
  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
    <h3 className="text-xl font-bold mb-4">그라디언트 배경</h3>
    <p>원하는 스타일을 자유롭게 적용할 수 있습니다.</p>
  </div>
</Modal>
```

## 접근성 기능

- **키보드 지원**: ESC 키로 모달 닫기
- **포커스 관리**: 모달 열릴 때 내부로 포커스 이동
- **스크린 리더**: 적절한 ARIA 속성 (향후 개선 예정)
- **백드롭**: 시각적으로 구분되는 어두운 배경

## 애니메이션 효과

- **진입**: 투명도와 크기 애니메이션 (0.2초)
- **퇴장**: 부드러운 페이드아웃 효과
- **백드롭**: 배경 블러 및 어두워짐 효과
- **스프링**: 자연스러운 움직임 곡선

## 제한사항

- **중첩 모달**: 여러 모달 동시 사용 시 z-index 관리 필요
- **스크롤**: 모달 내용이 길 경우 자동 스크롤 (max-h-[90vh])
- **모바일**: 작은 화면에서는 전체 너비 사용
- **SSR**: 서버 사이드에서는 렌더링되지 않음

## 모범 사례

1. **상태 관리**: useState로 간단한 열림/닫힘 상태 관리
2. **정리**: 컴포넌트 언마운트 시 자동으로 이벤트 리스너 제거
3. **성능**: 모달이 닫혀있을 때는 DOM에 렌더링되지 않음
4. **접근성**: 중요한 액션에는 키보드 접근 방법 제공 