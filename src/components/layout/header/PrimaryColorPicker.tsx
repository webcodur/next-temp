import { useAtom } from 'jotai';
import { setPrimaryColorAtom, primaryColorAtom } from '@/store/primary';
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

interface PrimaryColorPickerProps {
  className?: string;
}

export function PrimaryColorPicker({ className }: PrimaryColorPickerProps) {
  const [color] = useAtom(primaryColorAtom);
  const [, setPrimaryColor] = useAtom(setPrimaryColorAtom);

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
    setPrimaryColor(hslString);
  };

  return (
    <div className={clsx('relative', className)}>
      <input
        type="color"
        aria-label="primary color picker"
        value={hslToHex(color)}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="w-full h-full flex items-center justify-center">
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className="text-muted-foreground"
        >
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
      </div>
    </div>
  );
} 