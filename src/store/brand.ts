import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// HSL 문자열 "h s% l%" 형태로 저장
export const brandColorAtom = atomWithStorage<string>('brand-color', '220 90% 55%');

// 유틸: 값 범위 고정
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

// 브랜드 스케일(0~9) 계산 및 CSS 변수 주입
function updateBrandScale(hslString: string) {
  if (typeof window === 'undefined') return;
  const [hStr, sStr, lStr] = hslString.split(' ');
  const h = hStr.trim();
  const s = sStr.trim();
  const lNum = Number(lStr.replace('%', ''));
  // 오프셋: 밝은 → 기본 → 어두운 (단계당 ±10)
  const offsets = [42, 37, 30, 20, 10, 0, -10, -20, -30, -40];
  offsets.forEach((offset, idx) => {
    const newL = clamp(lNum + offset, 0, 100);
    const cssValue = `${h} ${s} ${newL}%`;
    document.documentElement.style.setProperty(`--brand-${idx}`, cssValue);
  });
}

// 액션: 브랜드 색상 설정
export const setBrandColorAtom = atom(null, (get, set, newColor: string) => {
  set(brandColorAtom, newColor);
  if (typeof window !== 'undefined') {
    document.documentElement.style.setProperty('--brand', newColor);
    updateBrandScale(newColor);
  }
});

// 초기화 액션: 페이지 로드 시 CSS 변수 주입
export const initBrandColorAtom = atom(null, (get) => {
  if (typeof window !== 'undefined') {
    const color = get(brandColorAtom);
    document.documentElement.style.setProperty('--brand', color);
    updateBrandScale(color);
  }
}); 