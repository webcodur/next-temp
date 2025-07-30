# 주차 관리 시스템 페이지 구현 계획

## 개요 및 목표

### 프로젝트 목표
- 주차 관리 시스템의 호실 관리, 입주세대 관리, 입주민 관리 모듈 완전 구현
- 공간-조직-개인을 연결하는 통합 뷰 제공
- 흑백 신문지 스타일의 전문적이고 정밀한 UI 구현

### 구현 범위
1. **호실 관리**: 물리적 공간 단위 관리
2. **입주세대 관리**: 호실에 배정된 세대 인스턴스 관리  
3. **입주민 관리**: 세대 구성원인 개인 관리
4. **통합 뷰**: 시스템 전체 구조 시각화

### 기술 스택
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + 커스텀 뉴모피즘 스타일
- 기존 UI 컴포넌트 활용 (`src/components/ui/**`)

### 설계 원칙
- 중첩 박스 레이아웃으로 계층 구조 명확화
- 테이블 기반 목록 페이지와 카드 기반 상세 페이지
- 일관된 검색/필터링 인터페이스
- 직관적인 네비게이션 경로

## 📁 파일 구조

### 1. 라우팅 구조 (src/app/)

```
src/app/parking/household-management/
├── overview/page.tsx                     # 통합 뷰 (플로우차트)
├── household/                            # 호실 관리
│   ├── page.tsx                         # 호실 목록
│   ├── [id]/page.tsx                    # 호실 상세
│   ├── [id]/edit/page.tsx               # 호실 수정
│   └── create/page.tsx                  # 호실 등록
├── household-instance/                   # 입주세대 관리
│   ├── page.tsx                         # 입주세대 목록
│   ├── [id]/page.tsx                    # 입주세대 상세
│   ├── [id]/edit/page.tsx               # 입주세대 수정
│   ├── create/page.tsx                  # 입주세대 등록
│   └── move/page.tsx                    # 입주세대 이동
└── resident/                             # 입주민 관리
    ├── page.tsx                         # 입주민 목록
    ├── [id]/page.tsx                    # 입주민 상세
    ├── [id]/edit/page.tsx               # 입주민 수정
    ├── create/page.tsx                  # 입주민 등록
    ├── move/page.tsx                    # 입주민 이동
    └── history/page.tsx                 # 이동 이력
```

### 2. 뷰 컴포넌트 구조 (src/components/view/)

```
src/components/view/parking/household-management/
├── overview/                             # 통합 뷰 컴포넌트
│   ├── SystemOverview.tsx               # 메인 통합 뷰
│   ├── FlowChart.tsx                    # 수직 플로우차트
│   └── DetailPanel.tsx                  # 우측 상세 패널
├── household/                            # 호실 관리 컴포넌트
│   ├── HouseholdList.tsx                # 호실 목록
│   ├── HouseholdDetail.tsx              # 호실 상세
│   └── HouseholdForm.tsx                # 호실 등록/수정 폼
├── household-instance/                   # 입주세대 관리 컴포넌트
│   ├── HouseholdInstanceList.tsx        # 입주세대 목록
│   ├── HouseholdInstanceDetail.tsx      # 입주세대 상세
│   ├── HouseholdInstanceForm.tsx        # 입주세대 등록/수정 폼
│   ├── HouseholdInstanceMove.tsx        # 입주세대 이동
│   └── ConfigPanel.tsx                  # 방문/서비스 설정
└── resident/                             # 입주민 관리 컴포넌트
    ├── ResidentList.tsx                 # 입주민 목록
    ├── ResidentDetail.tsx               # 입주민 상세
    ├── ResidentForm.tsx                 # 입주민 등록/수정 폼
    ├── ResidentMove.tsx                 # 입주민 이동
    └── ResidentHistory.tsx              # 이동 이력
```

## 🎨 활용할 기존 UI 컴포넌트

### 레이아웃 (`ui-layout`)
- **SectionPanel**: 페이지 헤더와 콘텐츠 영역 구성
- **Modal**: 등록/수정 폼 다이얼로그
- **Dialog**: 삭제 확인 다이얼로그
- **Tabs**: 입주세대 상세의 정보/설정 탭

### 데이터 표시 (`ui-data`)  
- **Table Components**: 목록 페이지 메인 테이블 (검색/필터/페이징 통합)
- **Timeline**: 입주민 이동 이력 시각화

### 입력 (`ui-input`)
- **Advanced Search**: 검색/필터 패널
- **Field**: 모든 폼 입력 필드
- **Datepicker**: 입주/퇴거 날짜 선택

### 효과 및 장식 (`ui-effects`)
- **Card**: 입주세대/입주민 카드 표시
- **Badge**: 상태 표시 (거주중, 퇴거, 이사 등)
- **Avatar**: 입주민 프로필 이미지
- **Toast**: 작업 성공/실패 알림

## 📋 menuData.ts 추가 구조

```typescript
// src/data/menuData.ts 에 추가
주차: {
  // ... 기존 내용
  midItems: {
    // ... 기존 midItems
    세대관리: {
      key: '세대관리',
      botItems: [
        {
          key: '통합뷰',
          href: '/parking/household-management/overview',
        },
        {
          key: '호실관리',
          href: '/parking/household-management/household',
        },
        {
          key: '입주세대관리',
          href: '/parking/household-management/household-instance',
        },
        {
          key: '입주민관리',
          href: '/parking/household-management/resident',
        },
      ],
    },
    // ... 기존 다른 midItems
  }
}
```

## 구현 일정

### Phase 1: 기반 구조 및 라우팅
- 페이지 라우팅 구조 생성
- 메뉴 데이터 업데이트
- 기본 레이아웃 컴포넌트

### Phase 2: 통합 뷰 구현
- 통합 뷰 페이지 (플로우차트)
- 우측 패널 구조
- 마우스오버 상호작용

### Phase 3: 호실 관리 모듈 
- 호실 목록 페이지 (Table Components 활용)
- 호실 상세 페이지 (SectionPanel + Card 활용)
- 호실 등록/수정 (Modal + Field 활용)

### Phase 4: 입주세대 관리 모듈 
- 입주세대 목록 페이지
- 입주세대 상세 페이지 (Tabs로 정보/설정 구분)
- 입주세대 등록/수정/이동

### Phase 5: 입주민 관리 모듈 
- 입주민 목록 페이지
- 입주민 상세 페이지
- 입주민 등록/수정/이동
- 이동 이력 페이지 (Timeline 활용)

---

## 📋 할 일 목록

### ✅ 기반 구조 및 라우팅
- [ ] 페이지 라우팅 구조 생성 (`/parking/household-management/**`)
- [ ] menuData.ts 업데이트 (세대관리 섹션 추가)
- [ ] 기본 레이아웃 적용

### 🎯 통합 뷰 구현
- [ ] 통합 뷰 페이지 (`/overview`) - 수직 플로우차트
- [ ] 우측 패널 구조 구현 (마우스오버 시 상세 정보)
- [ ] 페이지 간 네비게이션 연결

### 🏠 호실 관리 모듈
- [ ] 호실 목록 페이지 (`/household`) - Table Components 활용
- [ ] 호실 상세 페이지 - SectionPanel + 입주세대 Card 목록
- [ ] 호실 등록 페이지 - Modal + Field 활용
- [ ] 호실 수정 페이지
- [ ] API 연동 (households 관련)

### 🏘️ 입주세대 관리 모듈  
- [ ] 입주세대 목록 페이지 (`/household-instance`) - Table Components 활용
- [ ] 입주세대 상세 페이지 - Tabs(정보/설정) + 입주민 Card 목록
- [ ] 입주세대 등록 페이지 - Modal + Field + Datepicker
- [ ] 입주세대 수정 페이지
- [ ] 입주세대 이동 페이지
- [ ] 방문/서비스 설정 관리
- [ ] API 연동 (household_instances 관련)

### 👥 입주민 관리 모듈
- [ ] 입주민 목록 페이지 (`/resident`) - Table Components 활용
- [ ] 입주민 상세 페이지 - SectionPanel + Avatar + Badge
- [ ] 입주민 등록 페이지 - Modal + Field 활용
- [ ] 입주민 수정 페이지
- [ ] 입주민 이동 페이지
- [ ] 이동 이력 페이지 - Timeline 활용
- [ ] API 연동 (residents 관련)

### 🎨 UI/UX 개선
- [ ] 흑백 신문지 스타일 적용
- [ ] 중첩 박스 레이아웃 구현
- [ ] 반응형 디자인 적용
- [ ] Toast 알림 시스템 통합
- [ ] 성능 최적화

### 🧪 테스트 및 검증
- [ ] 기능 테스트 (CRUD 작업)
- [ ] API 연동 테스트  
- [ ] 사용자 시나리오 테스트
- [ ] 브라우저 호환성 테스트
- [ ] 최종 점검 및 문서화

## 🎯 용어 통일 가이드

| 개발 용어 | 사용자 노출 용어 | 파일/컴포넌트명 |
|-----------|----------------|----------------|
| household | 호실 | Household* |
| household_instance | 입주세대 | HouseholdInstance* |
| resident | 입주민 | Resident* |

**다음 세션에서 이 계획을 바탕으로 단계별 구현을 진행합니다.** 