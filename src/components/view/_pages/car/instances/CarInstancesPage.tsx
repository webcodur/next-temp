/* 메뉴 설명: 차량 세대 연결 페이지 */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';

import DetailPageLayout from '@/components/ui/ui-layout/detail-page-layout/DetailPageLayout';
import CarInstanceSection from './CarInstanceSection';
import { searchCars } from '@/services/cars/cars$_GET';
import { CarWithInstance } from '@/types/car';
import { createCarTabs } from '../_shared/carTabs';

export default function CarInstancesPage() {
  const params = useParams();
  const carId = Number(params.id);
  
  // #region 상태 관리
  const [car, setCar] = useState<CarWithInstance | null>(null);
  const [loading, setLoading] = useState(true);
  // #endregion

  // #region 데이터 로드
  const loadCarData = useCallback(async () => {
    if (!carId || isNaN(carId)) {
      return;
    }
    
    setLoading(true);
    try {
      // 특정 차량 상세 정보 조회 (CarWithInstance 포함)
      // carId로 필터링하여 검색
      const result = await searchCars({ page: 1, limit: 100 });
      
      if (result.success && result.data) {
        const foundCar = result.data.data.find(c => c.id === carId);
        
        if (foundCar) {
          setCar(foundCar);
        } else {
          console.error('차량을 찾을 수 없습니다');
        }
      } else {
        console.error('차량 조회 실패:', result.errorMsg);
      }
    } catch (error) {
      console.error('차량 조회 중 오류:', error);
    } finally {
      setLoading(false);
    }
  }, [carId]);

  useEffect(() => {
    loadCarData();
  }, [loadCarData]);
  // #endregion

  // #region 탭 설정
  const tabs = createCarTabs(carId);
  // #endregion

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">차량 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <DetailPageLayout
      title="차량 상세 정보"
      subtitle={`${car.carNumber} ${car.brand ? `- ${car.brand}` : ''} ${car.model || ''}`}
      tabs={tabs}
      activeTabId="instances"
      fallbackPath="/parking/occupancy/car"
    >
      <CarInstanceSection 
        car={car}
        onDataChange={loadCarData}
      />
    </DetailPageLayout>
  );
}
