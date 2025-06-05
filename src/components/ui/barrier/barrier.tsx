// #region imports
import React from 'react';
// #endregion

// #region types
interface BarrierProps {
  /** 차단기 열림 상태(true: 위로 열린 상태) */
  isOpen: boolean;
  /** 상태 변경 요청 시 호출 */
  onToggle?: () => void;
  /** 차단기 막대 길이(px) 기본 200 */
  width?: number;
  /** 차단기 막대 두께(px) 기본 8 */
  height?: number;
  /** 애니메이션 지속 시간(ms) 기본 500 */
  animationDuration?: number;
  /** 추가 클래스명 */
  className?: string;
}
// #endregion

// #region component
const Barrier: React.FC<BarrierProps> = ({
  isOpen,
  onToggle,
  width = 200,
  height = 8,
  animationDuration = 500,
  className = '',
}) => {
  const pivotSize = height * 2;
  const bodyWidth = height * 4; // housing width
  const housingHeight = width + pivotSize; // housing height equals rod length + pivot radius
  const containerWidth = bodyWidth + width; // total width: housing + rod
  const containerHeight = housingHeight; // total height
  const rodBottom = housingHeight - pivotSize / 2 - height / 2; // position rod center at pivot
  const rotation = isOpen ? -90 : 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      onToggle &&
      (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar')
    ) {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: containerWidth, height: containerHeight }}
      role={onToggle ? 'button' : undefined}
      aria-expanded={isOpen}
      tabIndex={onToggle ? 0 : undefined}
      onClick={() => onToggle?.()}
      onKeyDown={handleKeyDown}
    >
      {/* Barrier housing */}
      <div
        className="absolute bottom-0 left-0 bg-gray-700"
        style={{
          width: bodyWidth,
          height: housingHeight,
          borderRadius: height,
        }}
      />
      {/* Barrier arm */}
      <div
        className="absolute origin-left bg-transparent"
        style={{
          left: bodyWidth,
          bottom: rodBottom,
          width: width,
          height: height,
          backgroundImage: 'repeating-linear-gradient(45deg, #e53e3e 0 10px, #fff 0 20px)',
          transformOrigin: '0 50%',
          transform: `rotate(${rotation}deg)`,
          transition: `transform ${animationDuration}ms ease-in-out`,
        }}
      />
    </div>
  );
};

export default Barrier;
// #endregion 