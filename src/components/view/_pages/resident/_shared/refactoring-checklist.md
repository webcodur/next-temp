# 탭 구조 리팩토링 표준 작업 목록

## Phase 1: 현황 조사 🔍

### 1.1 파일 사용 현황 분석

- [ ] 디렉토리 내 모든 파일 목록 확인
- [ ] 각 파일의 실제 import/사용 현황 조사
- [ ] 라우트 연결 상태 확인
- [ ] 사용되지 않는 파일 식별

```bash
# 사용 명령어 예시
codebase_search "파일명이나 컴포넌트가 실제로 어디서 import되고 사용되는지"
grep_search "import.*파일명"
```

### 1.2 탭 구조 중복 현황 파악

- [ ] `const tabs = [` 패턴으로 중복 탭 구성 검색
- [ ] 각 페이지별 탭 구성 비교 분석
- [ ] 공통 탭 구조 식별

```bash
grep "const tabs = \[" -A 10
```

---

## Phase 2: 정리 작업 🧹

### 2.1 불필요한 파일 제거

- [ ] 사용되지 않는 컴포넌트 파일 삭제
- [ ] 중복된 파일들 제거
- [ ] 빈 폴더 정리

### 2.2 디렉토리 구조 설계

- [ ] 페이지별 독립적 그룹 구성 계획
- [ ] 공통 리소스(\_shared) 폴더 설계
- [ ] 네이밍 규칙 정의

---

## Phase 3: 구조 개편 🏗️

### 3.1 공통 리소스 분리

- [ ] `_shared/` 폴더 생성
- [ ] 탭 구성 함수 추출 (`createXXXTabs.ts`)
- [ ] 공통 타입 정의 (`xxxTypes.ts`)
- [ ] 평탄한 구조로 설계 (중첩 최소화)

### 3.2 페이지별 그룹핑

- [ ] 기능별 디렉토리 생성 (detail, movement, connection 등)
- [ ] 페이지 파일과 관련 컴포넌트들을 함께 배치
- [ ] 직관적 네이밍으로 역할 구분

```
target/
├── _shared/
│   ├── targetTabs.ts      # 탭 구성 중앙 관리
│   └── targetTypes.ts     # 공통 타입
├── detail/
│   ├── TargetDetailPage.tsx
│   └── TargetBasic.tsx
├── other-feature/
│   ├── OtherFeaturePage.tsx
│   └── OtherComponent.tsx
└── TargetListPage.tsx
```

---

## Phase 4: 코드 통합 🔗

### 4.1 탭 구성 통합

- [ ] 중복된 `const tabs = [...]` 제거
- [ ] `createXXXTabs()` 함수로 대체
- [ ] 모든 관련 페이지에서 통합 함수 사용

```typescript
// Before: 각 페이지마다 중복
const tabs = [
	{ id: 'basic', label: '기본 정보', href: '/path/basic' },
	{ id: 'detail', label: '상세 정보', href: '/path/detail' },
];

// After: 중앙 관리
import { createTargetTabs } from '../_shared/targetTabs';
const tabs = createTargetTabs(targetId);
```

### 4.2 Import 경로 정리

- [ ] 새로운 구조에 맞는 import 경로 수정
- [ ] 상대 경로 최적화
- [ ] App 라우트 파일들의 경로 업데이트

---

## Phase 5: 마무리 🎯

### 5.1 구조 평탄화

- [ ] 불필요한 중첩 폴더 제거 (예: section/ 폴더)
- [ ] 파일명으로 역할 구분이 가능한지 확인
- [ ] Import 경로 재조정

### 5.2 캐시 초기화 ⚠️ **필수!**

- [ ] Next.js 빌드 캐시 초기화
- [ ] 개발 서버 재시작

```bash
rm -rf .next        # 캐시 삭제
npm run build       # 재빌드
# 또는 npm run dev  # 개발 서버 재시작
```

### 5.3 품질 검증

- [ ] Linting 오류 확인 및 수정
- [ ] 모든 라우트 동작 확인
- [ ] Import 관계 검증

```bash
read_lints # 전체 lint 오류 확인
```

---

## 🎯 기대 효과

### Before → After

- ❌ 탭 구성 중복 (3개+ 페이지에서 동일한 코드)
- ✅ 중앙 관리 (한 곳에서 수정하면 전체 반영)

- ❌ 파일들이 평면적으로 나열
- ✅ 페이지별 논리적 그룹핑

- ❌ 복잡한 중첩 구조
- ✅ 직관적이고 평탄한 구조

- ❌ 사용되지 않는 파일들 혼재
- ✅ 깔끔하게 정리된 구조

---

## 🛠️ 자주 사용하는 도구 명령어

```bash
# 파일 사용 현황 조사
codebase_search "컴포넌트명이 실제로 어디서 사용되는지"
grep "import.*컴포넌트명"

# 탭 중복 확인
grep "const tabs = \[" -A 10

# 구조 확인
list_dir target_directory
find . -name "*.tsx" -type f

# 파일 이동
mv old/path/file.tsx new/path/
rmdir empty_folder

# Import 경로 수정
search_replace old_import_path new_import_path

# 오류 확인
read_lints [path]
```

---

## 📝 적용 시 주의사항

1. **백업 필수**: 대규모 리팩토링 전 브랜치 생성
2. **점진적 적용**: Phase별로 단계적 진행
3. **테스트 중요**: 각 단계마다 동작 확인
4. **네이밍 일관성**: 프로젝트 전체 네이밍 규칙 준수
5. **Import 주의**: 경로 변경 시 모든 참조 확인
