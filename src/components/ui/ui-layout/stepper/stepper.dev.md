# Stepper 컴포넌트 기술 문서

## 아키텍처 개요

다단계 프로세스를 시각화하는 컴포넌트 시스템으로, 8개의 하위 컴포넌트로 구성됩니다.

## 컴포넌트 구조

### 주요 컴포넌트
- **Stepper**: 메인 컨테이너
- **StepperCore**: 핵심 로직 및 상태 관리
- **StepIndicator**: 단계 번호 및 상태 표시
- **Navigation**: 이전/다음 버튼
- **ContentArea**: 단계별 콘텐츠 영역

### 특수 컴포넌트
- **StepperPopup**: 팝업 형태의 스테퍼
- **StepperNavigation**: 독립 네비게이션
- **StepContainer**: 개별 단계 래퍼

## 상태 관리 시스템

### Step 인터페이스
```typescript
interface Step {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  isCompleted?: boolean;
  isOptional?: boolean;
}
```

### 상태 추적
- **currentStep**: 현재 활성 단계
- **completedSteps**: 완료된 단계들
- **validation**: 단계별 유효성 검사

## 이벤트 시스템

### 네비게이션 이벤트
```typescript
onStepChange: (stepIndex: number) => void;
onStepComplete: (stepIndex: number) => void;
onFinish: () => void;
```

### 유효성 검사
```typescript
validateStep: (stepIndex: number) => boolean;
```

## 스타일링 패턴

### 단계 상태별 스타일
- **pending**: 기본 상태
- **active**: 현재 단계
- **completed**: 완료된 단계
- **disabled**: 비활성화 상태

### 레이아웃 모드
- **horizontal**: 가로 배치
- **vertical**: 세로 배치
- **compact**: 축약 표시

## 접근성 구현

### ARIA 지원
```typescript
role="progressbar"
aria-valuenow={currentStep}
aria-valuemax={totalSteps}
aria-label="진행 단계"
```

### 키보드 네비게이션
- Tab/Shift+Tab: 포커스 이동
- Enter/Space: 단계 활성화
- 화살표 키: 단계 간 이동 