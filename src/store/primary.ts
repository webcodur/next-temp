import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// HSL 문자열 "h s% l%" 형태로 저장 (호환성 유지)
export const primaryColorAtom = atomWithStorage<string>('primary-color', '220 90% 55%');

// 유틸: 값 범위 고정
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

// 기존 브랜드 스케일(0~9) 계산 및 CSS 변수 주입 (단순화)
function updatePrimaryScale(hslString: string) {
  if (typeof window === 'undefined') return;
  const [hStr, sStr, lStr] = hslString.split(' ');
  const h = hStr.trim();
  const s = sStr.trim();
  const lNum = Number(lStr.replace('%', ''));
  
  // 다크모드 감지
  const isDark = document.documentElement.classList.contains('dark');
  
  if (isDark) {
    // 다크모드: 어두운 → 기본 → 밝은
    const offsets = [-40, -30, -20, -10, -5, 0, 5, 15, 25, 35];
    offsets.forEach((offset, idx) => {
      const newL = clamp(lNum + offset, 0, 100);
      const cssValue = `${h} ${s} ${newL}%`;
      document.documentElement.style.setProperty(`--primary-${idx}`, cssValue);
    });
  } else {
    // 라이트모드: 밝은 → 기본 → 어두운
    const offsets = [42, 37, 30, 20, 10, 0, -10, -20, -30, -40];
    offsets.forEach((offset, idx) => {
      const newL = clamp(lNum + offset, 0, 100);
      const cssValue = `${h} ${s} ${newL}%`;
      document.documentElement.style.setProperty(`--primary-${idx}`, cssValue);
    });
  }
}

// 액션: 브랜드 색상 설정 (단순화)
export const setPrimaryColorAtom = atom(null, (get, set, newColor: string) => {
  set(primaryColorAtom, newColor);
  if (typeof window !== 'undefined') {
    document.documentElement.style.setProperty('--primary', newColor);
    updatePrimaryScale(newColor);
  }
});

// 단순한 초기화 액션
export const initPrimaryColorAtom = atom(null, (get) => {
  if (typeof window !== 'undefined') {
    const primaryColor = get(primaryColorAtom);
    document.documentElement.style.setProperty('--primary', primaryColor);
    updatePrimaryScale(primaryColor);
  }
}); 