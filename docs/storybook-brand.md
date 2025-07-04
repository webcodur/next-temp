# Storybook & Brand Color Guide

## 목표

스토리북 및 개발 문서에서 **브랜드 포인트 색상(brand token)** 사용 방법을 빠르게 확인할 수 있도록 예시와 설정 방법을 정리한다.

---

## 1. 스토리북 전역 설정

```ts
// .storybook/preview.ts
import type { Preview } from "@storybook/react";
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    // 다크·라이트 테마 토글
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#000000" },
      ],
    },
  },
};

export default preview;
```

### BrandColorPicker 애드온

스토리북 Toolbar에 `BrandColorPicker` 를 추가하면 런타임으로 brand 색상을 변경하면서 컴포넌트가 즉시 반응하는 것을 확인할 수 있다.

```ts
// .storybook/manager.ts
import { addons } from "@storybook/manager-api";
import brandTheme from "./brandTheme";

addons.setConfig({
  theme: brandTheme,
});
```

---

## 2. 컴포넌트 예시

### Button

```tsx
import { Button } from "@/components/ui/ui-input/button/Button";

export const BrandButton = () => (
  <Button variant="brand">브랜드 버튼</Button>
);
```

### Badge

```tsx
import { Badge } from "@/components/ui/ui-effects/badge/Badge";

export const BrandBadge = () => (
  <Badge variant="brand">BRAND</Badge>
);
```

### Tooltip

```tsx
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/ui-effects/tooltip/Tooltip";

export const BrandTooltip = () => (
  <Tooltip>
    <TooltipTrigger>
      <Button>Hover me</Button>
    </TooltipTrigger>
    <TooltipContent variant="brand">브랜드 툴팁</TooltipContent>
  </Tooltip>
);
```

---

## 3. 접근성 체크리스트

- 브랜드 색상 대비가 WCAG AA 기준(4.5:1) 이상인지 확인한다.
- 어두운 배경에서 `text-brand-foreground` 가 충분히 읽기 쉬운지 테스트한다.

---

## 4. 참고 링크

- `docs/point-color-system.md` – 브랜드 색상 체계 개편 계획
- Tailwind `colors.brand.*` 토큰 정의 – `tailwind.config.js`
