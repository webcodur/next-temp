# 🎨 뉴모피즘 시스템 종합 가이드

## 📋 목차
1. [시스템 개요](#시스템-개요)
2. [핵심 클래스 3종 세트](#핵심-클래스-3종-세트)
3. [브랜드 칼라 버전](#브랜드-칼라-버전)
4. [RTL 대응](#rtl-대응)
5. [실전 사용법](#실전-사용법)
6. [트러블슈팅](#트러블슈팅)

---

## 🎯 시스템 개요

### 파일 구조
```
src/styles/system/04-neumorphism.css (943줄)
├── 기본 클래스들 (1-436줄)
├── RTL 대응 (437-785줄)  
├── 브랜드 버전 (786-908줄)
└── 정리/주석 (909-943줄)
```

### 핵심 원칙
- **Tesla 스타일**: 부드럽고 미니멀한 그림자 효과
- **라이트/다크 테마 자동 대응**: CSS 변수 기반
- **RTL 완전 지원**: 아랍어 등 우→좌 언어 대응
- **브랜드 칼라 연동**: 실시간 브랜드 칼라 변경 반영

---

## 🛠 핵심 클래스 3종 세트

### 1. `neu-flat` - 평면 효과
**용도**: 컨테이너, 패널, 입력 필드
```tsx
<div className="neu-flat p-4 rounded-lg">
  기본 컨테이너
</div>
```

**특징**:
- 은은한 border + 입체적 그림자
- hover 시 border 진해짐
- focus 시 inset 효과

### 2. `neu-raised` - 양각 효과  
**용도**: 버튼, 클릭 가능한 요소
```tsx
<button className="neu-raised px-4 py-2">
  버튼
</button>
```

**특징**:
- 올라가 있는 느낌
- hover 시 미세한 리프트 (translateY(-1px))
- active 시 눌리는 효과 (inset + translateY(1px))

### 3. `neu-elevated` - 고정 양각
**용도**: 카드, 고정 패널
```tsx
<div className="neu-elevated p-6 rounded-lg">
  카드 컨테이너
</div>
```

**특징**:
- 항상 올라가 있음
- 클릭해도 안 들어감
- focus 시에도 양각 상태 유지

---

## 🎨 브랜드 칼라 버전

### `neu-flat-brand` - 브랜드 평면
```tsx
<div className="neu-flat-brand p-4">
  브랜드 칼라 강조 컨테이너
</div>
```

**효과**:
- 브랜드 칼라 border
- 브랜드 칼라 내부/외부 글로우
- hover/focus 시 브랜드 칼라 강화

### `neu-raised-brand` - 브랜드 양각
```tsx
<button className="neu-raised-brand px-4 py-2">
  브랜드 버튼
</button>
```

**효과**:
- 브랜드 칼라 확산 그림자
- 브랜드 칼라와 조화로운 그라데이션

---

## 🌍 RTL 대응

### 자동 대응 원리
```css
/* LTR: 좌상단(-1,-1) 하이라이트 + 우하단(1,1) 그림자 */
[dir='rtl'] .neu-flat {
  /* RTL: 우상단(1,-1) 하이라이트 + 좌하단(-1,1) 그림자 */
}
```

### 사용법
```tsx
<div dir={isRTL ? 'rtl' : 'ltr'}>
  <div className="neu-flat">
    {/* 자동으로 방향 조정됨 */}
  </div>
</div>
```

---

## 🚀 실전 사용법

### 기본 조합 패턴
```tsx
// 📦 컨테이너 + 버튼 조합
<div className="neu-flat p-6 rounded-lg">
  <h2>제목</h2>
  <p>내용</p>
  <button className="neu-raised px-4 py-2 mt-4">
    액션
  </button>
</div>

// 🎯 브랜드 강조
<div className="neu-flat-brand p-6 rounded-lg">
  <button className="neu-raised-brand px-6 py-3">
    주요 액션
  </button>
</div>
```

### SmartTable에서의 사용
```tsx
<SmartTable
  data={data}
  columns={columns}
  brandAccent={true}    // 테두리에 브랜드 칼라
  brandHeader={true}    // 헤더에 브랜드 칼라  
  brandHover={true}     // 호버에 브랜드 칼라
/>
```

### 특수 상황별 클래스

| 상황 | 클래스 | 용도 |
|------|--------|------|
| 활성/선택 상태 | `neu-inset` | 들어가 있는 느낌 |
| Border 없는 inset | `neu-inset-shadow` | 그림자만 있는 inset |
| 호버 시만 inset | `neu-hover` | 다른 클래스와 조합 |
| 활성 아이콘 | `neu-icon-active` | 브랜드 칼라 + 그림자 |
| 비활성 아이콘 | `neu-icon-inactive` | 연한 색상, 호버 리프트 |
| 사이드바 고정 | `sidebar-container` | 고정 그림자, 호버 없음 |

---

## 🔧 트러블슈팅

### Q: 브랜드 칼라가 안 보여요
**A**: 테마별 브랜드 스케일 확인
- 라이트모드: `brand-2` (85%) + opacity `0.6` 
- 다크모드: `brand-2` (35%) + opacity `0.6`

### Q: 호버 효과가 느려요
**A**: transition 제거 확인
```tsx
// ❌ transition 있음
className="transition-colors hover:bg-brand-2/[0.6]"

// ✅ transition 없음  
className="hover:bg-brand-2/[0.6]"
```

### Q: RTL에서 그림자가 이상해요
**A**: 자동 대응 확인
```tsx
<div dir={isRTL ? 'rtl' : 'ltr'}>
  {/* 컴포넌트 */}
</div>
```

### Q: 새로운 뉴모피즘 효과가 필요해요
**A**: 기존 클래스 조합 우선 검토
```tsx
// 조합 예시
<div className="neu-flat neu-hover">
  {/* flat 기본 + hover 시 inset */}
</div>
```

---

## 📊 클래스 사용 현황

### 핵심 클래스 (자주 사용)
- ✅ `neu-flat` - 모든 컨테이너
- ✅ `neu-raised` - 모든 버튼  
- ✅ `neu-elevated` - 카드류
- ✅ `neu-flat-brand` - SmartTable 등

### 특수 클래스 (가끔 사용)
- 🔶 `neu-inset` - 활성 상태
- 🔶 `neu-icon-*` - 아이콘 전용
- 🔶 `sidebar-container` - 사이드바 전용

### 레거시 클래스 (사용 안 함)
- ❌ `.table-row-hover-brand` - 제거됨

---

## 💡 베스트 프랙티스

### 1. 간단한 것부터
```tsx
// ✅ 간단하게 시작
<div className="neu-flat">

// ❌ 처음부터 복잡하게
<div className="neu-flat-brand neu-hover">
```

### 2. 브랜드 칼라는 강조할 때만
```tsx
// ✅ 주요 영역만
<div className="neu-flat-brand">주요 영역</div>
<div className="neu-flat">일반 영역</div>

// ❌ 모든 곳에 브랜드
<div className="neu-flat-brand">
  <div className="neu-flat-brand">...</div>
</div>
```

### 3. 테마 변경 고려
```tsx
// ✅ CSS 변수 기반 (자동 대응)
className="neu-flat"

// ❌ 하드코딩된 색상
style={{ boxShadow: '2px 2px 4px gray' }}
```

---

## 🎯 결론

뉴모피즘 시스템은 복잡하지만 **3개 핵심 클래스**만 알면 90% 해결된다:

1. **컨테이너**: `neu-flat`
2. **버튼**: `neu-raised`  
3. **카드**: `neu-elevated`

나머지는 필요할 때 점진적으로 학습하면 된다! 