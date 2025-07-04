# Tesla B/W Design System – CSS 변수 레퍼런스

> 본 문서는 `src/styles/styles/system/02-variables.css` 에 정의된 **전역 CSS 변수**의 의미와 사용 지침을 상세하게 설명한다. 라이트 모드를 기준으로 설명하며, 다크 모드는 동일 변수명을 재정의(overwrite)하여 동작한다.

---

## 1. 기본 배경 · 텍스트 계열

| 변수 | 라이트 값 | 다크 값 | 역할 | 주 사용 위치 |
|------|-----------|---------|------|--------------|
| `--background` | `0 0% 100%` | `0 0% 8%` | 문서 전체 배경색 | `body`, `html` |
| `--foreground` | `0 0% 5%` | `0 0% 95%` | 기본 텍스트·아이콘 | 모든 텍스트 요소 |
| `--card` | `0 0% 98%` | `0 0% 12%` | 카드·패널 배경 | `.neu-flat`, `.card` |
| `--card-foreground` | `0 0% 10%` | `0 0% 90%` | 카드 내부 텍스트 | 카드 제목·내용 |
| `--muted` | `0 0% 94%` | `0 0% 18%` | 비활성·보조 배경 | placeholder, disabled |
| `--muted-foreground` | `0 0% 40%` | `0 0% 65%` | 비활성 텍스트 | placeholder text |
| `--border` | `0 0% 88%` | `0 0% 25%` | 테두리·구분선 | `border-color`, `hr` |

### 사용 팁

- 배경색을 지정할 때는 **항상** `hsl(var(--변수명))` 형태를 사용한다. 투명도 필요 시 `/ alpha` 슬래시 표기.
- 예) `background: hsl(var(--muted) / 0.7);`

---

## 2. 강조 색 · 브랜드 계열

| 변수 | 라이트 값 | 다크 값 | 의미 | 비고 |
|------|-----------|---------|------|------|
| `--brand` | `220 90% 55%` | `220 90% 60%` | **브랜드 포인트 색** | 버튼, 링크, 포커스 링 |
| `--brand-foreground` | `0 0% 98%` | `0 0% 8%` | 브랜드 배경 위 텍스트 | 대비 확보 |
| `--brand-0` ~ `--brand-9` | 단계별 HS L | 동일 | 10단계 밝기 스케일 | Tailwind `brand.0-9` |
| `--primary` | `0 0% 20%` | `0 0% 85%` | (구) 핵심 색, 레거시 | 추후 제거 예정 |
| `--primary-rgb` | `51, 51, 51` | `217, 217, 217` | `rgba()` 전용 RGB 배열 | `filter: drop-shadow()` 등 |
| `--primary-foreground` | `0 0% 98%` | `0 0% 8%` | 프라이머리 배경 위 텍스트 | 반전 대비 확보 |
| `--secondary` | `0 0% 30%` | `0 0% 70%` | 보조 강조색 | 서브 버튼, 태그 |
| `--secondary-foreground` | `0 0% 98%` | `0 0% 8%` | │ | |
| `--accent` | `0 0% 40%` | `0 0% 60%` | 하이라이트 | hover 배경, 마커 |
| `--accent-foreground` | `0 0% 98%` | `0 0% 8%` | │ | |

> **주의** : 브랜드 컬러를 바꾸고 싶다면 `--primary` 와 `--primary-rgb` 두 값을 **동시에** 수정해야 일관성이 유지된다.

---

## 3. 상태(Status) 계열 색상

| 변수 | 라이트 | 다크 | 의미 |
|-------|--------|------|------|
| `--destructive` | `0 72% 51%` | `0 72% 60%` | 오류 · 삭제 |
| `--destructive-foreground` | `0 0% 98%` | `0 0% 95%` | 오류 배경 위 텍스트 |
| `--warning` | `38 92% 50%` | `38 92% 60%` | 경고 |
| `--warning-foreground` | `0 0% 8%` | 동일 | 경고 배경 위 텍스트 |
| `--success` | `142 71% 45%` | `142 71% 55%` | 성공 |
| `--success-foreground` | `0 0% 98%` | `0 0% 8%` | 성공 배경 위 텍스트 |

---

## 4. 뉴모피즘 전용 변수

| 변수 | 타입 | 라이트 | 다크 | 설명 |
|-------|------|--------|------|------|
| `--neu-light` | `R,G,B,A` | `255, 255, 255, 0.95` | `255, 255, 255, 0.05` | 입체 효과의 **하이라이트** 색 |
| `--neu-dark` | `R,G,B,A` | `0, 0, 0, 0.08` | `0, 0, 0, 0.35` | 입체 효과의 **그림자** 색 |
| `--neu-offset` | `px` | `3px` | `2px`
