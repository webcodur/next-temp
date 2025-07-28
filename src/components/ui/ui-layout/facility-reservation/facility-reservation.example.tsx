'use client';

import { useState, useMemo } from 'react';
import { Building, Users, Calendar, Settings, ArrowLeft } from 'lucide-react';
import { useTranslations } from '@/hooks/useI18n';
import { SeatReservation } from '@/components/ui/ui-layout/seat-reservation/SeatReservation';
import { FacilityEditor } from '@/components/ui/ui-layout/facility-editor/FacilityEditor';
import { FacilityLayout, ReservationData, createFilledLayout, SeatStatus } from '@/types/facility';
import { convertOldToNew, convertNewToOld } from '@/components/ui/ui-layout/facility-editor/utils/typeAdapter';

// 샘플 시설 데이터 - 빈 셀 없이 전부 빈공간으로 시작
const createSampleFacilities = (): FacilityLayout[] => {
  // 독서실 A 생성 (고정 ID 사용)
  const readingRoomA = createFilledLayout('독서실 A', '독서실', { width: 12, height: 8 });
  readingRoomA.id = 'reading-room-a';
  
  // 일부 셀을 좌석으로 변경
  const seatPositions = [
    { x: 0, y: 0, name: 'A-01', status: 'available' },
    { x: 1, y: 0, name: 'A-02', status: 'available' },
    { x: 2, y: 0, name: 'A-03', status: 'occupied' },
    { x: 3, y: 0, name: 'A-04', status: 'available' },
    { x: 4, y: 0, name: 'A-05', status: 'reserved' },
    { x: 0, y: 2, name: 'B-01', status: 'available' },
    { x: 1, y: 2, name: 'B-02', status: 'available' },
    { x: 2, y: 2, name: 'B-03', status: 'disabled' },
    { x: 3, y: 2, name: 'B-04', status: 'available' },
    { x: 4, y: 2, name: 'B-05', status: 'available' },
  ];
  
  // 기존 space 객체들을 제거하고 새로운 객체들로 교체
  readingRoomA.objects = readingRoomA.objects.filter(obj => {
    const hasNewObject = seatPositions.some(seat => seat.x === obj.position.x && seat.y === obj.position.y) ||
                         (obj.position.x >= 8 && obj.position.x <= 9 && obj.position.y >= 0 && obj.position.y <= 1);
    return !hasNewObject;
  });
  
  // 새로운 좌석들 추가
  seatPositions.forEach((seat, index) => {
    readingRoomA.objects.push({
      id: `seat-${index + 1}`,
      type: 'seat',
      name: seat.name,
      size: { width: 1, height: 1 },
      status: seat.status as SeatStatus,
      reservable: true,
      position: { x: seat.x, y: seat.y },
    });
  });
  
  // 화장실 추가
  readingRoomA.objects.push({
    id: 'toilet-1',
    type: 'object',
    name: '화장실',
    size: { width: 2, height: 2 },
    reservable: false,
    position: { x: 8, y: 0 },
  });
  
  // 카페 B 생성 (고정 ID 사용)
  const cafeB = createFilledLayout('카페 B', '카페', { width: 10, height: 6 });
  cafeB.id = 'cafe-b';
  
  // 카페 객체들 추가
  const cafeObjects = [
    { x: 0, y: 0, width: 2, height: 2, type: 'seat', name: '테이블1', status: 'available' },
    { x: 3, y: 0, width: 2, height: 2, type: 'seat', name: '테이블2', status: 'occupied' },
    { x: 6, y: 0, width: 2, height: 2, type: 'seat', name: '테이블3', status: 'available' },
    { x: 0, y: 3, width: 1, height: 1, type: 'seat', name: '바1', status: 'available' },
    { x: 1, y: 3, width: 1, height: 1, type: 'seat', name: '바2', status: 'available' },
    { x: 2, y: 3, width: 1, height: 1, type: 'seat', name: '바3', status: 'reserved' },
    { x: 0, y: 4, width: 4, height: 1, type: 'object', name: '카운터', status: undefined },
  ];
  
  // 기존 space 객체들을 제거하고 새로운 객체들로 교체
  cafeB.objects = cafeB.objects.filter(obj => {
    return !cafeObjects.some(newObj => {
      const isInRange = obj.position.x >= newObj.x && 
                       obj.position.x < newObj.x + newObj.width &&
                       obj.position.y >= newObj.y && 
                       obj.position.y < newObj.y + newObj.height;
      return isInRange;
    });
  });
  
  // 새로운 카페 객체들 추가
  cafeObjects.forEach((obj, index) => {
    if (obj.type === 'seat') {
      cafeB.objects.push({
        id: `cafe-seat-${index + 1}`,
        type: 'seat',
        name: obj.name,
        size: { width: obj.width, height: obj.height },
        status: obj.status as SeatStatus,
        reservable: true,
        position: { x: obj.x, y: obj.y },
      });
    } else {
      cafeB.objects.push({
        id: `cafe-object-${index + 1}`,
        type: 'object',
        name: obj.name,
        size: { width: obj.width, height: obj.height },
        reservable: false,
        position: { x: obj.x, y: obj.y },
      });
    }
  });
  
  return [readingRoomA, cafeB];
};

const SAMPLE_FACILITIES = createSampleFacilities();

export default function FacilityReservationExample() {
  const t = useTranslations();
  const [currentView, setCurrentView] = useState<'list' | 'reservation' | 'admin'>('list');
  const [selectedFacility, setSelectedFacility] = useState<FacilityLayout | null>(null);
  const [facilities, setFacilities] = useState<FacilityLayout[]>(SAMPLE_FACILITIES);
  const [reservations, setReservations] = useState<ReservationData[]>([]);

  // selectedFacility가 변경될 때만 변환 수행 (무한 렌더링 방지)
  const editorLayout = useMemo(() => {
    return selectedFacility ? convertOldToNew(selectedFacility) : null;
  }, [selectedFacility]);

  //#region 예약 처리
  const handleReservationComplete = (reservation: ReservationData) => {
    setReservations(prev => [...prev, reservation]);
    
    // 예약된 좌석 상태 업데이트
    if (selectedFacility) {
      const updatedObjects = selectedFacility.objects.map(obj => 
        obj.type === 'seat' && obj.id === reservation.seatId
          ? { ...obj, status: 'reserved' as SeatStatus }
          : obj
      );
      
      const updatedFacility = {
        ...selectedFacility,
        objects: updatedObjects,
        updatedAt: new Date()
      };
      
      setSelectedFacility(updatedFacility);
      setFacilities(prev => prev.map(f => 
        f.id === updatedFacility.id ? updatedFacility : f
      ));
    }
  };
  //#endregion

  //#region 관리자 레이아웃 변경
  const handleLayoutChange = (layout: import('@/types/facility-editor').FacilityLayout) => {
    if (selectedFacility) {
      const updatedFacility = convertNewToOld(layout, selectedFacility);
      setSelectedFacility(updatedFacility);
    }
  };

  const handleSaveFacility = (layout: import('@/types/facility-editor').FacilityLayout) => {
    if (selectedFacility) {
      const updatedFacility = convertNewToOld(layout, selectedFacility);
      const updatedFacilities = facilities.map(f => 
        f.id === updatedFacility.id ? updatedFacility : f
      );
      setFacilities(updatedFacilities);
      setSelectedFacility(updatedFacility);
      alert(t('편집_저장') + ' ' + t('공통_성공'));
    }
  };
  //#endregion

  //#region 시설 통계 계산
  const calculateStats = (facility: FacilityLayout) => {
    const seats = facility.objects.filter(obj => obj.type === 'seat');
    return {
      totalSeats: seats.length,
      availableSeats: seats.filter(s => s.status === 'available').length,
      occupiedSeats: seats.filter(s => s.status === 'occupied').length,
      reservedSeats: seats.filter(s => s.status === 'reserved').length,
      disabledSeats: seats.filter(s => s.status === 'disabled').length,
    };
  };
  //#endregion

  //#region 시설 목록 렌더링
  const renderFacilityList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground font-multilang">
          시설별 좌석 예약 시스템
        </h1>
        <div className="text-sm text-secondary font-multilang">
          {facilities.length}개의 시설 등록됨
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {facilities.map((facility) => {
          const stats = calculateStats(facility);
          return (
            <div key={facility.id} className="neu-flat p-6 rounded-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg neu-raised bg-primary/10">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground font-multilang">
                    {facility.name}
                  </h3>
                  <p className="text-sm text-secondary font-multilang">
                    {facility.category}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="font-multilang">사용가능: {stats.availableSeats}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="font-multilang">사용중: {stats.occupiedSeats}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="font-multilang">예약됨: {stats.reservedSeats}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="font-multilang">사용불가: {stats.disabledSeats}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedFacility(facility);
                    setCurrentView('reservation');
                  }}
                  className="flex-1 px-4 py-2 rounded-lg neu-raised hover:scale-105 flex items-center justify-center gap-2 font-multilang"
                >
                  <Users className="w-4 h-4" />
                  예약하기
                </button>
                <button
                  onClick={() => {
                    setSelectedFacility(facility);
                    setCurrentView('admin');
                  }}
                  className="px-4 py-2 rounded-lg neu-raised hover:scale-105 flex items-center gap-2 font-multilang"
                >
                  <Settings className="w-4 h-4" />
                  관리
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 예약 현황 */}
      {reservations.length > 0 && (
        <div className="neu-flat p-6 rounded-lg">
          <h2 className="text-xl font-bold text-foreground mb-4 font-multilang">
            최근 예약 현황
          </h2>
          <div className="space-y-3">
            {reservations.slice(-5).map((reservation) => {
              const facility = facilities.find(f => 
                f.objects.some(obj => obj.id === reservation.seatId)
              );
              const seat = facility?.objects.find(obj => obj.id === reservation.seatId);
              
              return (
                <div key={reservation.id} className="flex items-center justify-between p-3 neu-inset rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                       <div className="font-medium font-multilang">
                         {facility?.name} - {seat?.type === 'seat' || seat?.type === 'object' ? seat.name : ''}
                       </div>
                      <div className="text-sm text-secondary font-multilang">
                        {reservation.startTime.toLocaleString('ko-KR')} ~ {reservation.endTime.toLocaleString('ko-KR')}
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium font-multilang">
                    {reservation.status === 'active' ? '활성' : reservation.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
  //#endregion

  //#region 예약 화면 렌더링
  const renderReservationView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCurrentView('list')}
          className="p-2 rounded-lg neu-raised hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-foreground font-multilang">
          {selectedFacility?.name} 예약
        </h1>
      </div>

      {selectedFacility && (
        <SeatReservation
          facility={selectedFacility}
          onReservationComplete={handleReservationComplete}
          onCancel={() => setCurrentView('list')}
        />
      )}
    </div>
  );
  //#endregion

  //#region 관리자 뷰 렌더링
  const renderAdminView = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('list')}
            				className="flex items-center gap-2 px-4 py-2 rounded-lg neu-raised hover:neu-inset bg-serial-0 text-foreground transition-all duration-150"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </button>
          
          <h1 className="text-2xl font-bold text-foreground">
            {selectedFacility?.name} 관리
          </h1>
        </div>

        {editorLayout && (
          <FacilityEditor
            initialLayout={editorLayout}
            onLayoutChange={handleLayoutChange}
            onSave={handleSaveFacility}
          />
        )}
      </div>
    );
  };
  //#endregion

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {currentView === 'list' && renderFacilityList()}
        {currentView === 'reservation' && renderReservationView()}
        {currentView === 'admin' && renderAdminView()}
      </div>
    </div>
  );
} 