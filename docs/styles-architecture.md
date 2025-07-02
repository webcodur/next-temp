# 🎨 프로젝트 스타일 아키텍처 개요

> 이 문서는 디자이너 ‧ PM ‧ 비개발자도 쉽게 이해할 수 있도록 **코드가 아닌 개념** 중심으로 스타일 시스템을 해설한다. 개발자가 아닌 분들도 UI 스펙을 의사결정 할 때 참고용으로 사용하면 된다.

---

## 1. 디자인 철학

* **Tesla Black/White** & **뉴모피즘** ― 완전한 무채색 그레이스케일 위에 부드러운 깊이감을 더한다.
* **단일 소스** ― `src/styles/design-system.css` 하나에 모든 디자인 토큰·유틸리티 클래스를 집중시켜 운영한다.
* **Tailwind 4.0** ― 프레임워크의 장점(유틸리티 클래스)을 활용하되, _테마와 토큰_ 은 **CSS 변수**로 관리해 유지보수성을 확보한다.


## 2. 파일 구조

| 경로 | 역할 |
|------|------|
| `src/styles/design-system.css` | **스타일 시스템 진입점**. 분리된 CSS 모듈들을 `@import` |
| `src/styles/system/*.css` | **실제 스타일 정의**. `01-fonts`, `02-variables` 등 기능별로 분리된 파일들 |
| `src/styles/globals.css` | Next.js `app/` 전역 import. Tailwind 초기화·리셋 수준의 최소 선언만 포함 |
| `tailwind.config.js` | Tailwind 커스터마이징. system/02-variables.css 의 **변수를 Tailwind 토큰**으로 노출 |
| `/public/fonts` | 서브셋 폰트 파일 위치. Pretendard(한), Cairo(아랍), DMSerif(영) |

> ✅ **원칙**: 새로운 전역 스타일은 `src/styles/system` 내의 **관련 파일**에 추가한다. 모듈별 개별 CSS 파일은 지양한다.


## 3. 폰트 시스템

| 이름 | 용도 | 특징 |
|------|------|------|
| **MultiLang** | 프로젝트 기본 폰트 | Pretendard(한), Cairo(아랍), DMSerif(영)을 **단일 `font-family`** 로 묶어 문자별 자동 분기 |
| **Pretendard** | 한국어 전용 예외 | MultiLang 실패 시 Fallback |
| **Inter** | 영어 UI 특수 영역 | 영문 전용 타이포를 원할 때만 사용 |

### 사용 방법

```html
<p class="font-multilang">한국어 English العربية</p>
<!-- 문자에 맞는 폰트가 자동 적용 -->
```

> ⚠️ _폰트를 직접 지정하는 상황은 특별 케이스로 한정한다._ 대부분 **`font-multilang`** 클래스 하나로 해결된다.


## 4. 색상 시스템 (무채색 그레이스케일)

컬러는 전부 **HSL 기반 CSS 변수**로 선언된다.

| 변수 | 의미 | 예시 |
|-------|------|------|
| `--background` | 화면 배경 | `hsl(var(--background))` → 기본 #FFFFFF |
| `--foreground` | 본문 텍스트 | 3.9% 라이트니스의 진한 블랙 |
| `--primary` | UI 강조색 | 9% 라이트니스, 버튼·아이콘 활성화 색 |
| `--neu-light / --neu-dark` | 뉴모피즘 음영 | RGBA 형태, 그림자 색으로 사용 |

### 규칙 요약

1. **반드시 함수 사용**: `hsl(var(--primary) / 0.8)` 처럼 `hsl()` 로 감싼다.
2. **직접 HEX 금지**: `#333` 같은 하드코딩은 스타일 가이드 위반.
3. **밝기(라이트니스)로 계층**을 표현한다. 색상(Hue)와 채도(Saturation)는 0.


## 5. 뉴모피즘 컴포넌트 클래스

| 클래스 | 설명 | 대표 사용처 |
|---------|------|-------------|
| **`neu-flat`** | 평면. 기본 컨테이너·패널 | 카드, 모달 배경 |
| **`neu-raised`** | 양각. 터치 가능한 요소 | 버튼, 토글 스위치 Off |
| **`neu-inset`** | 음각. 활성/선택 상태 | 선택된 버튼, 입력창 Focus |
| **`neu-icon-active / inactive`** | 아이콘 강조/비활성 | SVG 아이콘 색상 제어 |
| 보조 **`neu-hover`** | Hover 시 음각으로 전환 | List 아이템, 링크 |
| 보조 **`neu-flat-focus`** | 드롭다운 열린 상태 유지 | Select 컴포넌트 |
| **`sidebar-container`** | Hover 효과 없는 컨테이너 | 사이드바 전용 |

> **조합 금지**: 예) `neu-flat neu-raised` 같이 두 클래스를 동시에 사용하지 않는다.


## 6. 애니메이션 & 트랜지션

| 이름 | 효과 | 사용 예 |
|------|------|---------|
| **`animate-fadeIn`** | 페이드 + 슬라이드 업 (0.25s) | 페이지 첫 등장 |
| **`animate-slide-down` / `up`** | 상세 컨텐츠 펼치기/접기 | Accordion, Collapsible |

* 모든 트랜지션은 기본적으로 `all 0.15s ease-in-out`
* **GPU 가속** 우선: `transform`, `opacity` 속성만 변경해 Repaint 비용 최소화


## 7. 레이아웃 & RTL 지원

* `.text-rtl` / `.text-ltr` 클래스― 텍스트 방향을 수동 제어.
* 스크롤바는 `.scrollbar-hide` 클래스로 비노출 처리 (모바일 터치 UX용).


## 8. Tailwind 연동 방식

1. `design-system.css` 상단에서 `@import 'tailwindcss';` 실행 → Tailwind 유틸리티 클래스 사용 가능.
2. **전역 변수 ↔ Tailwind 토큰** 매핑: 예) `bg-[hsl(var(--background))]`.
3. Tailwind 4.0 새 문법(색상 슬래시 기법)을 적극 사용.


## 9. 디자이너 핸드오프 Tips

* **Figma 색상 → CSS 변수**: HSL 값만 맞추면 그대로 적용 가능.
* **버튼 상태**(Flat/Raised/Inset) = _Elevation_ 개념으로 이해.
* **폰트 계층**: Weight(굵기)로 구분, 크기·색상 변화 최소.


## 10. 빠른 체크리스트

- [ ] HEX, RGB 직접 입력하지 않았다.
- [ ] 뉴모피즘 클래스 중복 사용하지 않았다.
- [ ] Hover 애니메이션은 즉각적이다 (0s Delay).
- [ ] 새로운 스타일은 `src/styles/system` 내의 올바른 파일에 추가했다.

---

### 📄 참고 링크

* **디자인 시스템 통합 스타일 가이드**: [`src/styles/design-system.css`](../src/styles/design-system.css) (CSS 모듈들을 import하는 진입점)
* **뉴모피즘 패턴 예시 샘플**: [`README.md`](ui-components.md) (컴포넌트 문서 모음)

<div align="center"><sub>문서 버전 1.0 | 마지막 수정 : 2025-07-02</sub></div> 