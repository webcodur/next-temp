'use client';

import React from 'react';
import { Car, CarFront, Calendar, Fuel, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CarInstanceWithCar } from '@/types/instance';
import InfoCard, { InfoCardField, InfoCardBadge } from '@/components/ui/ui-layout/info-card/InfoCard';

interface InstanceCarListProps {
  carInstances?: CarInstanceWithCar[];
  loading?: boolean;
}

export default function InstanceCarList({ 
  carInstances = [], 
  loading = false 
}: InstanceCarListProps) {
  const router = useRouter();

  const handleCarClick = (carId: number) => {
    router.push(`/parking/occupancy/car/${carId}`);
  };

  if (loading) {
    return (
      <div className="p-6 rounded-lg border">
        <div className="flex gap-2 items-center mb-4">
          <Car size={20} className="text-primary" />
          <h3 className="text-lg font-medium">차량 목록</h3>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="text-muted-foreground">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg border">
      <div className="flex gap-2 items-center mb-4">
        <Car size={20} className="text-primary" />
        <h3 className="text-lg font-medium">차량 목록</h3>
        <span className="text-sm text-muted-foreground">({carInstances.length}대)</span>
      </div>

      {carInstances.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-8 text-center">
          <CarFront size={32} className="mb-3 text-muted-foreground" />
          <h4 className="mb-1 text-sm font-medium text-foreground">
            등록된 차량이 없습니다
          </h4>
          <p className="text-xs text-muted-foreground">
            이 호실에 차량을 추가해보세요
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {carInstances.map((carInstance) => {
            // 배지 정보
            const badges: InfoCardBadge[] = [];
            if (carInstance.carShareOnoff) {
              badges.push({
                text: '공유차량',
                variant: 'info'
              });
            }

            // 좌측 열 데이터
            const leftColumn: InfoCardField[] = [
              {
                icon: <Fuel />,
                value: carInstance.car.fuel || '',
                show: !!carInstance.car.fuel
              },
              {
                icon: <Calendar />,
                value: carInstance.car.year ? `${carInstance.car.year}년` : '',
                show: !!carInstance.car.year
              }
            ];

            // 우측 열 데이터
            const rightColumn: InfoCardField[] = [];

            // 외부 스티커가 있으면 우측 열에 추가
            if (carInstance.car.externalSticker) {
              rightColumn.push({
                icon: <Tag />,
                value: carInstance.car.externalSticker,
                show: true
              });
            }

            // 커스텀 제목 (번호판 + 브랜드/모델/차종)
            const customTitle = (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span 
                  className="text-lg font-bold tracking-wider text-foreground"
                  style={{ fontFamily: 'HY헤드라인M, monospace' }}
                >
                  {carInstance.car.carNumber || '번호판 없음'}
                </span>
                {(carInstance.car.brand || carInstance.car.model || carInstance.car.type) && (
                  <span className="text-sm text-muted-foreground truncate">
                    {[carInstance.car.brand, carInstance.car.model, carInstance.car.type]
                      .filter(Boolean)
                      .join(' ')}
                  </span>
                )}
              </div>
            );

            return (
              <InfoCard
                key={carInstance.id}
                headerIcon={<CarFront />}
                title="" // customTitle을 사용하므로 빈 문자열
                customTitle={customTitle}
                badges={badges}
                leftColumn={leftColumn}
                rightColumn={rightColumn}
                memo={carInstance.car.outerText || undefined}
                onClick={() => handleCarClick(carInstance.car.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
