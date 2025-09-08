/* 
  파일명: /address-input/CoordinatesDisplay.tsx
  기능: 위경도 좌표 정보 표시 컴포넌트
  책임: 한국/글로벌 공통으로 사용되는 좌표 정보 UI
*/ // ------------------------------

import React from 'react';
import { MapPin } from 'lucide-react';
import type { Coordinates } from './types';

// #region 타입 정의
interface CoordinatesDisplayProps {
  coordinates: Coordinates;
  className?: string;
  colorVariant?: 'primary' | 'secondary';
  showLabel?: boolean;
  compact?: boolean; // 축약 모드
}
// #endregion

// #region 메인 컴포넌트
export const CoordinatesDisplay: React.FC<CoordinatesDisplayProps> = ({
  coordinates,
  className = '',
  colorVariant = 'primary',
  showLabel = true,
  compact = false
}) => {
  // colorVariant에 따른 색상 클래스
  const getColorClasses = () => {
    const baseColor = colorVariant === 'primary' ? 'primary' : 'secondary';
    return {
      icon: `text-${baseColor}`,
      bg: `bg-${baseColor}/10`,
      text: `text-${baseColor}`,
    };
  };
  
  const colorClasses = getColorClasses();

  // 좌표값 포맷팅 (소수점 6자리)
  const formatCoordinate = (value: number): string => {
    return value.toFixed(6);
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md ${colorClasses.bg} ${className}`}>
      <MapPin className={`w-3 h-3 ${colorClasses.icon} flex-shrink-0`} />
      
      {compact ? (
        <span className={`text-xs font-medium ${colorClasses.text}`}>
          {formatCoordinate(coordinates.latitude)}, {formatCoordinate(coordinates.longitude)}
        </span>
      ) : (
        <div className="flex items-center gap-2">
          {showLabel && (
            <span className="text-xs font-medium text-muted-foreground">
              Coordinates:
            </span>
          )}
          <span className={`text-xs font-medium ${colorClasses.text}`}>
            Lat {formatCoordinate(coordinates.latitude)}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className={`text-xs font-medium ${colorClasses.text}`}>
            Lng {formatCoordinate(coordinates.longitude)}
          </span>
        </div>
      )}
    </div>
  );
};
// #endregion
