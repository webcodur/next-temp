# 포인트 색상 체계 개편 계획

## 개요

현행 디자인 시스템은 **Tesla B/W** 무채색 그레이스케일만으로 UI 계층을 구분한다. 이 구조는 미니멀하고 일관성 있는 장점이 있지만, 사용자 관점에서 중요한 정보·액션이 눈에 덜 띄고, 브랜드 아이덴티티를 전달하기 어렵다는 한계가 있다.

본 개편은 기존 무채색 기반을 훼손하지 않으면서도, 하나의 **브랜드 포인트 색상(Brand Color)** 을 도입해 다음을 달성하고자 한다:

1. 인터랙티브 요소(버튼, 링크, 활성 상태)의 시각적 강조
2. 브랜드 정체성 전달 및 제품 식별성 강화
3. 사용자·운영자에게 런타임 커스터마이징(색 변경) 기능 제공

## 목표

- **가시성 향상**: 포인트 색으로 중요한 UI 신호 전달 (버튼, 토글, 진행 상태 등)
- **일관성 확보**: Tailwind 토큰과 CSS 변수로 전 컴포넌트에 동일 로직 적용
- **접근성 유지**: WCAG 2.1 AA 명도 대비(4.5:1) 이상 달성
- **유연성 확보**: Jotai + CSS 변수로 사용자가 즉시 색 변경 가능
- **저비용 리팩토링**: 단계적 마이그레이션으로 기존 코드 최대한 보존

## 0. 사용자 요구사항 요약

| # | 요구사항 | 메모 |
|---|-----------|------|
| 1 | 프로젝트 전역에 **포인트 색상(Brand Color)** 체계 도입 | 기존 Tesla B/W 그레이스케일 기반 유지, 무채색과 조화 |
| 2 | 3-단계 프로세스 준수<br/>① 현황 파악 ② 개편 계획 수립(MD) ③ 실제 작업 | 각 단계 완료 시 체크 표시 |
| 3 | **전역 변수**로 색상 관리 → 사용자 입력으로 색 즉시 변경 가능 | CSS 변수 + Tailwind token, Jotai 상태, ColorPicker UI |
| 4 | 테스트: **MainLayout + Header** 에서 색상 변경 실시간 확인 | 컬러 피커 버튼 추가해 검증 |
| 5 | 개편 계획은 **Markdown** 문서로 관리 | 이후 자동 스크립트가 체크박스 읽어 작업 수행 |
| 6 | 체크 표기 규칙 | 완료: `✅` , 불필요/제외: `➖` |
| 7 | 컴포넌트 전수 조사: `@/layout`, `@/ui` 전부 나열 | 변경 여부를 체크리스트에 표시 |

---

## 1. 전략 개요

1. **전역 시스템 확장** – CSS 변수·Tailwind 토큰으로 브랜드 컬러 스케일 정의
2. **런타임 커스터마이징** – Jotai + localStorage로 사용자가 색을 즉시 변경 가능하도록 유지
3. **컴포넌트 리팩토링** – 모든 하드코딩·무채색 강조 부분을 `brand` 토큰으로 치환
4. **문서 & 가이드** – 디자인 철학, 접근성 기준, 적용 예시 문서화

---

## 2. 체크리스트

### 2-1. 전역 시스템

- [✅] `--brand`, `--brand-foreground` CSS 변수 추가 (light/dark)
- [✅] Tailwind `colors.brand` 토큰 등록
- [✅] Jotai 상태(`brandColorAtom`) + 컬러 피커(헤더) 구현
- [ ] 브랜드 **10단계 스케일** 변수 `--brand-1` ~ `--brand-9` 정의
- [ ] Tailwind `brand.{1 ... 9}` 토큰 매핑 (알파·hover 변형 포함)
- [ ] `docs/design-system-variables.md` 에 브랜드 항목 추가
- [ ] 접근성 대비 테스트(AA 기준 4.5:1) 스크립트 작성

### 2-2. 레이아웃(`@/layout`)

- [ ] Header
  - 브레드크럼브 / 프로필 버튼 / 컬러 피커 아이콘 highlight → brand 적용
- [ ] Sidebar (unit·hooks 포함)
  - 활성 메뉴 아이콘·텍스트 brand
  - resize 핸들 hover 색 brand
- [ ] MainLayout
  - focus ring·스크롤바 accent → brand
- [ ] Footer
  - 링크 hover 색 brand
- [ ] LoginForm / Login Layout
  - 주요 버튼 brand variant

### 2-3. UI 컴포넌트(`@/ui`)

#### ui-layout

- [ ] Accordion
- [ ] Collapsible
- [ ] Dialog
- [ ] Modal
- [ ] NeumorphicContainer (Flat / Inset / Circle)
- [ ] NestedTabs
- [ ] Stepper
- [ ] Tabs
- [ ] ThemeToggle (ring·switch 색)

#### ui-input

- [ ] AdvancedSearch
- [ ] Button (variant="brand")
- [ ] Datepicker
- [ ] Editor (toolbar highlight)
- [ ] Field (Select / Text / DatePicker) – focus ring brand
- [ ] LanguageSwitcher
- [ ] SimpleInput (Checkbox / Radio / Toggle) – checked 색 brand

#### ui-effects

- [ ] Avatar (border highlight)
- [ ] Badge
- [ ] Card (shadow / border highlight)
- [ ] Carousel
- [ ] Dnd (SortableList drag handle)
- [ ] FlipText / MorphingText – accent 색 brand
- [ ] Toast – success/default variant에 brand 추가
- [ ] Tooltip – arrow / background brand option

#### ui-display

- [ ] Carousel (duplicate) – 슬라이드 인디케이터 brand
- [ ] DragAndDrop – drop zone highlight brand

#### ui-data

- [ ] InfiniteScroll – 로딩 스피너 brand
- [ ] ListHighlightMarker – highlight 색 brand
- [ ] Pagination – active page color brand
- [ ] SmartTable – header border / selected row
- [ ] Timeline – milestone 색 brand

#### ui-3d

- [➖] Barrier – 3D 모델은 외부 머티리얼 색상으로 유지 (무채색 적합)

#### system-testing

- [➖] LicensePlate 예제 – 테스트 전용, 변경 불필요

### 2-4. 문서 & Storybook

- [ ] 새 문서 **`docs/point-color-system.md`** (본 파일) 유지보수
- [ ] Storybook brand 테마 토글·컬러 픽커 툴 추가
- [ ] `lab/system-testing/theme-test` 예제 갱신 (brand 미리보기)

### 2-5. QA & 배포

- [ ] E2E 테스트: 라이트/다크 + 커스텀 brand 색 적용 시 시각 회귀 테스트
- [ ] Lighthouse 대비·명도 체크 통과
- [ ] PR 리뷰 → main 병합
- [ ] 배포 후 사용자 피드백 수집 & 2주간 모니터링

---

## 3. 변수 설계 (초안)

```css
/* 예시 – 10단계 브랜드 스케일 */
--brand-0: 220 90% 97%; // 100% 밝기 – bg-brand-0
--brand-1: 220 90% 92%;
--brand-2: 220 90% 85%;
--brand-3: 220 90% 75%;
--brand-4: 220 90% 65%;
--brand-5: 220 90% 55%; // DEFAULT
--brand-6: 220 90% 45%;
--brand-7: 220 90% 35%;
--brand-8: 220 90% 25%;
--brand-9: 220 90% 15%; // 가장 어두움 – text-brand-9
```

---

## 4. 타임라인(제안)

| 주차 | 작업 | 비고 |
|------|-------|------|
| 1주차 | 전역 시스템 + 변수 스케일 구현 | ✅ 스케일 확정 후 컴포넌트 착수 |
| 2주차 | 레이아웃 리팩토링 | Header / Sidebar / Footer |
| 3주차 | UI 컴포넌트 1차 (Button·Badge·Input) | 우선순위 높은 것부터 |
| 4주차 | UI 컴포넌트 2차 (Chart·Stepper 등) | |
| 5주차 | Storybook·문서·테스트 마감 | 접근성 & 회귀 테스트 |
| 6주차 | QA·배포·피드백 라운드 | |

---

## 5. 참고 기준

- Material Design Color System
- Tailwind Color Palette 가이드 (500 = 기본값 기준)
- WCAG 2.1 Contrast Ratio 4.5:1 (AA)
