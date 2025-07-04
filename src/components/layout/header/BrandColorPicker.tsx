import { useAtom } from 'jotai';
import { setBrandColorAtom, brandColorAtom } from '@/store/brand';
import { ChangeEvent } from 'react';
import clsx from 'clsx';

// HEX → HSL 변환 유틸
function hexToHslString(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

interface BrandColorPickerProps {
  className?: string;
}

export function BrandColorPicker({ className }: BrandColorPickerProps) {
  const [color] = useAtom(brandColorAtom);
  const [, setBrandColor] = useAtom(setBrandColorAtom);

  // 현재 HSL을 HEX로 변환 (간단 버전) for input value
  const hslToHex = (hsl: string): string => {
    const [hStr, sStr, lStr] = hsl.split(' ');
    const h = Number(hStr);
    const s = Number(sStr.replace('%', '')) / 100;
    const l = Number(lStr.replace('%', '')) / 100;

    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    const hslString = hexToHslString(hex);
    setBrandColor(hslString);
  };

  return (
    <input
      type="color"
      aria-label="brand color picker"
      value={hslToHex(color)}
      onChange={handleChange}
      className={clsx('w-full h-full p-0 border-none cursor-pointer bg-transparent', className)}
      style={{ WebkitAppearance: 'none' }}
    />
  );
} 