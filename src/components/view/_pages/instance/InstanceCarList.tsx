'use client';

import React from 'react';
import { Car, CarFront, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CarInstanceWithCar } from '@/types/instance';

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
        <div className="space-y-3">
          {carInstances.map((carInstance) => (
            <div
              key={carInstance.id}
              onClick={() => handleCarClick(carInstance.car.id)}
              className="flex justify-between items-center p-3 rounded-lg border transition-all cursor-pointer border-border hover:border-primary hover:bg-accent/50"
            >
              <div className="flex-1">
                <div className="flex gap-3 items-center">
                  <div className="flex flex-shrink-0 justify-center items-center w-8 h-8 rounded-full bg-primary/10">
                    <CarFront size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate text-foreground">
                      {carInstance.car.carNumber}
                    </h4>
                    <p className="text-xs truncate text-muted-foreground">
                      {carInstance.car.brand && carInstance.car.model 
                        ? `${carInstance.car.brand} ${carInstance.car.model}`
                        : carInstance.car.brand || carInstance.car.model || '브랜드/모델 없음'
                      }
                    </p>
                    {carInstance.car.outerText && (
                      <p className="text-xs truncate text-muted-foreground">
                        {carInstance.car.outerText}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-center mt-2 ml-11">
                  {carInstance.carShareOnoff && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                      공유차량
                    </span>
                  )}
                  {carInstance.car.fuel && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
                      {carInstance.car.fuel}
                    </span>
                  )}
                  {carInstance.car.year && (
                    <span className="text-xs text-muted-foreground">
                      {carInstance.car.year}년
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight size={16} className="flex-shrink-0 text-muted-foreground" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
