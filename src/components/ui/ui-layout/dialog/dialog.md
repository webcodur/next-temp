# Dialog 컴포넌트

Lucide React 아이콘과 Framer Motion을 활용한 고급 다이얼로그 컴포넌트 시스템입니다.

## 구성 컴포넌트

### Dialog
메인 다이얼로그 컴포넌트

### DialogHeader, DialogTitle, DialogDescription, DialogFooter
다이얼로그 내부 구성을 위한 헬퍼 컴포넌트들

## 주요 특징

- **의미론적 변형**: 5가지 변형 타입으로 용도별 구분
- **아이콘 시스템**: Lucide React 아이콘으로 직관적인 시각 표현
- **유연한 크기**: 4단계 크기 옵션
- **뉴모피즘 디자인**: `neu-raised` 스타일 적용
- **Portal 렌더링**: document.body에 독립적 렌더링
- **애니메이션**: Framer Motion 기반 부드러운 전환
- **접근성**: 키보드 지원 및 ARIA 속성

## 기본 사용법

```tsx
import { Dialog } from '@/components/ui/ui-layout/dialog/Dialog';

function MyComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsDialogOpen(true)}>
        다이얼로그 열기
      </button>
      
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="기본 다이얼로그"
      >
        <p>다이얼로그 내용이 여기에 들어갑니다.</p>
      </Dialog>
    </>
  );
}
```

## Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `isOpen` | `boolean` | - | 다이얼로그 표시 여부 (필수) |
| `onClose` | `() => void` | - | 다이얼로그 닫기 콜백 (필수) |
| `title` | `string` | - | 다이얼로그 제목 |
| `children` | `ReactNode` | - | 다이얼로그 내용 |
| `footer` | `ReactNode` | - | 하단 버튼 영역 |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 다이얼로그 크기 |
| `variant` | `'default' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | 다이얼로그 타입 |
| `showCloseButton` | `boolean` | `true` | X 버튼 표시 여부 |
| `closeOnEscape` | `boolean` | `true` | ESC 키로 닫기 |
| `closeOnOverlay` | `boolean` | `true` | 바깥 영역 클릭으로 닫기 |
| `className` | `string` | `''` | 추가 CSS 클래스 |

## 변형 타입별 사용

### Default 다이얼로그

```tsx
<Dialog
  isOpen={isOpen}
  onClose={onClose}
  title="일반 다이얼로그"
  variant="default"
>
  <p>기본 스타일의 다이얼로그입니다.</p>
</Dialog>
```

### Success 다이얼로그

```tsx
<Dialog
  isOpen={isOpen}
  onClose={onClose}
  title="성공"
  variant="success"
>
  <p>작업이 성공적으로 완료되었습니다!</p>
</Dialog>
```

### Warning 다이얼로그

```tsx
<Dialog
  isOpen={isOpen}
  onClose={onClose}
  title="주의"
  variant="warning"
>
  <p>이 작업을 계속하시겠습니까?</p>
</Dialog>
```

### Error 다이얼로그

```tsx
<Dialog
  isOpen={isOpen}
  onClose={onClose}
  title="오류"
  variant="error"
>
  <p>처리 중 오류가 발생했습니다.</p>
</Dialog>
```

### Info 다이얼로그

```tsx
<Dialog
  isOpen={isOpen}
  onClose={onClose}
  title="정보"
  variant="info"
>
  <p>시스템 업데이트가 예정되어 있습니다.</p>
</Dialog>
```

## 크기 옵션

### Small (sm)

```tsx
<Dialog size="sm" title="작은 다이얼로그">
  <p>간단한 메시지용</p>
</Dialog>
```

### Medium (md) - 기본값

```tsx
<Dialog size="md" title="중간 다이얼로그">
  <p>일반적인 용도</p>
</Dialog>
```

### Large (lg)

```tsx
<Dialog size="lg" title="큰 다이얼로그">
  <p>많은 내용이 있는 경우</p>
</Dialog>
```

### Extra Large (xl)

```tsx
<Dialog size="xl" title="매우 큰 다이얼로그">
  <p>복잡한 폼이나 상세 정보</p>
</Dialog>
```

## 헬퍼 컴포넌트 활용

### 구조화된 다이얼로그

```tsx
import { 
  Dialog, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/ui-layout/dialog/Dialog';

function StructuredDialog() {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>계정 삭제</DialogTitle>
        <DialogDescription>
          이 작업은 되돌릴 수 없습니다. 
          모든 데이터가 영구적으로 삭제됩니다.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4">
        <p>정말로 계정을 삭제하시겠습니까?</p>
      </div>
      
      <DialogFooter>
        <button onClick={onClose}>취소</button>
        <button onClick={handleDelete}>삭제</button>
      </DialogFooter>
    </Dialog>
  );
}
```

## 실용적인 사용 예시

### 확인 다이얼로그

```tsx
function ConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    // 확인 로직
    setIsOpen(false);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="확인"
      variant="warning"
      size="sm"
      footer={
        <DialogFooter>
          <button 
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded"
          >
            취소
          </button>
          <button 
            onClick={handleConfirm}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded"
          >
            확인
          </button>
        </DialogFooter>
      }
    >
      <p>이 파일을 삭제하시겠습니까?</p>
    </Dialog>
  );
}
```

### 폼 다이얼로그

```tsx
function FormDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('제출:', formData);
    setIsOpen(false);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="사용자 추가"
      size="md"
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
        
        <DialogFooter>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            추가
          </button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
```

### 정보 표시 다이얼로그

```tsx
function InfoDialog({ data }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="상세 정보"
      variant="info"
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>이름:</strong> {data.name}
          </div>
          <div>
            <strong>상태:</strong> {data.status}
          </div>
          <div>
            <strong>생성일:</strong> {data.createdAt}
          </div>
          <div>
            <strong>수정일:</strong> {data.updatedAt}
          </div>
        </div>
        
        <div>
          <strong>설명:</strong>
          <p className="mt-1 text-muted-foreground">{data.description}</p>
        </div>
      </div>
    </Dialog>
  );
}
```

### 진행 상황 다이얼로그

```tsx
function ProgressDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const startProcess = async () => {
    setIsOpen(true);
    setProgress(0);
    
    // 진행 상황 시뮬레이션
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }
    
    setIsOpen(false);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => {}} // 진행 중에는 닫기 비활성화
      title="처리 중..."
      closeOnEscape={false}
      closeOnOverlay={false}
      showCloseButton={false}
    >
      <div className="space-y-4">
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-muted-foreground">
          {progress}% 완료
        </p>
      </div>
    </Dialog>
  );
}
```

## 접근성 기능

- **키보드 지원**: ESC 키로 다이얼로그 닫기
- **포커스 관리**: 다이얼로그 열릴 때 내부 요소로 포커스 이동
- **아이콘 접근성**: 의미론적 아이콘으로 시각적 정보 제공
- **색상 대비**: 각 변형별 적절한 색상 대비 확보

## 스타일링 옵션

### 크기별 최대 너비
- `sm`: 448px (max-w-md)
- `md`: 512px (max-w-lg) 
- `lg`: 672px (max-w-2xl)
- `xl`: 896px (max-w-4xl)

### 변형별 색상 체계
- `default`: 기본 테마 색상
- `success`: 녹색 계열
- `warning`: 노란색 계열  
- `error`: 빨간색 계열
- `info`: 파란색 계열

## 제한사항

- **중첩 다이얼로그**: 여러 다이얼로그 동시 사용 시 z-index 관리 필요
- **모바일 최적화**: 작은 화면에서는 padding 조정 필요
- **포커스 트랩**: 완전한 포커스 트랩 미구현

## 모범 사례

1. **적절한 변형 선택**: 용도에 맞는 variant 사용
2. **크기 최적화**: 내용에 맞는 적절한 size 선택
3. **접근성 고려**: 중요한 액션에는 키보드 접근 방법 제공
4. **사용자 경험**: 명확한 액션 버튼과 취소 옵션 제공 