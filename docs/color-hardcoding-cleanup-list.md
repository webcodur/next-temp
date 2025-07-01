# 하드코딩 색상값 정리 작업 목록

## 📋 작업 개요

프로젝트 전체에서 하드코딩된 색상값을 찾아 CSS 변수와 라이트/다크 모드를 지원하는 색상값으로 변경하는 작업 목록이다.

## 🎯 작업 원칙

1. **Hex 색상 → CSS 변수**: `#333333` → `hsl(var(--foreground))`
2. **Tailwind 하드코딩 → 시맨틱 색상**: `text-gray-700` → `text-foreground`
3. **RGBA 하드코딩 → CSS 변수**: `rgba(0,0,0,0.1)` → `hsl(var(--foreground) / 0.1)`
4. **상태별 색상 → 시맨틱 변수**: `bg-red-500` → `bg-destructive`

## 🔧 우선순위별 작업 항목

### 🚨 Priority 1: 핵심 UI 컴포넌트

#### 1.1 Pagination 관련 (4개 파일)

**📁 src/components/ui/pagination/**

- **PaginationControls.tsx** - 중요도: ⭐⭐⭐

  ```tsx
  // 현재 하드코딩
  text-[#cccccc] cursor-not-allowed   → text-muted-foreground cursor-not-allowed
  text-[#333333] neu-raised           → text-foreground neu-raised
  bg-[#2563eb] text-white            → bg-primary text-primary-foreground
  ```

- **PaginationInfo.tsx** - 중요도: ⭐⭐⭐

  ```tsx
  // 현재 하드코딩
  text-[#666666] text-sm             → text-muted-foreground text-sm
  ```

- **PaginatedTable.tsx** - 중요도: ⭐⭐⭐

  ```tsx
  // 현재 하드코딩
  text-[#333333]                     → text-foreground
  ```

- **PageSizeSelector.tsx** - 중요도: ⭐⭐⭐
  ```tsx
  // 현재 하드코딩
  border-[#dddddd]                   → border-border
  text-[#333333]                     → text-foreground
  focus:border-[#2563eb]             → focus:border-primary
  focus:ring-[#2563eb]               → focus:ring-primary
  ```

#### 1.2 에디터 컴포넌트

**📁 src/components/ui/editor/**

- **markdown-editor.tsx** - 중요도: ⭐⭐⭐
  ```css
  /* 현재 하드코딩 */
  color: #333;                       → color: hsl(var(--foreground));
  background: #ffffff;               → background: hsl(var(--background));
  a { color: #6366f1; }             → a { color: hsl(var(--primary)); }
  h1, h2, h3, h4, h5, h6 { color: #333; } → h1, h2, h3, h4, h5, h6 { color: hsl(var(--foreground)); }
  color: #9ca3af;                   → color: hsl(var(--muted-foreground));
  ```

#### 1.3 DnD 컴포넌트

**📁 src/components/ui/dnd/**

- **SortableList.tsx** - 중요도: ⭐⭐
  ```tsx
  // 현재 하드코딩
  border: '1px solid #ccc'          → border: '1px solid hsl(var(--border))'
  background: '#fff'                → background: 'hsl(var(--background))'
  ```

### 🔥 Priority 2: 레이아웃 & 네비게이션

#### 2.1 사이드바 컴포넌트

**📁 src/components/layout/sidebar/unit/**

- **SideHeader.tsx** - 중요도: ⭐⭐⭐
  ```tsx
  // 현재 하드코딩
  shadow-[0_2px_4px_rgba(0,0,0,0.08)]   → 뉴모피즘 클래스 사용
  hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] → 뉴모피즘 클래스 사용
  ```

#### 2.2 메인 레이아웃

**📁 src/app/**

- **layout.tsx** - 중요도: ⭐⭐⭐
  ```tsx
  // 현재 하드코딩
  bg-gray-50                        → bg-background
  ```

### 🎨 Priority 3: 특수 UI 컴포넌트

#### 3.1 LicensePlate 컴포넌트 (대규모 리팩토링 필요)

**📁 src/components/ui/license-plate/**

- **LicensePlate.tsx** - 중요도: ⭐⭐⭐⭐⭐

  ```tsx
  // 현재 많은 하드코딩 색상들
  background: '#ffffff'              → background: 'hsl(var(--background))'
  border: '#000000'                  → border: 'hsl(var(--border))'
  leftPanel: '#003876'               → leftPanel: 'hsl(var(--primary))'
  borderLight: '#e5e5e5'             → borderLight: 'hsl(var(--border))'
  borderDark: '#999999'              → borderDark: 'hsl(var(--muted))'

  // 그라디언트 색상들도 모두 CSS 변수로 변경 필요
  #ffffff, #f8f8f8, #f5f5f5, #f0f0f0 등

  // 텍스트 섀도우 및 box-shadow들
  rgba(0, 0, 0, 0.3) 등 → 뉴모피즘 시스템 활용
  ```

#### 3.2 SmartTable 컴포넌트

**📁 src/components/ui/smartTable/**

- **SmartTable.tsx** - 중요도: ⭐⭐⭐
  ```tsx
  // 현재 하드코딩
  border-gray-200                   → border-border
  text-gray-700                     → text-foreground
  text-gray-500                     → text-muted-foreground
  ```

### 🎭 Priority 4: 폼 & 입력 컴포넌트

#### 4.1 Simple Input 컴포넌트들

**📁 src/components/ui/simple-input/**

- **FieldToggleButton.tsx** - 중요도: ⭐⭐

  ```tsx
  // 현재 하드코딩
  bg-gray-200 text-gray-800         → bg-muted text-muted-foreground
  bg-gray-50 text-gray-700          → bg-background text-foreground
  border-gray-300                   → border-border
  text-gray-700                     → text-foreground
  ```

- **FieldRadioGroup.tsx** - 중요도: ⭐⭐
  ```tsx
  // 현재 하드코딩
  text-gray-700                     → text-foreground
  border-gray-400                   → border-border
  border-gray-300                   → border-border
  bg-gray-900                       → bg-foreground
  text-gray-800                     → text-foreground
  ```

#### 4.2 고급 검색 컴포넌트

**📁 src/components/ui/advanced-search/**

- **AdvancedSearch.tsx** - 중요도: ⭐⭐
  ```tsx
  // 현재 하드코딩
  text-gray-600                     → text-muted-foreground
  hover:text-gray-800               → hover:text-foreground
  bg-gray-800                       → bg-primary
  hover:bg-gray-900                 → hover:bg-primary/90
  ```

### 🏗️ Priority 5: 데이터 시각화 & 상태 표시

#### 5.1 주차 관련 컴포넌트들

**📁 src/unit/parking/**

- **VehicleListTable.tsx** - 중요도: ⭐⭐

  ```tsx
  // 현재 하드코딩
  bg-red-500/10                     → bg-destructive/10
  bg-green-500/10 text-green-600    → bg-success/10 text-success
  ```

- **VehicleDetailCard.tsx** - 중요도: ⭐⭐

  ```tsx
  // 현재 하드코딩
  bg-green-500/10 text-green-600    → bg-success/10 text-success
  border-green-500/20               → border-success/20
  bg-green-600                      → bg-success
  bg-red-500                        → bg-destructive
  text-red-600                      → text-destructive
  ```

- **BarrierGrid.tsx** - 중요도: ⭐⭐
  ```tsx
  // 현재 하드코딩
  bg-green-600 text-green-600       → bg-success text-success
  bg-red-600 text-red-600           → bg-destructive text-destructive
  bg-purple-600 text-purple-600     → bg-accent text-accent
  ```

#### 5.2 메뉴 데이터

**📁 src/data/**

- **menuData.ts** - 중요도: ⭐⭐
  ```tsx
  // 현재 하드코딩
  color: 'bg-blue-500'              → color: 'bg-primary'
  color: 'bg-green-500'             → color: 'bg-success'
  color: 'bg-purple-500'            → color: 'bg-accent'
  color: 'bg-gray-500'              → color: 'bg-muted'
  color: 'bg-pink-500'              → color: 'bg-secondary'
  ```

### 🎪 Priority 6: 효과 & 애니메이션

#### 6.1 Tooltip 컴포넌트

**📁 src/components/ui/tooltip/**

- **Tooltip.tsx** - 중요도: ⭐⭐
  ```tsx
  // 현재 하드코딩
  error: 'bg-red-600 text-background' → error: 'bg-destructive text-destructive-foreground'
  ```

#### 6.2 Dialog 컴포넌트

**📁 src/components/ui/dialog/**

- **Dialog.tsx** - 중요도: ⭐⭐
  ```tsx
  // 현재 하드코딩
  iconColor: 'text-green-600'       → iconColor: 'text-success'
  borderColor: 'border-green-500/20' → borderColor: 'border-success/20'
  iconColor: 'text-yellow-600'      → iconColor: 'text-warning'
  borderColor: 'border-yellow-500/20' → borderColor: 'border-warning/20'
  iconColor: 'text-red-600'         → iconColor: 'text-destructive'
  borderColor: 'border-red-500/20'  → borderColor: 'border-destructive/20'
  ```

#### 6.3 Card 컴포넌트

**📁 src/components/ui/card/**

- **Card.tsx** - 중요도: ⭐⭐
  ```tsx
  // 현재 하드코딩
  bg-green-500/10 text-green-600    → bg-success/10 text-success
  bg-yellow-500/10 text-yellow-600  → bg-warning/10 text-warning
  bg-red-500/10 text-red-600        → bg-destructive/10 text-destructive
  ```

### 🧪 Priority 7: 실험적 기능 (Lab)

#### 7.1 3D 관련 페이지들

**📁 src/app/lab/ui-3d/**

- **threejs-advanced/page.tsx** - 중요도: ⭐

  ```tsx
  // 현재 하드코딩
  #ffffff, #000000                  → 동적 색상 처리 로직 개선
  ```

- **threejs-geometries/page.tsx** - 중요도: ⭐
  ```tsx
  // 현재 하드코딩
  style={{ color: `#${currentData.color.toString(16)}` }}
  style={{ backgroundColor: `#${data.color.toString(16)}` }}
  → 동적 색상 처리 로직 개선
  ```

#### 7.2 Tooltip 테스트 페이지

**📁 src/app/lab/ui-effects/tooltip/**

- **page.tsx** - 중요도: ⭐
  ```tsx
  // 현재 많은 하드코딩 색상들
  border-gray-200, bg-gray-50, bg-gray-800, text-gray-300 등
  → 모두 시맨틱 색상으로 변경
  ```

### 🏢 Priority 8: 뉴모피즘 컨테이너 (기존 시스템과 통합)

#### 8.1 neumorphicContainer들

**📁 src/components/ui/neumorphicContainer/**

- **InsetContainer.tsx, RaisedContainer.tsx, CircleContainer.tsx** - 중요도: ⭐⭐⭐
  ```tsx
  // 현재 하드코딩 상수들
  const INSET_LIGHT_SIDE = 'rgba(0, 0, 0, 0.03)';
  const INSET_SHADE_SIDE = 'rgba(0, 0, 0, 0.2)';
  → CSS 변수로 통합 (design-system.css와 일치시키기)
  ```

## 📊 작업 통계

### 파일별 작업량

- **High**: 20+ 색상값 변경 필요 (LicensePlate.tsx)
- **Medium**: 5-10 색상값 변경 필요 (8개 파일)
- **Low**: 1-4 색상값 변경 필요 (나머지 파일들)

### 색상 타입별 통계

- **Hex 색상**: 50+ 개소
- **Tailwind 하드코딩**: 100+ 개소
- **RGBA 값**: 30+ 개소
- **인라인 스타일**: 5+ 개소

## 🎯 완료 기준

### 각 파일별 완료 체크리스트

- [ ] 모든 hex 색상값 제거
- [ ] 모든 하드코딩 Tailwind 색상 클래스 제거
- [ ] 모든 rgba 값을 CSS 변수로 변경
- [ ] 라이트/다크 모드 테스트 완료
- [ ] 뉴모피즘 디자인 시스템 준수 확인

### 전체 프로젝트 완료 조건

- [ ] 모든 우선순위 1-3 항목 완료
- [ ] 색상 변수 시스템 일관성 검증
- [ ] 다크모드 지원 테스트 완료
- [ ] 접근성 색상 대비 검증 완료

## 🚀 다음 단계

1. Priority 1 항목부터 순차 작업 시작
2. 각 컴포넌트별 개별 작업 후 테스트
3. 전체 시스템 통합 테스트
4. 문서화 업데이트
