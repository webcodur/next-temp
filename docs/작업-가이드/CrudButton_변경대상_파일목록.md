# CrudButton 변경 대상 파일 목록

## 🔥 1순위: 폼 관련 파일 (저장/삭제 버튼)

### DeviceForm.tsx
- **파일**: `src/components/view/_pages/device/DeviceForm.tsx`
- **변경 대상**:
  - 라인 160: 저장 버튼 (`icon={Save}` + `저장`)
  - 라인 173: 삭제 버튼 (`icon={Trash2}` + `삭제`)  
  - 라인 184: 저장 버튼 (`icon={Save}` + `저장`)

### InstanceForm.tsx  
- **파일**: `src/components/view/_pages/instance/InstanceForm.tsx`
- **변경 대상**:
  - 라인 123: 저장 버튼 (`icon={Save}` + `저장`)
  - 라인 138: 삭제 버튼 (`icon={Trash2}` + `삭제`)
  - 라인 149: 저장 버튼 (`icon={Save}` + `저장`)

### ResidentForm.tsx
- **파일**: `src/components/view/_pages/resident/ResidentForm.tsx`  
- **변경 대상**:
  - 라인 118: 저장 버튼 (`icon={Save}` + `저장`)
  - 라인 133: 삭제 버튼 (`icon={Trash2}` + `삭제`)
  - 라인 144: 저장 버튼 (`icon={Save}` + `저장`)

### CarForm.tsx
- **파일**: `src/components/view/_pages/car/CarForm.tsx`
- **변경 대상**:
  - 라인 143: 저장 버튼 (`icon={Save}` + `저장`)
  - 라인 158: 삭제 버튼 (`icon={Trash2}` + `삭제`)
  - 라인 169: 저장 버튼 (`icon={Save}` + `저장`)

### BlacklistCreatePage.tsx
- **파일**: `src/components/view/_pages/violation/BlacklistCreatePage.tsx`
- **변경 대상**:
  - 라인 178: 저장 버튼 (`icon={Save}` + `등록`) 
  - **주의**: 텍스트가 "등록"이므로 children 사용 필요

## 🎯 2순위: 테이블 관리 컬럼 (편집/삭제 아이콘)

### CarInstanceSection.tsx
- **파일**: `src/components/view/_pages/car/CarInstanceSection.tsx`
- **변경 대상**:
  - 라인 244-254: 편집 버튼 (`<Settings size={16} />`)
  - 라인 255-267: 삭제 버튼 (`<Trash2 size={16} />`)

### CarResidentSection.tsx  
- **파일**: `src/components/view/_pages/car/CarResidentSection.tsx`
- **변경 대상**:
  - 라인 276-285: 편집 버튼 (`<Settings size={16} />`)
  - 라인 287-297: 삭제 버튼 (`<Trash2 size={16} />`)

### ResidentInstanceSection.tsx (테이블 부분)
- **파일**: `src/components/view/_pages/resident/ResidentInstanceSection.tsx`
- **변경 대상**: 테이블 컬럼의 편집/삭제 버튼들
- **주의**: 이 파일은 복잡하므로 상세 분석 후 변경

## 🚀 3순위: 목록 페이지 추가 버튼

### CarInstanceSection.tsx (추가 버튼)
- **파일**: `src/components/view/_pages/car/CarInstanceSection.tsx`
- **변경 대상**:
  - 라인 281-289: 추가 버튼 (`<Plus size={16} />` + `연결 추가`)

### CarResidentSection.tsx (추가 버튼)
- **파일**: `src/components/view/_pages/car/CarResidentSection.tsx`  
- **변경 대상**:
  - 라인 311-319: 추가 버튼 (`<Plus size={16} />` + `연결 추가`)
  - 라인 334-341: 추가 버튼 (`<Plus size={16} />` + `거주자 연결 추가`)

### ResidentInstanceSection.tsx (추가 버튼)
- **파일**: `src/components/view/_pages/resident/ResidentInstanceSection.tsx`
- **변경 대상**:
  - 라인 435-443: 추가 버튼 (`<Plus size={16} />` + `관계 추가`)

## ⚠️ 4순위: 개별 검토 필요

### ResidentInstanceSection.tsx (이동 버튼)
- **파일**: `src/components/view/_pages/resident/ResidentInstanceSection.tsx`
- **변경 대상**: 
  - 라인 366: 이동 실행 버튼 (`icon={Save}` + `이동 실행`)
- **검토 이유**: "이동 실행"은 저장과 다른 의미이므로 CrudButton으로 변경 적절성 검토 필요

## 🚫 변경하지 않을 Button들

### 유틸 버튼들
```tsx
// 초기화 버튼 (DeviceForm.tsx 라인 126-135)
<Button variant="outline" icon={Eraser}>초기화</Button>

// 복구 버튼 (DeviceForm.tsx 라인 137-146)  
<Button variant="secondary" icon={RotateCcw}>복구</Button>
```

### 기타 기능 버튼들
- 다시 시도 버튼
- 모달 확인/취소 버튼
- 네비게이션 버튼

## 📋 변경 작업 체크리스트

### 1순위 완료 체크
- [ ] DeviceForm.tsx 저장/삭제 버튼 변경
- [ ] InstanceForm.tsx 저장/삭제 버튼 변경  
- [ ] ResidentForm.tsx 저장/삭제 버튼 변경
- [ ] CarForm.tsx 저장/삭제 버튼 변경
- [ ] BlacklistCreatePage.tsx 저장 버튼 변경

### 2순위 완료 체크  
- [ ] CarInstanceSection.tsx 테이블 편집/삭제 버튼 변경
- [ ] CarResidentSection.tsx 테이블 편집/삭제 버튼 변경
- [ ] ResidentInstanceSection.tsx 테이블 편집/삭제 버튼 변경

### 3순위 완료 체크
- [ ] CarInstanceSection.tsx 추가 버튼 변경  
- [ ] CarResidentSection.tsx 추가 버튼 변경
- [ ] ResidentInstanceSection.tsx 추가 버튼 변경

### 4순위 완료 체크
- [ ] ResidentInstanceSection.tsx 이동 버튼 검토 및 변경

## 📝 변경 패턴 참고

### 폼 저장 버튼
```tsx
// 변경 전
<Button
  variant="primary"
  size="default"  
  onClick={onSubmit}
  disabled={!isValid || disabled}
  title={disabled ? '저장 중...' : !isValid ? '필수 항목을 입력해주세요' : '저장'}
  icon={Save}
>
  저장
</Button>

// 변경 후
<CrudButton
  action="save"
  size="default"
  onClick={onSubmit}  
  disabled={!isValid || disabled}
  title={disabled ? '저장 중...' : !isValid ? '필수 항목을 입력해주세요' : '저장'}
/>
```

### 테이블 삭제 버튼 (아이콘만)
```tsx
// 변경 전
<Button
  variant="destructive"
  size="sm"
  onClick={handleDelete}
  title="연결 삭제"
>
  <Trash2 size={16} />
</Button>

// 변경 후  
<CrudButton
  action="delete"
  iconOnly
  size="sm"
  onClick={handleDelete}
  title="연결 삭제"
/>
```

### 목록 추가 버튼
```tsx
// 변경 전
<Button
  variant="primary"
  size="sm"
  onClick={() => setCreateModalOpen(true)}
  title="새 거주자 연결"
>
  <Plus size={16} />
  연결 추가
</Button>

// 변경 후
<CrudButton
  action="create"
  size="sm"
  onClick={() => setCreateModalOpen(true)}
  title="새 거주자 연결"
>
  연결 추가
</CrudButton>
```
