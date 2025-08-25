/* 메뉴 설명: 차량 생성 페이지 */
'use client';

import React, { useState, useMemo } from 'react';
import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import CarForm, { CarFormData } from './basic/CarForm';
import { createCar } from '@/services/cars/cars_POST';

export default function CarCreatePage() {
  const router = useRouter();
  
  // #region 폼 상태
  const [formData, setFormData] = useState<CarFormData>({
    carNumber: '',
    brand: '',
    model: '',
    type: '',
    outerText: '',
    year: '',
    externalSticker: '',
    fuel: '',
    frontImageUrl: '',
    rearImageUrl: '',
    sideImageUrl: '',
    topImageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 에러 모달 제거됨
  // #endregion

  // #region 검증
  const isValid = useMemo(() => {
    return formData.carNumber.trim() !== '';
  }, [formData]);
  // #endregion

  // #region 이벤트 핸들러
  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const createData = {
        carNumber: formData.carNumber,
        brand: formData.brand || undefined,
        model: formData.model || undefined,
        type: formData.type || undefined,
        outerText: formData.outerText || undefined,
        year: formData.year ? parseInt(formData.year) : undefined,
        externalSticker: formData.externalSticker || undefined,
        fuel: formData.fuel || undefined,
        frontImageUrl: formData.frontImageUrl || undefined,
        rearImageUrl: formData.rearImageUrl || undefined,
        sideImageUrl: formData.sideImageUrl || undefined,
        topImageUrl: formData.topImageUrl || undefined,
      };

      const result = await createCar(createData);

      if (result.success) {
        // 성공 시 목록 페이지로 이동
        router.push('/parking/occupancy/car');
      } else {
        // 에러 처리
        console.error('차량 생성 실패:', '대상 작업에 실패했습니다.');
      }
    } catch (error) {
      console.error('차량 생성 중 오류:', error);
      // 에러 처리는 통합 모듈에서 담당
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (data: CarFormData) => {
    setFormData(data);
  };
  // #endregion

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title="차량 추가"
        subtitle="새로운 차량을 등록합니다"
      />

      {/* 폼 섹션 */}
      <div className="p-6 rounded-lg border bg-card border-border">
        <CarForm
          mode="create"
          data={formData}
          onChange={handleFormChange}
          disabled={isSubmitting}
        />
      </div>

      {/* 저장 버튼 - 우하단 고정 */}
      <div className="fixed right-6 bottom-6 z-50">
        <Button 
          variant="primary"
          size="lg"
          onClick={handleSubmit} 
          disabled={!isValid || isSubmitting}
          title={isSubmitting ? '생성 중...' : '생성'}
          className="shadow-lg"
        >
          <Save size={20} />
          {isSubmitting ? '생성 중...' : '생성'}
        </Button>
      </div>

      {/* 오류 모달 제거됨 - 통합 모듈에서 처리 */}
    </div>
  );
}
