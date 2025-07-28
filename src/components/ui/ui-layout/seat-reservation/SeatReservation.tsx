'use client';

import { useState } from 'react';
import { Clock, Calendar, User, MapPin, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslations } from '@/hooks/useI18n';
import { SeatMap } from '../seat-map/SeatMap';
import { 
  FacilityLayout, 
  SeatData,
  ReservationData 
} from '@/types/facility';

interface SeatReservationProps {
  facility: FacilityLayout;
  onReservationComplete: (reservation: ReservationData) => void;
  onCancel?: () => void;
  colorVariant?: 'primary' | 'secondary';
}

interface TimeSlot {
  id: string;
  label: string;
  duration: number; // 분 단위
  price?: number;
}

const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { id: '1h', label: '1시간', duration: 60, price: 5000 },
  { id: '2h', label: '2시간', duration: 120, price: 9000 },
  { id: '3h', label: '3시간', duration: 180, price: 13000 },
  { id: '4h', label: '4시간', duration: 240, price: 16000 },
  { id: 'day', label: '종일', duration: 480, price: 25000 },
];

export const SeatReservation = ({ 
  facility, 
  onReservationComplete, 
  onCancel,
  colorVariant = 'primary'
}: SeatReservationProps) => {
  const t = useTranslations();
  
  // 색상 variant에 따른 스타일
  const buttonBgClass = colorVariant === 'primary' ? 'bg-primary' : 'bg-secondary';
  
  const [selectedSeat, setSelectedSeat] = useState<string | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | undefined>(undefined);
  const [reservationDate, setReservationDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [reservationTime, setReservationTime] = useState<string>('09:00');
  const [step, setStep] = useState<'select' | 'confirm' | 'complete'>('select');
  const [isLoading, setIsLoading] = useState(false);

  //#region 좌석 정보 가져오기
  const getSelectedSeatData = (): SeatData | undefined => {
    if (!selectedSeat) return undefined;
    const seat = facility.objects.find(obj => obj.id === selectedSeat);
    return seat?.type === 'seat' ? seat as SeatData : undefined;
  };
  //#endregion

  //#region 예약 시간 계산
  const calculateReservationTime = () => {
    if (!selectedTimeSlot) return { start: undefined, end: undefined };
    
    const startDateTime = new Date(`${reservationDate}T${reservationTime}`);
    const endDateTime = new Date(startDateTime.getTime() + selectedTimeSlot.duration * 60000);
    
    return {
      start: startDateTime,
      end: endDateTime
    };
  };
  //#endregion

  //#region 예약 확정
  const handleConfirmReservation = async () => {
    if (!selectedSeat || !selectedTimeSlot) return;
    
    setIsLoading(true);
    
    try {
      const { start, end } = calculateReservationTime();
      if (!start || !end) throw new Error('Invalid time calculation');
      
      const reservation: ReservationData = {
        id: `reservation-${Date.now()}`,
        seatId: selectedSeat,
        userId: 'current-user', // 실제로는 인증된 사용자 ID
        startTime: start,
        endTime: end,
        status: 'active'
      };
      
      // 시뮬레이션된 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onReservationComplete(reservation);
      setStep('complete');
      
    } catch (error) {
      console.error('Reservation failed:', error);
      alert(t('공통_오류발생'));
    } finally {
      setIsLoading(false);
    }
  };
  //#endregion

  //#region 단계별 렌더링
  const renderSeatSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground font-multilang">
          {t('시설_좌석선택')}
        </h2>
        <div className="text-sm text-secondary font-multilang">
          {t('시설_사용가능좌석클릭')}
        </div>
      </div>
      
      <SeatMap 
        layout={facility}
        selectedSeat={selectedSeat}
        onSeatSelect={setSelectedSeat}
      />
      
      {selectedSeat && (
        <div className="flex justify-end">
          <button
            onClick={() => setStep('confirm')}
            className={`px-6 py-3 rounded-lg neu-raised hover:scale-105 ${buttonBgClass} text-white font-multilang`}
          >
            {t('시설_예약시간선택')}
          </button>
        </div>
      )}
    </div>
  );

  const renderTimeSelection = () => {
    const seatData = getSelectedSeatData();
    if (!seatData) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground font-multilang">
            {t('시설_예약시간선택')}
          </h2>
          <button
            onClick={() => setStep('select')}
            className="px-4 py-2 rounded-lg neu-raised hover:scale-105 font-multilang"
          >
            {t('공통_뒤로')}
          </button>
        </div>
        
        {/* 선택된 좌석 정보 */}
        <div className="neu-flat p-4 rounded-lg bg-serial-1">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground font-multilang">
                {seatData.name}
              </h3>
              <p className="text-sm text-secondary font-multilang">
                {facility.name}
              </p>
            </div>
          </div>
        </div>
        
        {/* 날짜 및 시간 선택 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground font-multilang">
              {t('시설_예약날짜')}
            </label>
            <input
              type="date"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-300 rounded-lg neu-inset font-multilang"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground font-multilang">
              {t('시설_시작시간')}
            </label>
            <input
              type="time"
              value={reservationTime}
              onChange={(e) => setReservationTime(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg neu-inset font-multilang"
            />
          </div>
        </div>
        
        {/* 시간대 선택 */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground font-multilang">
            {t('시설_이용시간')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {DEFAULT_TIME_SLOTS.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedTimeSlot(slot)}
                className={clsx(
                  'p-4 rounded-lg border-2 transition-all text-center',
                  selectedTimeSlot?.id === slot.id
                    ? 'neu-inset border-primary bg-primary/10 text-primary'
                    : 'neu-raised border-gray-300 hover:scale-105'
                )}
              >
                <div className="font-semibold font-multilang">{slot.label}</div>
                {slot.price && (
                  <div className="text-sm text-secondary font-multilang">
                    {slot.price.toLocaleString()}원
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* 예약 요약 */}
        {selectedTimeSlot && (
          <div className="neu-flat p-4 rounded-lg bg-serial-1">
            <h3 className="font-semibold mb-3 text-foreground font-multilang">
              {t('시설_예약요약')}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary font-multilang">{t('시설_좌석')}:</span>
                <span className="font-multilang">{seatData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary font-multilang">{t('시설_날짜')}:</span>
                <span className="font-multilang">{reservationDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary font-multilang">{t('시설_시간')}:</span>
                <span className="font-multilang">{reservationTime} ~ {
                  (() => {
                    const { end } = calculateReservationTime();
                    return end ? end.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '';
                  })()
                }</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary font-multilang">{t('시설_이용시간')}:</span>
                <span className="font-multilang">{selectedTimeSlot.label}</span>
              </div>
              {selectedTimeSlot.price && (
                <div className="flex justify-between font-semibold text-primary">
                  <span className="font-multilang">{t('시설_총요금')}:</span>
                  <span className="font-multilang">{selectedTimeSlot.price.toLocaleString()}원</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {selectedTimeSlot && (
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setStep('select')}
              className="px-6 py-3 rounded-lg neu-raised hover:scale-105 font-multilang"
            >
              {t('공통_취소')}
            </button>
            <button
              onClick={handleConfirmReservation}
              disabled={isLoading}
              className={clsx(
                'px-6 py-3 rounded-lg flex items-center gap-2 font-multilang',
                isLoading 
                  ? 'opacity-50 cursor-not-allowed neu-inset' 
                  : 'neu-raised hover:scale-105 bg-primary text-white'
              )}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('공통_로딩중')}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {t('시설_예약확정')}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderComplete = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2 font-multilang">
          {t('시설_예약완료')}
        </h2>
        <p className="text-secondary font-multilang">
          {t('시설_예약완료메시지')}
        </p>
      </div>
      
      <div className="neu-flat p-6 rounded-lg bg-serial-1 text-left">
        <h3 className="font-semibold mb-4 text-foreground font-multilang">
          {t('시설_예약정보')}
        </h3>
        
        {(() => {
          const seatData = getSelectedSeatData();
          const { start, end } = calculateReservationTime();
          
          return (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium font-multilang">{seatData?.name}</div>
                  <div className="text-sm text-secondary font-multilang">{facility.name}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div className="font-multilang">{reservationDate}</div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div className="font-multilang">
                  {start?.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} ~ 
                  {end?.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <div className="font-multilang">{selectedTimeSlot?.label}</div>
              </div>
            </div>
          );
        })()}
      </div>
      
      <div className="flex justify-center gap-3">
        <button
          onClick={() => {
            setStep('select');
            setSelectedSeat(undefined);
            setSelectedTimeSlot(undefined);
          }}
          className="px-6 py-3 rounded-lg neu-raised hover:scale-105 font-multilang"
        >
          {t('시설_다시예약')}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 rounded-lg neu-raised hover:scale-105 bg-primary text-white font-multilang"
        >
          {t('공통_확인')}
        </button>
      </div>
    </div>
  );
  //#endregion

  return (
    <div className="max-w-6xl mx-auto">
      {step === 'select' && renderSeatSelection()}
      {step === 'confirm' && renderTimeSelection()}
      {step === 'complete' && renderComplete()}
    </div>
  );
};

export default SeatReservation; 