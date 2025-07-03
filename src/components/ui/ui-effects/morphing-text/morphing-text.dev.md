# MorphingText 컴포넌트 기술 문서

## 개요

`MorphingText` 컴포넌트는 requestAnimationFrame 기반의 고성능 애니메이션 시스템과 SVG 필터를 활용하여 텍스트 간 부드러운 모핑 효과를 구현한다. 커스텀 훅을 통한 상태 관리와 두 개의 오버레이된 텍스트 요소를 이용한 크로스페이드 애니메이션으로 자연스러운 전환 효과를 제공한다.

## 핵심 의존성

- `react`: 커스텀 훅과 ref 기반 DOM 조작을 위한 기반 라이브러리
- `clsx` 및 `tailwind-merge` (`cn` 유틸리티): 동적 클래스 조합 관리
- SVG 필터: 텍스트 모핑 효과를 위한 브라우저 내장 그래픽 처리

## 구현 플로우

### 1. 커스텀 훅 기반 상태 관리

**useMorphingText 훅**:
- `useRef`를 활용하여 애니메이션 상태를 추적한다 (`textIndexRef`, `morphRef`, `cooldownRef`, `timeRef`).
- 상태 변경 시 리렌더링을 방지하면서 부드러운 애니메이션을 보장한다.
- 외부 `currentIndex` prop 변경을 감지하여 수동 제어를 지원한다.

**애니메이션 타이밍 관리**:
- `morphTime` (1.5초): 실제 모핑 애니메이션 지속 시간
- `cooldownTime` (0.5초): 텍스트 표시 후 대기 시간
- `requestAnimationFrame`을 통해 60fps 기준 부드러운 애니메이션 구현

### 2. 이중 텍스트 오버레이 시스템

**두 개의 텍스트 요소**:
- `text1Ref`: 현재 표시 중인 텍스트 (페이드 아웃)
- `text2Ref`: 다음에 표시할 텍스트 (페이드 인)
- `absolute` 포지셔닝으로 동일한 위치에 오버레이

**크로스페이드 애니메이션**:
- `fraction` 값 (0~1)에 따라 두 텍스트의 투명도와 블러를 반대로 조정
- `Math.pow(fraction, 0.4)`를 사용하여 비선형 투명도 변화로 자연스러운 전환 구현
- 블러 효과: `blur(${Math.min(8 / fraction - 8, 100)}px)`로 텍스트가 흐려지며 사라지는 효과

### 3. SVG 필터 시스템

**morphing-threshold 필터**:
- `feColorMatrix`를 사용하여 텍스트 가장자리를 선명하게 처리
- `values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 255 -140"`로 알파 채널 조정
- 블러와 조합하여 부드러운 모핑 효과 구현

**필터 적용**:
- `[filter:url(#morphing-threshold)_blur(0.6px)]` 클래스로 전체 컨테이너에 적용
- 미세한 기본 블러로 텍스트 가장자리를 부드럽게 처리

### 4. 성능 최적화

**requestAnimationFrame 활용**:
- 브라우저의 리페인트 주기에 맞춰 애니메이션 실행
- `cancelAnimationFrame`으로 컴포넌트 언마운트 시 정리
- CPU 사용량 최적화와 부드러운 60fps 애니메이션 보장

**메모이제이션**:
- `useCallback`을 통해 `setStyles`, `doMorph`, `doCooldown` 함수 메모이제이션
- 불필요한 함수 재생성 방지로 성능 향상

### 5. 제어 시스템

**자동/수동 모드**:
- `autoPlay` prop으로 자동 순환과 수동 제어 전환
- `currentIndex` prop으로 외부에서 특정 텍스트로 즉시 변경 가능
- `onTextChange` 콜백으로 텍스트 변경 이벤트 전파

**즉시 변경 로직**:
- 외부 `currentIndex` 변경 시 `cooldownTime`만큼 대기 후 해당 텍스트로 즉시 전환
- 애니메이션 중단 없이 자연스러운 전환 보장

## 주요 특징

- **고성능**: requestAnimationFrame과 ref 기반으로 리렌더링 없는 애니메이션
- **브라우저 호환성**: SVG 필터를 지원하는 모든 모던 브라우저에서 작동
- **반응형 디자인**: Tailwind 클래스를 통한 모바일/데스크톱 최적화
- **다국어 지원**: `font-multilang` 클래스로 자동 폰트 선택
- **접근성**: 텍스트 내용이 DOM에 유지되어 스크린 리더 지원
- **유연한 제어**: 자동 순환과 수동 제어 모드 지원 