/* 메뉴 설명: 차량 상세 페이지 */
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import Tabs from '@/components/ui/ui-layout/tabs/Tabs';
import CarForm, { CarFormData } from './CarForm';
import CarInstanceSection from './CarInstanceSection';
import CarResidentSection from './CarResidentSection';
import { searchCars } from '@/services/cars/cars$_GET';
import { updateCar } from '@/services/cars/cars@id_PATCH';
import { deleteCar } from '@/services/cars/cars@id_DELETE';
import { CarWithInstance } from '@/types/car';

export default function CarDetailPage() {  
  const router = useRouter();
  const params = useParams();
  const carId = Number(params.id);
  
  // #region 상태 관리
  const [car, setCar] = useState<CarWithInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
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
  const [originalData, setOriginalData] = useState<CarFormData>({
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
  
  // 모달 상태
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  // #endregion

  // #region 탭 설정
  const tabs = [
    {
      id: 'basic',
      label: '기본 정보',
    },
    {
      id: 'instances',
      label: '호실 연결',
    },
    {
      id: 'residents',
      label: '거주자 연결',
    },
  ];
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
          
          const initialData = {
            carNumber: foundCar.carNumber,
            brand: foundCar.brand || '',
            model: foundCar.model || '',
            type: foundCar.type || '',
            outerText: foundCar.outerText || '',
            year: foundCar.year?.toString() || '',
            externalSticker: foundCar.externalSticker || '',
            fuel: foundCar.fuel || '',
            frontImageUrl: foundCar.frontImageUrl || '',
            rearImageUrl: foundCar.rearImageUrl || '',
            sideImageUrl: foundCar.sideImageUrl || '',
            topImageUrl: foundCar.topImageUrl || '',
          };
          setFormData(initialData);
          setOriginalData(initialData);
        } else {
          console.error('차량을 찾을 수 없음');
          setModalMessage(`차량 정보를 찾을 수 없습니다.`);
          setErrorModalOpen(true);
          setTimeout(() => {
            router.push('/parking/occupancy/car');
          }, 2000);
        }
      } else {
        console.error('차량 조회 실패:', result.errorMsg);
        setModalMessage(`차량 정보를 불러올 수 없습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
        setTimeout(() => {
          router.push('/parking/occupancy/car');
        }, 2000);
      }
    } catch (error) {
      console.error('차량 조회 중 오류:', error);
      setModalMessage('차량 정보를 불러오는 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
      setTimeout(() => {
        router.push('/parking/occupancy/car');
      }, 2000);
    } finally {
      setLoading(false);
    }
  }, [carId, router]);

  useEffect(() => {
    loadCarData();
  }, [loadCarData]);
  // #endregion

  // #region 변경 감지
  const hasChanges = useMemo(() => {
    return (
      formData.carNumber !== originalData.carNumber ||
      formData.brand !== originalData.brand ||
      formData.model !== originalData.model ||
      formData.type !== originalData.type ||
      formData.outerText !== originalData.outerText ||
      formData.year !== originalData.year ||
      formData.externalSticker !== originalData.externalSticker ||
      formData.fuel !== originalData.fuel ||
      formData.frontImageUrl !== originalData.frontImageUrl ||
      formData.rearImageUrl !== originalData.rearImageUrl ||
      formData.sideImageUrl !== originalData.sideImageUrl ||
      formData.topImageUrl !== originalData.topImageUrl
    );
  }, [formData, originalData]);

  const isValid = useMemo(() => {
    if (!hasChanges) return false;
    
    return Boolean(formData.carNumber.trim());
  }, [formData, hasChanges]);
  // #endregion

  // #region 핸들러
  const handleBack = () => {
    if (hasChanges) {
      const confirmMessage = '수정된 내용이 있습니다. 정말로 나가시겠습니까?';
      if (!confirm(confirmMessage)) return;
    }
    router.push('/parking/occupancy/car');
  };

  const handleFormChange = useCallback((data: CarFormData) => {
    setFormData(data);
  }, []);

  const handleReset = useCallback(() => {
    if (!hasChanges) return;
    
    const confirmMessage = '수정된 내용을 모두 되돌리시겠습니까?';
    if (!confirm(confirmMessage)) return;
    
    setFormData(originalData);
  }, [hasChanges, originalData]);

  const handleSubmit = useCallback(async () => {
    if (!car || !isValid || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const updateData: {
        brand?: string;
        model?: string;
        type?: string;
        outerText?: string;
        year?: number;
        externalSticker?: string;
        fuel?: string;
        frontImageUrl?: string;
        rearImageUrl?: string;
        sideImageUrl?: string;
        topImageUrl?: string;
      } = {};
      
      // 변경된 필드만 포함 (차량번호는 수정 불가)
      if (formData.brand !== originalData.brand) updateData.brand = formData.brand || undefined;
      if (formData.model !== originalData.model) updateData.model = formData.model || undefined;
      if (formData.type !== originalData.type) updateData.type = formData.type || undefined;
      if (formData.outerText !== originalData.outerText) updateData.outerText = formData.outerText || undefined;
      if (formData.year !== originalData.year) updateData.year = formData.year ? parseInt(formData.year) : undefined;
      if (formData.externalSticker !== originalData.externalSticker) updateData.externalSticker = formData.externalSticker || undefined;
      if (formData.fuel !== originalData.fuel) updateData.fuel = formData.fuel || undefined;
      if (formData.frontImageUrl !== originalData.frontImageUrl) updateData.frontImageUrl = formData.frontImageUrl || undefined;
      if (formData.rearImageUrl !== originalData.rearImageUrl) updateData.rearImageUrl = formData.rearImageUrl || undefined;
      if (formData.sideImageUrl !== originalData.sideImageUrl) updateData.sideImageUrl = formData.sideImageUrl || undefined;
      if (formData.topImageUrl !== originalData.topImageUrl) updateData.topImageUrl = formData.topImageUrl || undefined;

      const result = await updateCar(car.id, updateData);

      if (result.success) {
        // 성공 시 원본 데이터 업데이트
        const newData = { ...formData };
        setOriginalData(newData);
        setFormData(newData);
        
        // 데이터 다시 로드
        await loadCarData();
        
        setModalMessage('차량 정보가 성공적으로 수정되었습니다.');
        setSuccessModalOpen(true);
      } else {
        console.error('차량 수정 실패:', result.errorMsg);
        setModalMessage(`차량 수정에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('차량 수정 중 오류:', error);
      setModalMessage('차량 수정 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [car, isValid, isSubmitting, formData, originalData, loadCarData]);

  const handleDelete = useCallback(() => {
    setDeleteConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!car) return;
    try {
      const result = await deleteCar(car.id);
      if (result.success) {
        setModalMessage('차량이 성공적으로 삭제되었습니다.');
        setSuccessModalOpen(true);
        setTimeout(() => {
          router.push('/parking/occupancy/car');
        }, 1500);
      } else {
        setModalMessage(`차량 삭제에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('차량 삭제 중 오류:', error);
      setModalMessage('차량 삭제 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setDeleteConfirmOpen(false);
    }
  }, [car, router]);
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
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title="차량 상세 정보"
        subtitle={`${car.carNumber} ${car.brand ? `- ${car.brand}` : ''} ${car.model || ''}`}
        leftActions={
          <Button
            variant="secondary"
            size="default"
            onClick={handleBack}
            title="목록으로"
          >
            <ArrowLeft size={16} />
            목록
          </Button>
        }
      />

      {/* 탭과 콘텐츠 */}
      <div className="flex flex-col">
        <Tabs
          tabs={tabs}
          activeId={activeTab}
          onTabChange={setActiveTab}
        />

        {/* 콘텐츠 영역 */}
        <div className="p-6 rounded-b-lg border-b-2 border-s-2 border-e-2 border-border bg-background">
          {activeTab === 'basic' && (
            <CarForm
              mode="edit"
              car={car}
              data={formData}
              onChange={handleFormChange}
              disabled={isSubmitting}
              showActions={true}
              onReset={handleReset}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              hasChanges={hasChanges}
              isValid={isValid}
            />
          )}
          
          {activeTab === 'instances' && (
            <CarInstanceSection 
              car={car}
              onDataChange={loadCarData}
            />
          )}
          
          {activeTab === 'residents' && (
            <CarResidentSection 
              car={car}
              onDataChange={loadCarData}
            />
          )}
        </div>
      </div>

      {/* 성공 모달 */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="작업 완료"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-600 mb-2">성공</h3>
            <p className="text-muted-foreground">{modalMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setSuccessModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>

      {/* 오류 모달 */}
      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="차량 삭제 확인"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 삭제하시겠습니까?</h3>
            <p className="text-muted-foreground">이 작업은 되돌릴 수 없습니다. 차량 정보가 영구적으로 삭제됩니다.</p>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)}>취소</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>삭제</Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        title="오류 발생"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">오류</h3>
            <p className="text-muted-foreground">{modalMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setErrorModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
