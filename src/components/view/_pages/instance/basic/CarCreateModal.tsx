'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import CarForm, { CarFormData } from '../../car/basic/CarForm';
import { createCar } from '@/services/cars/cars_POST';
import { createCarInstance } from '@/services/cars/cars_instances_POST';

interface CarCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  instanceId: number;
  onSuccess: () => void;
}

const initialFormData: CarFormData = {
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
};

export default function CarCreateModal({
  isOpen,
  onClose,
  instanceId,
  onSuccess,
}: CarCreateModalProps) {
  const [formData, setFormData] = useState<CarFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 폼 유효성 검사
  const isValid = formData.carNumber.trim() !== '';
  const hasChanges = Object.values(formData).some(value => value.trim() !== '');

  const handleFormChange = (data: CarFormData) => {
    setFormData(data);
    // 에러 메시지 초기화
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async () => {
    if (!isValid) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // 1단계: 새 차량 생성
      const createResult = await createCar({
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
      });

      if (!createResult.success) {
        setErrorMessage(createResult.errorMsg || '차량 생성에 실패했습니다.');
        return;
      }

      // 2단계: 차량을 인스턴스에 연결
      const connectResult = await createCarInstance({
        carNumber: formData.carNumber,
        instanceId: instanceId,
        carShareOnoff: false, // 기본값
      });

      if (!connectResult.success) {
        setErrorMessage(connectResult.errorMsg || '차량 연결에 실패했습니다.');
        return;
      }

      // 성공 처리
      handleReset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('차량 생성 중 오류:', error);
      setErrorMessage('차량 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrorMessage('');
  };

  const handleClose = () => {
    if (!isSubmitting) {
      handleReset();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="새 차량 생성하여 세대 연결"
      size="xl"
    >
      <div className="space-y-4">
        {/* 에러 메시지 */}
        {errorMessage && (
          <div className="p-4 bg-red-50 rounded-md border border-red-200">
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        )}

        {/* 차량 폼 */}
        <div className="max-h-[70vh] overflow-y-auto">
          <CarForm
            mode="create"
            data={formData}
            onChange={handleFormChange}
            disabled={isSubmitting}
            showActions={true}
            onReset={handleReset}
            onSubmit={handleSubmit}
            hasChanges={hasChanges}
            isValid={isValid}
            title="차량 기본 정보"
            subtitle="차량의 기본 정보를 생성하여 현재 세대에 바로 연결합니다."
          />
        </div>

        {/* 하단 버튼 - CarForm의 showActions가 false일 때 사용 */}
        {/* <div className="flex gap-3 justify-end pt-4 border-t border-border">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm rounded-md border border-border text-muted-foreground hover:bg-muted disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="px-4 py-2 text-sm text-white rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? '생성 중...' : '생성'}
          </button>
        </div> */}
      </div>
    </Modal>
  );
}
