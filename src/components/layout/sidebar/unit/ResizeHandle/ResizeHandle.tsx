/* 
  파일명: /components/layout/sidebar/unit/ResizeHandle/ResizeHandle.tsx
  기능: 사이드바 우측 모서리 리사이즈 핸들 컴포넌트
  책임: 마우스 드래그로 세컨더리 패널 폭을 조절하는 핸들 제공
*/ // ------------------------------
'use client';

import { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { endPanelWidthAtom, isResizingAtom, isSideResizeControlHoveredAtom } from '@/store/sidebar';
import { defaults } from '@/data/sidebarConfig';

interface ResizeHandleProps {
  minWidth?: number;
  maxWidth?: number;
}

export function ResizeHandle({ 
  minWidth = defaults.minResizeWidth, 
  maxWidth = defaults.maxResizeWidth 
}: ResizeHandleProps) {
  const [endPanelWidth, setEndPanelWidth] = useAtom(endPanelWidthAtom);
  const [isResizing, setIsResizing] = useAtom(isResizingAtom);
  const [isHovered, setIsHovered] = useAtom(isSideResizeControlHoveredAtom);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = endPanelWidth;
    
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const deltaX = e.clientX - startXRef.current;
      const newWidth = Math.min(
        Math.max(startWidthRef.current + deltaX, minWidth),
        maxWidth
      );
      
      setEndPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseleave', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isResizing, minWidth, maxWidth, setEndPanelWidth, setIsResizing]);

  return (
    <div 
      className="absolute top-0 right-0 z-50 w-1 h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 호버 감지 영역 - 전체 우측 모서리 */}
      <div
        className={`absolute top-0 right-0 w-1 h-full transition-all duration-200 ${
          isResizing 
            ? 'bg-primary' 
            : isHovered 
              ? 'bg-primary/60' 
              : 'bg-transparent hover:bg-primary/30'
        }`}
      >
        {/* 더 넓은 호버 영역 */}
        <div className="absolute top-0 right-0 w-2 h-full -translate-x-1/2" />
      </div>
      
      {/* 실제 드래그 가능한 중앙 손잡이 영역 */}
      {(isHovered || isResizing) && (
        <div 
          className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 cursor-col-resize"
          onMouseDown={handleMouseDown}
        >
          {/* Grip 스타일 아이콘 - 세로 점 3개 */}
          <div className="flex flex-col gap-1 items-center p-2 rounded border shadow-sm backdrop-blur-sm bg-surface-3/80 border-border/30">
            <div className="w-1 h-1 rounded-full bg-primary"></div>
            <div className="w-1 h-1 rounded-full bg-primary"></div>
            <div className="w-1 h-1 rounded-full bg-primary"></div>
          </div>
        </div>
      )}
    </div>
  );
} 