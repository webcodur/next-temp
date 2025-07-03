# Modal 컴포넌트 기술 문서

## 아키텍처 개요

React Portal과 Framer Motion을 결합하여 구현한 모달 컴포넌트입니다. DOM 구조상 독립적인 위치에 렌더링되면서 부드러운 애니메이션과 접근성을 제공합니다.

## 핵심 기술 스택

### 외부 의존성
- **react-dom**: `createPortal` API 활용
- **framer-motion**: 애니메이션 및 AnimatePresence
- **React Hooks**: useEffect, useCallback

### 설계 원칙
- **Portal 패턴**: DOM 트리 구조와 독립적인 렌더링
- **선언적 애니메이션**: Framer Motion으로 상태 기반 애니메이션
- **이벤트 위임**: 키보드 및 마우스 이벤트 중앙 관리
- **SSR 호환성**: 서버 환경에서 안전한 처리

## 구현 세부사항

### 1. Portal 렌더링 시스템

```typescript
if (typeof window === 'undefined') {
  return null;
}

return createPortal(
  <AnimatePresence>
    {isOpen && (
      // 모달 컨텐츠
    )}
  </AnimatePresence>,
  document.body
);
```

**핵심 기술:**
- **SSR 가드**: `typeof window === 'undefined'` 체크
- **document.body 타겟**: 최상위 DOM 노드에 렌더링
- **조건부 렌더링**: `isOpen` 상태에 따른 동적 마운트/언마운트

**장점:**
- z-index 문제 완전 해결
- 부모 컴포넌트의 CSS 영향 차단
- 전역 스타일 적용 용이

### 2. 애니메이션 시스템

```typescript
<motion.div
  className="flex fixed inset-0 z-50 justify-center items-center bg-black/50 backdrop-blur-xs"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2 }}
>
  <motion.div
    className={`overflow-y-auto relative w-full bg-background rounded-lg shadow-lg ${maxWidth} max-h-[90vh]`}
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.9, opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
```

**애니메이션 구조:**
1. **백드롭 애니메이션**: 투명도만 변경 (성능 최적화)
2. **컨텐츠 애니메이션**: 스케일 + 투명도 조합
3. **진입/퇴장 동기화**: AnimatePresence로 라이프사이클 관리

**성능 최적화:**
- GPU 가속 속성 사용 (transform, opacity)
- 짧은 애니메이션 시간 (0.2초)
- will-change 최적화 (Framer Motion 내장)

### 3. 이벤트 처리 시스템

```typescript
const handleEscKey = useCallback(
  (event: KeyboardEvent) => {
    if (event.key === 'Escape') onClose();
  },
  [onClose]
);

const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
  if (event.target === event.currentTarget && exitByClickOutside) onClose();
};

useEffect(() => {
  if (!isOpen) return;
  document.addEventListener('keydown', handleEscKey);
  return () => document.removeEventListener('keydown', handleEscKey);
}, [isOpen, handleEscKey]);
```

**이벤트 관리 전략:**
- **useCallback**: 이벤트 핸들러 메모이제이션으로 성능 향상
- **조건부 리스너**: 모달이 열려있을 때만 ESC 키 리스너 등록
- **자동 정리**: useEffect cleanup으로 메모리 누수 방지
- **이벤트 버블링**: currentTarget 비교로 정확한 클릭 감지

### 4. 조건부 렌더링 로직

```typescript
{title && (
  <div className="p-6 pb-4 border-b border-border">
    <h2 className="text-xl font-semibold text-center text-foreground">
      {title}
    </h2>
  </div>
)}

<div className={title ? "p-6" : "p-6 pt-12"}>{children}</div>
```

**적응형 레이아웃:**
- 제목 유무에 따른 헤더 영역 조건부 렌더링
- 닫기 버튼 위치 고려한 상단 패딩 조정
- CSS 클래스 조건부 적용

## 스타일링 시스템

### 1. Tailwind CSS 통합

```typescript
// 백드롭 스타일
className="flex fixed inset-0 z-50 justify-center items-center bg-black/50 backdrop-blur-xs"

// 모달 컨테이너 스타일  
className={`overflow-y-auto relative w-full bg-background rounded-lg shadow-lg ${maxWidth} max-h-[90vh]`}
```

**스타일 구성 요소:**
- **fixed positioning**: 뷰포트 기준 고정 위치
- **Flexbox 중앙 정렬**: justify-center + items-center
- **백드롭 효과**: bg-black/50 + backdrop-blur-xs
- **반응형 크기**: w-full + maxWidth props
- **스크롤 제어**: overflow-y-auto + max-h-[90vh]

### 2. CSS 변수 활용

```typescript
bg-background     // var(--background)
text-foreground   // var(--foreground)  
border-border     // var(--border)
```

**테마 시스템 통합:**
- CSS 변수를 통한 다크/라이트 모드 자동 적응
- 일관된 색상 팔레트 적용
- 시스템 테마 변경 시 실시간 반영

### 3. 닫기 버튼 스타일링

```typescript
className="absolute top-4 right-4 z-10 text-2xl text-foreground cursor-pointer hover:text-destructive"
```

**인터랙션 디자인:**
- 절대 위치로 항상 접근 가능한 위치
- hover 상태에서 destructive 색상으로 변경
- 충분한 클릭 영역 확보 (text-2xl)

## 접근성 구현

### 1. 키보드 네비게이션

```typescript
useEffect(() => {
  if (!isOpen) return;
  document.addEventListener('keydown', handleEscKey);
  return () => document.removeEventListener('keydown', handleEscKey);
}, [isOpen, handleEscKey]);
```

**지원 기능:**
- ESC 키로 모달 닫기
- 전역 키보드 리스너 등록/해제
- 모달 열림 상태에서만 활성화

### 2. 포커스 관리 (향후 개선 필요)

**현재 상태:**
- 기본적인 포커스 동작만 지원
- 포커스 트랩 미구현

**개선 계획:**
```typescript
// 포커스 트랩 구현 예시
useEffect(() => {
  if (!isOpen) return;
  
  const focusableElements = modalRef.current?.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements?.length) {
    (focusableElements[0] as HTMLElement).focus();
  }
}, [isOpen]);
```

### 3. ARIA 속성 (향후 추가 예정)

**필요한 속성들:**
```typescript
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby={title ? "modal-title" : undefined}
  aria-describedby="modal-content"
>
```

## 성능 최적화

### 1. 렌더링 최적화

**조건부 렌더링:**
- `isOpen` 상태가 false일 때 DOM에 렌더링되지 않음
- AnimatePresence로 마운트/언마운트 애니메이션 처리
- Portal을 통한 독립적인 렌더링 트리

**메모이제이션:**
```typescript
const handleEscKey = useCallback(
  (event: KeyboardEvent) => {
    if (event.key === 'Escape') onClose();
  },
  [onClose]
);
```

### 2. 애니메이션 성능

**GPU 가속 속성:**
- transform: scale() - 하드웨어 가속
- opacity - 컴포지터 레이어
- backdrop-filter - 최신 브라우저 지원

**애니메이션 최적화:**
```typescript
transition={{ duration: 0.2 }} // 짧은 지속 시간
// will-change 자동 관리 (Framer Motion)
```

### 3. 메모리 관리

**이벤트 리스너 정리:**
```typescript
useEffect(() => {
  if (!isOpen) return;
  document.addEventListener('keydown', handleEscKey);
  return () => document.removeEventListener('keydown', handleEscKey);
}, [isOpen, handleEscKey]);
```

**Portal 정리:**
- React Portal은 컴포넌트 언마운트 시 자동으로 DOM에서 제거
- 메모리 누수 위험 최소화

## 브라우저 호환성

### 1. Portal 지원
- React 16+ 의존성
- 모든 모던 브라우저 지원
- IE11+ (React 지원 범위와 동일)

### 2. Framer Motion 호환성
- Chrome 60+
- Firefox 55+  
- Safari 12+
- Edge 79+

### 3. CSS 기능 지원

**최신 CSS 기능:**
```css
backdrop-filter: blur(4px);  /* 최신 브라우저 */
bg-black/50                  /* CSS 색상 투명도 */
```

**폴백 전략:**
- backdrop-filter 미지원 시 투명 배경으로 대체
- Tailwind CSS의 브라우저 호환성 활용

## 확장성 고려사항

### 1. 다중 모달 지원

**현재 제한사항:**
- z-index 하드코딩 (z-50)
- 단일 모달 전용 설계

**개선 방안:**
```typescript
interface ModalContextValue {
  zIndex: number;
  incrementZIndex: () => number;
}

const ModalProvider = ({ children }) => {
  const [baseZIndex, setBaseZIndex] = useState(1000);
  // z-index 동적 관리
};
```

### 2. 커스텀 애니메이션

**현재 구조:**
- 하드코딩된 애니메이션 설정
- scale + opacity 조합 고정

**확장 가능한 구조:**
```typescript
interface ModalProps {
  animations?: {
    initial?: MotionProps['initial'];
    animate?: MotionProps['animate'];
    exit?: MotionProps['exit'];
  };
}
```

### 3. 테마 시스템 확장

**현재 상태:**
- CSS 변수 기반 기본 테마
- Tailwind 클래스 의존성

**향후 개선:**
```typescript
interface ModalTheme {
  backdrop: string;
  container: string;
  closeButton: string;
}

const useModalTheme = () => {
  // 테마 객체 반환
};
```

## 알려진 이슈 및 해결방안

### 1. 스크롤 이슈

**문제:** 모달 열림 시 배경 스크롤 가능
**해결방안:**
```typescript
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }
}, [isOpen]);
```

### 2. 모바일 뷰포트 이슈

**문제:** iOS Safari에서 vh 단위 이슈
**해결방안:**
```css
/* CSS 커스텀 속성 활용 */
.modal-container {
  height: calc(var(--vh, 1vh) * 90);
}
```

### 3. 포커스 트랩 부재

**문제:** 탭 키로 모달 외부 요소 접근 가능
**해결방안:** focus-trap 라이브러리 또는 커스텀 구현

## 테스트 전략

### 1. 단위 테스트

```typescript
describe('Modal', () => {
  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        Test content
      </Modal>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});
```

### 2. 통합 테스트

```typescript
it('closes on ESC key press', () => {
  const onClose = jest.fn();
  render(<Modal isOpen={true} onClose={onClose}>Content</Modal>);
  
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(onClose).toHaveBeenCalled();
});
```

### 3. 접근성 테스트

```typescript
it('focuses on modal when opened', () => {
  const { rerender } = render(
    <Modal isOpen={false} onClose={jest.fn()}>Content</Modal>
  );
  
  rerender(<Modal isOpen={true} onClose={jest.fn()}>Content</Modal>);
  
  // 포커스 확인 로직
});
```

## 유지보수 가이드

### 1. 의존성 업데이트

**Framer Motion 업데이트:**
- API 변경사항 확인
- 애니메이션 성능 테스트
- 브라우저 호환성 검증

**React 업데이트:**
- Portal API 변경사항 확인
- Hooks 동작 검증

### 2. 성능 모니터링

**측정 지표:**
- 모달 열림/닫힘 시간
- 애니메이션 프레임 드롭
- 메모리 사용량 변화

### 3. 접근성 개선

**정기 검토 항목:**
- 키보드 네비게이션 테스트
- 스크린 리더 호환성 확인
- WCAG 가이드라인 준수 검토 