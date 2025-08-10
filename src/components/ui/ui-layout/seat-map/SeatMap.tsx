'use client';

import { useState, useEffect } from 'react';
import { User, Armchair, Square, Building2, Check, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslations } from '@/hooks/ui-hooks/useI18n';
import { 
  GridObject, 
  FACILITY_COLORS,
  CELL_SIZE,
  SeatMapProps,
  FacilityStats 
} from '@/types/facility';

export const SeatMap = ({ 
  layout, 
  selectedSeat,
  onSeatSelect,
  readonly = false 
}: SeatMapProps) => {
  const t = useTranslations();
  const [stats, setStats] = useState<FacilityStats>({
    totalSeats: 0,
    availableSeats: 0,
    occupiedSeats: 0,
    reservedSeats: 0,
    disabledSeats: 0,
  });

  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  //#region 통계 계산
  useEffect(() => {
    const seats = layout.objects.filter(obj => obj.type === 'seat');
    const newStats = {
      totalSeats: seats.length,
      availableSeats: seats.filter(s => s.status === 'available').length,
      occupiedSeats: seats.filter(s => s.status === 'occupied').length,
      reservedSeats: seats.filter(s => s.status === 'reserved').length,
      disabledSeats: seats.filter(s => s.status === 'disabled').length,
    };
    setStats(newStats);
  }, [layout.objects]);
  //#endregion

  //#region 좌석 색상 계산
  const getSeatColor = (obj: GridObject): string => {
    if (obj.type === 'space') return FACILITY_COLORS.space;
    if (obj.type === 'object') return FACILITY_COLORS.object;
    
    // 좌석인 경우
    if (selectedSeat === obj.id) return FACILITY_COLORS.selected;
    if (obj.status === 'available') return FACILITY_COLORS.available;
    if (obj.status === 'occupied') return FACILITY_COLORS.occupied;
    if (obj.status === 'reserved') return FACILITY_COLORS.reserved;
    if (obj.status === 'disabled') return FACILITY_COLORS.disabled;
    
    return FACILITY_COLORS.seat;
  };
  //#endregion

  //#region 좌석 아이콘 렌더링
  const renderSeatIcon = (obj: GridObject) => {
    const isSelected = selectedSeat === obj.id;
    const isHovered = hoveredSeat === obj.id;
    
    if (obj.type === 'space') {
      return <Square className="w-4 h-4 opacity-30" />;
    }
    
    if (obj.type === 'object') {
      return <Building2 className="w-4 h-4 opacity-60" />;
    }
    
    // 좌석 타입
    const iconClass = clsx(
      'w-4 h-4 transition-all duration-200',
      isSelected && 'scale-110',
      isHovered && 'scale-105'
    );
    
    if (obj.status === 'occupied') {
      return <User className={iconClass} />;
    }
    
    if (obj.status === 'reserved') {
      return <Check className={iconClass} />;
    }
    
    if (obj.status === 'disabled') {
      return <X className={iconClass} />;
    }
    
    return <Armchair className={iconClass} />;
  };
  //#endregion

  //#region 좌석 클릭 핸들러
  const handleSeatClick = (obj: GridObject) => {
    if (readonly) return;
    if (obj.type !== 'seat') return;
    if (obj.status !== 'available') return;
    
    onSeatSelect?.(obj.id);
  };
  //#endregion

  //#region 좌석 이름 표시
  const displaySeatName = (obj: GridObject): string => {
    return obj.type === 'seat' || obj.type === 'object' ? obj.name : '';
  };
  //#endregion

  return (
    <div className="p-6 space-y-6 rounded-lg neu-flat">
      {/* 상단 통계 */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground font-multilang">
          {layout.name}
        </h2>
        <div className="flex gap-4 text-sm font-multilang">
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>{t('시설_사용가능')}: {stats.availableSeats}</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>{t('시설_사용중')}: {stats.occupiedSeats}</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>{t('시설_예약됨')}: {stats.reservedSeats}</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>{t('시설_사용불가')}: {stats.disabledSeats}</span>
          </div>
        </div>
      </div>

      {/* 좌석 맵 */}
      		<div className="overflow-auto p-4 rounded-lg neu-inset bg-serial-0">
        <div 
          className="relative"
          style={{
            width: layout.gridSize.width * CELL_SIZE,
            height: layout.gridSize.height * CELL_SIZE,
          }}
        >
          {/* 격자 배경 */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, #ccc 1px, transparent 1px),
                linear-gradient(to bottom, #ccc 1px, transparent 1px)
              `,
              backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
            }}
          />
          
          {/* 좌석 객체들 */}
          {layout.objects.map((obj) => (
            <div
              key={obj.id}
              className={clsx(
                'absolute flex flex-col items-center justify-center',
                'border border-gray-300 rounded-sm text-xs font-medium',
                'transition-all duration-200 cursor-pointer',
                'hover:scale-105 hover:shadow-lg',
                obj.type === 'seat' && obj.status === 'available' && 'hover:ring-2 hover:ring-primary',
                obj.type === 'seat' && obj.status !== 'available' && 'cursor-not-allowed opacity-70',
                selectedSeat === obj.id && 'ring-2 ring-yellow-400 shadow-lg scale-105'
              )}
              style={{
                left: obj.position.x * CELL_SIZE,
                top: obj.position.y * CELL_SIZE,
                width: obj.size.width * CELL_SIZE,
                height: obj.size.height * CELL_SIZE,
                backgroundColor: getSeatColor(obj),
                color: obj.type === 'space' ? '#666' : '#fff',
              }}
              onClick={() => handleSeatClick(obj)}
              onMouseEnter={() => setHoveredSeat(obj.id)}
              onMouseLeave={() => setHoveredSeat(null)}
            >
              {renderSeatIcon(obj)}
              {displaySeatName(obj) && (
                <span className="mt-1 text-xs truncate font-multilang">
                  {displaySeatName(obj)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 선택된 좌석 정보 */}
      {selectedSeat && (
        		<div className="p-4 rounded-lg neu-flat bg-serial-1">
          {(() => {
            const seat = layout.objects.find(obj => obj.id === selectedSeat);
            if (!seat || seat.type !== 'seat') return null;
            
            return (
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground font-multilang">
                  {t('시설_선택된좌석')}: {seat.name}
                </h3>
                <div className="flex gap-2 items-center text-sm font-multilang">
                  <span>{t('시설_상태')}:</span>
                  <span className={clsx(
                    'px-2 py-1 rounded text-xs font-medium',
                    seat.status === 'available' && 'bg-green-100 text-green-800',
                    seat.status === 'occupied' && 'bg-red-100 text-red-800',
                    seat.status === 'reserved' && 'bg-yellow-100 text-yellow-800',
                    seat.status === 'disabled' && 'bg-gray-100 text-gray-800'
                  )}>
                    {t(`시설_${seat.status}`)}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default SeatMap; 