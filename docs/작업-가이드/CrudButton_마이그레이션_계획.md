# CrudButton 마이그레이션 계획서

## 📋 개요

기존 `Button` 컴포넌트를 사용하는 CRUD 관련 버튼들을 전용 `CrudButton` 컴포넌트로 변경하여 일관성과 유지보수성을 향상시킨다.

## 🎯 목표

1. **일관된 CRUD UI**: CRUD 액션별 표준화된 아이콘 + 텍스트 조합
2. **코드 간소화**: 반복적인 `icon` + `children` 조합을 `action` 하나로 대체
3. **유지보수성 향상**: CRUD 버튼 변경 시 CrudButton 컴포넌트만 수정

## 🔍 현황 분석

### Button 컴포넌트 분석
- **위치**: `src/components/ui/ui-input/button/Button.tsx`
- **주요 Props**: `variant`, `size`, `icon`, `children`, `disabled`, `loading` 등
- **사용 파일 수**: 84개 파일에서 import

### CRUD 액션별 현재 구현 패턴

#### 1. 저장 버튼 (Save)
```tsx
// 현재 패턴
<Button
  variant="primary"
  icon={Save}
  disabled={!isValid || disabled}
  title="저장"
>
  저장
</Button>

// 변경 후
<CrudButton action="save" disabled={!isValid || disabled} />
```

#### 2. 삭제 버튼 (Delete)
```tsx
// 현재 패턴 - 폼용 (텍스트)
<Button
  variant="destructive"
  icon={Trash2}
  title="상세 항목을 삭제합니다"
>
  삭제
</Button>

// 현재 패턴 - 테이블용 (아이콘만)
<Button
  variant="destructive"
  size="sm"
  title="연결 삭제"
>
  <Trash2 size={16} />
</Button>

// 변경 후 - 폼용
<CrudButton action="delete" title="상세 항목을 삭제합니다" />

// 변경 후 - 테이블용
<CrudButton action="delete" iconOnly size="sm" title="연결 삭제" />
```

#### 3. 추가 버튼 (Create)
```tsx
// 현재 패턴
<Button
  variant="primary"
  size="sm"
  title="새 거주자 연결"
>
  <Plus size={16} />
  연결 추가
</Button>

// 변경 후
<CrudButton action="create" size="sm" title="새 거주자 연결">
  연결 추가
</CrudButton>
```

#### 4. 편집 버튼 (Edit)
```tsx
// 현재 패턴
<Button
  variant="secondary"
  size="sm"
  title="설정 수정"
>
  <Settings size={16} />
</Button>

// 변경 후  
<CrudButton action="edit" iconOnly size="sm" title="설정 수정" />
```

## 📊 변경 대상 파일 분류

### 🔥 1순위: 폼 관련 파일 (저장/삭제 버튼)
```
src/components/view/_pages/device/DeviceForm.tsx
src/components/view/_pages/instance/InstanceForm.tsx  
src/components/view/_pages/resident/ResidentForm.tsx
src/components/view/_pages/car/CarForm.tsx
src/components/view/_pages/violation/BlacklistForm.tsx
```

**변경 사항**:
- 저장 버튼: `icon={Save}` + `저장` → `action="save"`
- 삭제 버튼: `icon={Trash2}` + `삭제` → `action="delete"`

### 🎯 2순위: 테이블 관리 컬럼 (편집/삭제 아이콘)
```
src/components/view/_pages/car/CarInstanceSection.tsx
src/components/view/_pages/car/CarResidentSection.tsx
src/components/view/_pages/resident/ResidentInstanceSection.tsx
```

**변경 사항**:
- 편집 버튼: `<Settings size={16} />` → `action="edit" iconOnly`
- 삭제 버튼: `<Trash2 size={16} />` → `action="delete" iconOnly`

### 🚀 3순위: 목록 페이지 추가 버튼
```
src/components/view/_pages/car/CarInstanceSection.tsx (연결 추가)
src/components/view/_pages/car/CarResidentSection.tsx (연결 추가)  
src/components/view/_pages/resident/ResidentInstanceSection.tsx (관계 추가)
```

**변경 사항**:
- 추가 버튼: `<Plus size={16} />` + `추가` → `action="create"`

### ⚠️ 4순위: 개별 검토 필요
```
src/components/view/_pages/violation/BlacklistCreatePage.tsx
src/components/view/_pages/resident/ResidentInstanceSection.tsx (이동 실행)
```

**이유**: 특수한 텍스트나 동작이 있어 CrudButton으로 변경하기 전 검토 필요

## 🔧 변경 작업 절차

### 1단계: Import 구문 추가
```tsx
// 기존
import { Button } from '@/components/ui/ui-input/button/Button';

// 추가
import { CrudButton } from '@/components/ui/ui-input/crud-button/CrudButton';
```

### 2단계: Button → CrudButton 변경
- **주의사항**: 모든 CRUD 버튼을 한 번에 변경하지 말고, 파일별로 점진적 변경
- **테스트**: 각 변경 후 해당 기능이 정상 작동하는지 확인

### 3단계: 불필요한 import 정리
- CrudButton으로 모두 변경된 파일은 `Button` import 제거 (다른 용도 Button이 없는 경우)

## 📝 변경 시 고려사항

### Props 매핑
| 기존 Button Props | CrudButton Props | 비고 |
|------------------|------------------|------|
| `variant="primary"` + `icon={Save}` + `저장` | `action="save"` | - |
| `variant="destructive"` + `icon={Trash2}` + `삭제` | `action="delete"` | - |
| `variant="primary"` + `icon={Plus}` + `추가` | `action="create"` | - |
| `variant="secondary"` + `icon={SquarePen}` + `편집` | `action="edit"` | - |
| `icon={Copy}` + `복사` | `action="copy"` | - |
| `size="sm"` | `size="sm"` | 동일 |
| `disabled` | `disabled` | 동일 |
| `onClick` | `onClick` | 동일 |
| `title` | `title` | 동일 |

### 아이콘 전용 버튼
```tsx
// 기존 (테이블용)
<Button size="sm" variant="destructive">
  <Trash2 size={16} />
</Button>

// 변경 후
<CrudButton action="delete" iconOnly size="sm" />
```

### 커스텀 텍스트가 필요한 경우
```tsx
// children으로 커스텀 텍스트 제공 가능
<CrudButton action="create" size="sm">
  연결 추가
</CrudButton>
```

## 🚫 변경하지 않을 버튼들

다음 용도의 Button은 CrudButton으로 변경하지 않음:
- **유틸 버튼**: 초기화, 복구, 리셋 등
- **네비게이션 버튼**: 뒤로가기, 취소, 닫기 등  
- **모달 액션**: 확인, 취소 등
- **일반 기능**: 다시 시도, 새로고침 등

## 📅 작업 일정

1. **1단계** (1순위): 폼 관련 저장/삭제 버튼 변경
2. **2단계** (2순위): 테이블 편집/삭제 아이콘 변경  
3. **3단계** (3순위): 목록 추가 버튼 변경
4. **4단계** (4순위): 개별 검토 후 변경
5. **5단계**: 전체 테스트 및 검증

## ✅ 완료 체크리스트

- [ ] 1순위 파일들 변경 완료
- [ ] 2순위 파일들 변경 완료  
- [ ] 3순위 파일들 변경 완료
- [ ] 4순위 파일들 개별 검토 및 변경
- [ ] 전체 기능 테스트 완료
- [ ] 불필요한 Button import 정리 완료
- [ ] 문서 업데이트 완료

---

**📌 참고 문서**:
- `src/components/ui/ui-input/crud-button/CrudButton.tsx`
- `src/components/ui/ui-input/crud-button/폼 & 테이블용 버튼.txt`
- `src/components/ui/ui-input/crud-button/폼 내 버튼 위치.txt`
