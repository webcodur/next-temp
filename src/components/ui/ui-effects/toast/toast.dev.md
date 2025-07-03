# Toast 컴포넌트 기술 문서

## 아키텍처 개요

Sonner 라이브러리를 기반으로 한 토스트 알림 시스템입니다. 단순한 래핑 구조로 최소한의 설정만으로 강력한 토스트 기능을 제공합니다.

## 핵심 기술 스택

### 외부 의존성
- **sonner**: 고성능 토스트 라이브러리
- **React Context**: 전역 상태 관리 (Sonner 내장)

### 설계 원칙
- **최소 래핑**: 외부 라이브러리의 기능을 그대로 노출
- **제로 설정**: 기본 설정으로 즉시 사용 가능
- **Provider 패턴**: React Context를 통한 전역 접근

## 구현 세부사항

### 1. Provider 구조

```typescript
const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    {children}
    <Toaster position="bottom-center" richColors toastOptions={{ duration: 3000 }} />
  </>
);
```

**특징:**
- children 먼저 렌더링 후 Toaster 배치
- Fragment로 불필요한 래핑 요소 제거
- 기본 설정 하드코딩으로 일관성 유지

### 2. 기본 설정 분석

```typescript
<Toaster 
  position="bottom-center"    // 화면 하단 중앙
  richColors                  // 의미론적 색상 활성화
  toastOptions={{ 
    duration: 3000             // 3초 자동 제거
  }} 
/>
```

**설정 근거:**
- **bottom-center**: 사용자 시선에 방해되지 않으면서 잘 보이는 위치
- **richColors**: success=녹색, error=빨간색 등 직관적 색상
- **3000ms**: UX 연구에 기반한 최적 지속 시간

### 3. Export 전략

```typescript
export { ToastProvider, toast };
```

**이중 Export:**
- `ToastProvider`: 앱 초기 설정용
- `toast`: 실제 토스트 호출용
- Sonner의 `toast` 함수를 직접 re-export

## Sonner 라이브러리 특징

### 1. 성능 최적화

**Virtual DOM 최적화:**
- 토스트 컴포넌트들이 React 렌더링 트리 외부에서 관리
- 부모 컴포넌트 리렌더링과 독립적
- 포털(Portal) 기반 렌더링

**메모리 관리:**
- 자동 정리: 토스트 제거 시 메모리에서 완전 해제
- 스택 제한: 최대 표시 개수 자동 관리
- 애니메이션 최적화: requestAnimationFrame 활용

### 2. 접근성 구현

**ARIA 지원:**
```html
<div role="region" aria-live="polite" aria-label="Notifications">
  <div role="status" aria-live="polite">
    토스트 메시지 내용
  </div>
</div>
```

**키보드 지원:**
- ESC: 현재 토스트 닫기
- Tab: 토스트 내 버튼 간 이동
- Enter/Space: 액션 버튼 실행

### 3. 상태 관리 시스템

```typescript
// Sonner 내부 상태 구조
interface ToastState {
  toasts: Toast[];
  height: number;
  frontToast: string | undefined;
  count: number;
}
```

**상태 업데이트 플로우:**
1. `toast()` 호출 → 새 토스트 생성
2. 상태 업데이트 → 모든 구독자에게 전파
3. 애니메이션 트리거 → 시각적 표시
4. 타이머 설정 → 자동 제거 예약

## 고급 기능 구현

### 1. Promise 기반 토스트

```typescript
toast.promise(promise, {
  loading: 'Loading...',
  success: (data) => `Success: ${data}`,
  error: 'Error occurred'
});
```

**내부 구현:**
- Promise 상태 감지
- 로딩 토스트 생성 → 성공/실패 토스트로 교체
- 동일 ID 사용으로 부드러운 전환

### 2. 액션 버튼 시스템

```typescript
toast('Message', {
  action: {
    label: 'Undo',
    onClick: () => undoAction()
  }
});
```

**기술 구현:**
- 클릭 이벤트 버블링 방지
- 토스트 자동 닫기 기본 동작
- 커스텀 스타일링 지원

### 3. 토스트 제어 API

```typescript
// 내부 구현 로직
const dismiss = (toastId?: string) => {
  if (toastId) {
    // 특정 토스트 제거
    setState(prev => ({
      ...prev,
      toasts: prev.toasts.filter(t => t.id !== toastId)
    }));
  } else {
    // 모든 토스트 제거
    setState(prev => ({ ...prev, toasts: [] }));
  }
};
```

## 스타일링 시스템

### 1. CSS-in-JS 통합

```typescript
// 테마 변수 자동 감지
const toastStyles = {
  background: 'hsl(var(--background))',
  color: 'hsl(var(--foreground))',
  border: '1px solid hsl(var(--border))'
};
```

### 2. 다크 모드 지원

**자동 테마 감지:**
```css
/* Sonner 내부 CSS */
[data-sonner-toaster][data-theme='dark'] {
  --normal-bg: #262626;
  --normal-border: #404040;
  --normal-text: #fafafa;
}
```

### 3. 애니메이션 시스템

**진입 애니메이션:**
```css
@keyframes toast-in-right {
  from {
    transform: translateX(calc(100% + 1rem));
  }
  to {
    transform: translateX(0);
  }
}
```

**스택 애니메이션:**
- 새 토스트 추가 시 기존 토스트들 위로 밀어올리기
- transform3d 사용으로 GPU 가속
- ease-out 곡선으로 자연스러운 움직임

## 성능 최적화

### 1. 렌더링 최적화

**React DevTools 관찰 결과:**
- 토스트 표시/제거 시 앱 컴포넌트 리렌더링 없음
- 포털을 통한 DOM 직접 조작
- Virtual DOM 오버헤드 최소화

### 2. 메모리 사용량

```typescript
// 메모리 누수 방지
useEffect(() => {
  return () => {
    // 컴포넌트 언마운트 시 토스트 정리
    toast.dismiss();
  };
}, []);
```

### 3. 번들 크기 영향

**Sonner 번들 분석:**
- 핵심 기능만 포함된 경량 라이브러리
- Tree-shaking 지원
- 총 크기: ~15KB (gzipped ~5KB)

## 확장성 고려사항

### 1. 커스텀 토스트 컴포넌트

```typescript
const CustomToast = ({ message, type }) => (
  <div className={`custom-toast custom-toast--${type}`}>
    {message}
  </div>
);

toast.custom(<CustomToast message="Hello" type="info" />);
```

### 2. 전역 설정 변경

```typescript
// 런타임 설정 변경
const updateToasterConfig = () => {
  // 새로운 Toaster 인스턴스 생성 필요
  // 현재 구조에서는 정적 설정만 지원
};
```

**제한사항:**
- 런타임 설정 변경 어려움
- Provider 재마운트를 통한 설정 변경만 가능

### 3. 다중 Toaster 지원

```typescript
// 영역별 토스트 관리 가능
<Toaster position="top-right" />    {/* 알림용 */}
<Toaster position="bottom-left" />  {/* 상태용 */}
```

## 브라우저 호환성

### 1. 지원 브라우저
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### 2. 폴리필 요구사항
- Promise (IE11용)
- ResizeObserver (구형 브라우저용)

### 3. 모바일 최적화
- 터치 스와이프 제스처 지원
- 뷰포트 크기에 따른 자동 조정
- iOS Safari의 viewport 이슈 해결

## 테스트 전략

### 1. 단위 테스트

```typescript
describe('ToastProvider', () => {
  it('renders children correctly', () => {
    render(
      <ToastProvider>
        <div>Test content</div>
      </ToastProvider>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});
```

### 2. 통합 테스트

```typescript
it('displays toast message', async () => {
  render(<ToastProvider><TestComponent /></ToastProvider>);
  
  fireEvent.click(screen.getByText('Show toast'));
  
  await waitFor(() => {
    expect(screen.getByText('Toast message')).toBeInTheDocument();
  });
});
```

### 3. 접근성 테스트

```typescript
it('announces toast to screen readers', async () => {
  const { container } = render(<ToastProvider />);
  
  toast('Accessible message');
  
  await waitFor(() => {
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toHaveTextContent('Accessible message');
  });
});
```

## 알려진 이슈 및 해결방안

### 1. SSR 호환성

**문제:** 서버 사이드에서 토스트 상태 동기화 어려움
**해결:** 클라이언트 전용 라이브러리로 사용 권장

### 2. 스타일 우선순위

**문제:** 프로젝트 CSS와 충돌 가능성
**해결:** CSS specificity 조정 또는 CSS-in-JS 활용

### 3. 많은 토스트 동시 표시

**문제:** 성능 저하 및 UI 혼잡
**해결:** 최대 표시 개수 제한 (Sonner 기본 제공)

## 유지보수 가이드

### 1. 업데이트 고려사항
- Sonner 라이브러리 버전 업데이트 시 API 변경 확인
- 브레이킹 체인지에 대한 마이그레이션 가이드 검토

### 2. 성능 모니터링
- 토스트 표시 빈도 추적
- 메모리 사용량 모니터링
- 사용자 상호작용 분석

### 3. 사용성 개선
- 사용자 피드백을 통한 지속 시간 조정
- 접근성 테스트 정기 실행
- 다양한 기기에서의 동작 검증 