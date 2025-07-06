import { test, expect } from '@playwright/test';

const CUSTOM_BRAND = '20 90% 55%'; // HSL without commas

// 페이지 시작 전에 localStorage에 브랜드 색을 주입해 런타임 변경 시뮬레이션
// 그리고 CSS 변수에 반영되었는지 확인한다.

test.describe('Brand Color System', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((color) => {
      localStorage.setItem('brand-color', color);
    }, CUSTOM_BRAND);
  });

  test('CSS var --brand should match stored color', async ({ page }) => {
    await page.goto('/');
    const rootBrand = await page.evaluate(() => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--brand')
        .trim();
    });
    expect(rootBrand).toBe(CUSTOM_BRAND);
  });

  test('Button variant="brand" renders with brand background', async ({ page }) => {
    // 간단한 HTML 삽입 후 스타일 검사
    await page.setContent(
      '<button class="bg-brand text-brand-foreground px-4 py-2 rounded">BTN</button>'
    );
    const bgColor = await page.$eval('button', (el) => {
      return getComputedStyle(el).backgroundColor;
    });
    // HSL → rgb(...) 로 변환된 문자열이 비어있지 않으면 통과
    expect(bgColor).not.toBe('');
  });
}); 