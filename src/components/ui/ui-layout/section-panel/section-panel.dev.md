# SectionPanel 개발 문서

## 개요

SectionPanel은 헤더와 콘텐츠 영역으로 구성된 섹션 패널 컴포넌트입니다. BarrierManager 기준의 고정 스타일링으로 일관된 디자인 시스템을 제공합니다.

## 컴포넌트 구조

### 1. SectionPanel (메인 컴포넌트)
- 헤더와 콘텐츠를 포함하는 컨테이너
- 고정 gradient 스타일링 적용
- 중앙 정렬 타이틀, h-10 고정 높이

### 2. SectionPanelHeader (독립 컴포넌트) 
- 독립적으로 사용 가능한 헤더
- px-4 py-3 고정 패딩
- justify-between 레이아웃

### 3. SectionPanelContent (독립 컴포넌트)
- 독립적으로 사용 가능한 콘텐츠 영역
- flex-1 레이아웃

## 고정 스타일링 세부사항

### 컨테이너 스타일
```css
.container {
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem; /* rounded-lg = 8px */
  /* neu-flat bg-surface-2 */
}
```

### 헤더 스타일 (고정)
```css
.header {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem; /* px-4 py-3 */
  flex-shrink: 0;
  background: linear-gradient(to right, rgb(var(--primary) / 0.8), rgb(var(--primary) / 0.6));
  color: rgb(var(--primary-foreground));
}

.title-container {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 2.5rem; /* h-10 = 40px */
}

.title {
  font-size: 1.125rem; /* text-lg */
  font-weight: 700; /* font-bold */
  color: white;
  /* font-multilang 클래스 적용 */
}
```

## 컴포넌트 인터페이스

### SectionPanelProps
```typescript
interface SectionPanelProps {
  title?: string;                    // 헤더 제목
  children: ReactNode;               // 콘텐츠 (필수)
  className?: string;                // 컨테이너 CSS 클래스
  headerClassName?: string;          // 헤더 CSS 클래스  
  contentClassName?: string;         // 콘텐츠 CSS 클래스
  headerActions?: ReactNode;         // 헤더 우측 액션
  icon?: ReactNode;                  // 헤더 좌측 아이콘
}
```

### SectionPanelHeaderProps  
```typescript
interface SectionPanelHeaderProps {
  children: ReactNode;               // 헤더 콘텐츠 (필수)
  className?: string;                // CSS 클래스
}
```

### SectionPanelContentProps
```typescript
interface SectionPanelContentProps {
  children: ReactNode;               // 콘텐츠 (필수)
  className?: string;                // CSS 클래스
}
```

## 사용 시나리오

### 1. 차량 관리 패널 (VehicleDetailCard)
```tsx
<SectionPanel 
  title={t('주차_카드_차량정보')}
  className="h-full"
  contentClassName="overflow-auto"
>
  {/* 차량 상세 정보 */}
</SectionPanel>
```

### 2. 테이블 컨테이너 (VehicleListTable)
```tsx
<SectionPanel 
  title={t('주차_테이블_제목_금일입출차현황')}
  className="w-full h-full"
  contentClassName="flex flex-col min-h-0 overflow-hidden"
>
  {/* 검색 필터 + 테이블 */}
</SectionPanel>
```

### 3. 커스텀 레이아웃
```tsx
<div className="neu-flat bg-surface-2 rounded-lg">
  <SectionPanelHeader>
    <h3>커스텀 헤더</h3>
    <button>액션</button>
  </SectionPanelHeader>
  <SectionPanelContent>
    {/* 커스텀 콘텐츠 */}
  </SectionPanelContent>
</div>
```

## 설계 원칙

### 1. 일관성 (Consistency)
- BarrierManager의 VehicleTypeCard와 동일한 스타일링
- 모든 패널이 동일한 헤더 높이, 타이틀 스타일 사용
- px-4 py-3 패딩으로 헤더 높이 통일

### 2. 단순성 (Simplicity)  
- 조건부 처리 제거로 복잡성 감소
- 고정 스타일링으로 예측 가능한 동작
- 명확한 컴포넌트 구조

### 3. 유연성 (Flexibility)
- 독립 컴포넌트로 세밀한 제어 가능
- className props로 추가 스타일링 지원
- headerActions, icon props로 확장성 제공

## 개발 가이드라인

### 1. 스타일링
- **DO**: 고정 스타일링 활용, className으로 추가 스타일링
- **DON'T**: 내부 스타일을 임의로 변경하지 않기

### 2. 레이아웃
- **DO**: contentClassName으로 콘텐츠 레이아웃 제어
- **DON'T**: 헤더의 h-10 고정 높이 변경하지 않기

### 3. 접근성
- **DO**: font-multilang 클래스 사용
- **DO**: 의미 있는 title 제공
- **DON'T**: 색상만으로 정보 전달하지 않기

## 성능 고려사항

### 1. 렌더링 최적화
- 헤더 존재 여부를 hasHeader로 조건부 렌더링
- clsx 사용으로 효율적인 클래스 합성

### 2. 메모리 사용
- 불필요한 조건부 처리 제거
- 단순한 컴포넌트 구조로 메모리 효율성 향상

## 버전 히스토리

### v1.1.0 (현재)
- variant prop 제거
- 고정 gradient 스타일링 적용  
- BarrierManager 기준 디자인 통일
- 조건부 처리 제거로 단순화

### v1.0.0
- 초기 구현
- variant='default' | 'gradient' 지원
- 조건부 스타일링 적용 