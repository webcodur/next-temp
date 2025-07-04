"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

//#region 상수 및 타입 정의
const morphTime = 1.5;
const cooldownTime = 0.5;

interface MorphingTextProps {
  className?: string;
  texts: string[];
  currentIndex?: number; // 현재 표시할 텍스트 인덱스 (외부 제어용)
  autoPlay?: boolean; // 자동 순환 여부 (기본값: true)
  onTextChange?: (index: number) => void; // 텍스트 변경 시 콜백
}
//#endregion

//#region 커스텀 훅
const useMorphingText = (
  texts: string[], 
  currentIndex?: number, 
  autoPlay: boolean = true,
  onTextChange?: (index: number) => void
) => {
  const textIndexRef = useRef(currentIndex ?? 0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);
  const timeRef = useRef(new Date());

  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  const setStyles = useCallback(
    (fraction: number) => {
      const [current1, current2] = [text1Ref.current, text2Ref.current];
      if (!current1 || !current2) return;

      // 블러와 투명도 애니메이션
      current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const invertedFraction = 1 - fraction;
      current1.style.filter = `blur(${Math.min(
        8 / invertedFraction - 8,
        100,
      )}px)`;
      current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;

      // 텍스트 순환
      current1.textContent = texts[textIndexRef.current % texts.length];
      current2.textContent = texts[(textIndexRef.current + 1) % texts.length];
    },
    [texts],
  );

    const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;
 
    let fraction = morphRef.current / morphTime;
 
    if (fraction > 1) {
      cooldownRef.current = cooldownTime;
      fraction = 1;
    }
 
    setStyles(fraction);
 
    if (fraction === 1) {
      const newIndex = textIndexRef.current + 1;
      textIndexRef.current = newIndex;
      onTextChange?.(newIndex % texts.length);
    }
  }, [setStyles, onTextChange, texts.length]);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    const [current1, current2] = [text1Ref.current, text2Ref.current];
    if (current1 && current2) {
      current2.style.filter = "none";
      current2.style.opacity = "100%";
      current1.style.filter = "none";
      current1.style.opacity = "0%";
    }
  }, []);

    // 외부 currentIndex 변경 감지
  useEffect(() => {
    if (currentIndex !== undefined && currentIndex !== textIndexRef.current % texts.length) {
      textIndexRef.current = currentIndex;
      // 즉시 해당 텍스트로 변경
      morphRef.current = 0;
      cooldownRef.current = cooldownTime;
      doCooldown();
    }
  }, [currentIndex, texts.length, doCooldown]);

  useEffect(() => {
    if (!autoPlay) return; // autoPlay가 false면 애니메이션 중단
    
    let animationFrameId: number;
 
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
 
      const newTime = new Date();
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;
      timeRef.current = newTime;
 
      cooldownRef.current -= dt;
 
      if (cooldownRef.current <= 0) doMorph();
      else doCooldown();
    };
 
    animate();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [doMorph, doCooldown, autoPlay]);

  return { text1Ref, text2Ref };
};
//#endregion

//#region 서브 컴포넌트
const Texts: React.FC<Pick<MorphingTextProps, "texts" | "currentIndex" | "autoPlay" | "onTextChange">> = ({ 
  texts, 
  currentIndex, 
  autoPlay = true, 
  onTextChange 
}) => {
  const { text1Ref, text2Ref } = useMorphingText(texts, currentIndex, autoPlay, onTextChange);
  
  return (
    <>
      <span
        className="inline-block absolute inset-x-0 top-0 m-auto w-full"
        ref={text1Ref}
      />
      <span
        className="inline-block absolute inset-x-0 top-0 m-auto w-full"
        ref={text2Ref}
      />
    </>
  );
};

const SvgFilters: React.FC = () => (
  <svg
    id="morphing-filters"
    className="fixed w-0 h-0"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <filter id="morphing-threshold">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
        />
      </filter>
    </defs>
  </svg>
);
//#endregion

//#region 메인 컴포넌트
export const MorphingText: React.FC<MorphingTextProps> = ({
  texts,
  className,
  currentIndex,
  autoPlay = true,
  onTextChange,
}) => (
  <div
    className={cn(
      "relative mx-auto h-16 w-full max-w-screen-md text-center font-multilang font-extrabold leading-none [filter:url(#morphing-threshold)_blur(0.6px)] md:h-24 text-4xl md:text-5xl lg:text-6xl text-brand",
      className,
    )}
  >
    <Texts 
      texts={texts} 
      currentIndex={currentIndex}
      autoPlay={autoPlay}
      onTextChange={onTextChange}
    />
    <SvgFilters />
  </div>
);
//#endregion 