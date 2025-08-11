# CrudButton

폼 및 테이블에서 사용하는 CRUD 전용 버튼 컴포넌트다.

## 특징

- **일관된 CRUD 액션**: action prop으로 간단하게 버튼 타입 지정
- **아이콘/텍스트 모드**: iconOnly prop으로 표시 방식 선택
- **자동 스타일링**: 액션별로 적절한 variant 자동 적용
- **접근성**: 기본 Button 컴포넌트의 모든 접근성 기능 상속

## 액션 타입

| 액션 | 아이콘 | 텍스트 | Variant | 사용처 |
|------|--------|--------|---------|--------|
| `create` | Plus | 추가 | primary | 목록화면 |
| `edit` | SquarePen | 편집 | secondary | 목록화면 |
| `save` | Save | 저장 | primary | 상세화면 |
| `copy` | Copy | 복사 | outline | 테이블 |
| `delete` | Trash2 | 삭제 | destructive | 전체 |

## 사용법

### 기본 사용법
```tsx
import { CrudButton } from '@/components/ui/ui-input/crud-button';

// 아이콘 + 텍스트 (기본)
<CrudButton action="create" onClick={handleCreate} />
<CrudButton action="save" onClick={handleSave} />

// 아이콘만 (테이블용)
<CrudButton action="copy" iconOnly onClick={handleCopy} />
<CrudButton action="delete" iconOnly onClick={handleDelete} />
```

### 목록화면 예시
```tsx
// 상단 액션 버튼
<div className="flex gap-2">
  <CrudButton action="create" onClick={openCreateModal} />
</div>

// 테이블 내 액션 버튼
<div className="flex gap-1">
  <CrudButton action="edit" iconOnly onClick={() => editItem(id)} />
  <CrudButton action="copy" iconOnly onClick={() => copyItem(id)} />
  <CrudButton action="delete" iconOnly onClick={() => deleteItem(id)} />
</div>
```

### 상세화면 예시
```tsx
// 폼 하단 버튼
<div className="flex justify-end gap-2">
  <CrudButton action="save" onClick={handleSubmit} />
  <CrudButton action="delete" onClick={handleDelete} />
</div>
```

## Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `action` | `CrudAction` | - | CRUD 액션 타입 (필수) |
| `iconOnly` | `boolean` | `false` | 아이콘만 표시 여부 |
| `size` | `ButtonProps['size']` | `'default'` | 버튼 크기 |
| `onClick` | `() => void` | - | 클릭 이벤트 핸들러 |
| `disabled` | `boolean` | `false` | 비활성 상태 |

## 디자인 가이드

### 목록화면
- **상단 액션**: 아이콘 + 텍스트 (추가, 편집)
- **테이블 내**: 아이콘만 (복사, 삭제)

### 상세화면  
- **폼 하단**: 아이콘 + 텍스트 (저장, 삭제)

### 권장사항
- 목록에서는 공간 절약을 위해 `iconOnly` 사용
- 상세화면에서는 명확성을 위해 텍스트 포함
- 위험 액션(삭제)은 확인 대화상자와 함께 사용
