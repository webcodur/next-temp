'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { SimpleNumberInput } from '@/components/ui/ui-input/simple-input/SimpleNumberInput';
import type { Car, CreateCarRequest, UpdateCarRequest } from '@/types/car';

// #region 타입 정의
export type VehicleFormMode = 'create' | 'edit' | 'view';

export interface VehicleFormData {
  carNumber: string;
  brand: string;
  model: string;
  type: string;
  outerText: string;
  year: number | '';
  externalSticker: string;
  fuel: string;
  inOutStatus: 'IN' | 'OUT' | '';
  lastParkingDeviceId: number | '';
  frontImageUrl: string;
  rearImageUrl: string;
  sideImageUrl: string;
  topImageUrl: string;
}

interface VehicleFormProps {
  mode: VehicleFormMode;
  data?: Car;
  onSubmit?: (data: CreateCarRequest | UpdateCarRequest) => void;
  onCancel?: () => void;
  onChange?: (data: VehicleFormData) => void;
  loading?: boolean;
  disabled?: boolean;
}
// #endregion

export default function VehicleForm({
  mode = 'create',
  data,
  onSubmit,
  onCancel,
  onChange,
  loading = false,
  disabled = false
}: VehicleFormProps) {
  // #region 상태 관리
  const [formData, setFormData] = useState<VehicleFormData>({
    carNumber: '',
    brand: '',
    model: '',
    type: '',
    outerText: '',
    year: '',
    externalSticker: '',
    fuel: '',
    inOutStatus: '',
    lastParkingDeviceId: '',
    frontImageUrl: '',
    rearImageUrl: '',
    sideImageUrl: '',
    topImageUrl: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  // #endregion

  // #region 데이터 초기화
  useEffect(() => {
    if (data && (mode === 'edit' || mode === 'view')) {
      setFormData({
        carNumber: data.carNumber || '',
        brand: data.brand || '',
        model: data.model || '',
        type: data.type || '',
        outerText: data.outerText || '',
        year: data.year || '',
        externalSticker: data.externalSticker || '',
        fuel: data.fuel || '',
        inOutStatus: data.inOutStatus || '',
        lastParkingDeviceId: data.lastParkingDeviceId || '',
        frontImageUrl: data.frontImageUrl || '',
        rearImageUrl: data.rearImageUrl || '',
        sideImageUrl: data.sideImageUrl || '',
        topImageUrl: data.topImageUrl || ''
      });
    }
  }, [data, mode]);
  // #endregion

  // #region 폼 핸들러
  const handleInputChange = useCallback((field: keyof VehicleFormData, value: string | number) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    
    setFormData(updatedData);
    
    // 부모 컴포넌트에 변경사항 알림
    onChange?.(updatedData);
    
    // 에러 메시지 제거
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [formData, onChange, errors]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.carNumber.trim()) {
      newErrors.carNumber = '차량번호는 필수입니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (mode === 'view' || !onSubmit) return;
    
    if (!validateForm()) return;

    if (mode === 'create') {
      const submitData: CreateCarRequest = {
        carNumber: formData.carNumber.trim(),
        brand: formData.brand.trim() || undefined,
        model: formData.model.trim() || undefined,
        type: formData.type.trim() || undefined,
        outerText: formData.outerText.trim() || undefined,
        year: formData.year ? Number(formData.year) : undefined,
        externalSticker: formData.externalSticker.trim() || undefined,
        fuel: formData.fuel.trim() || undefined,
        inOutStatus: formData.inOutStatus as 'IN' | 'OUT' | undefined,
        lastParkingDeviceId: formData.lastParkingDeviceId ? Number(formData.lastParkingDeviceId) : undefined,
        frontImageUrl: formData.frontImageUrl.trim() || undefined,
        rearImageUrl: formData.rearImageUrl.trim() || undefined,
        sideImageUrl: formData.sideImageUrl.trim() || undefined,
        topImageUrl: formData.topImageUrl.trim() || undefined
      };
      onSubmit(submitData);
    } else {
      const submitData: UpdateCarRequest = {
        carNumber: formData.carNumber.trim(),
        brand: formData.brand.trim() || undefined,
        model: formData.model.trim() || undefined,
        type: formData.type.trim() || undefined,
        outerText: formData.outerText.trim() || undefined,
        year: formData.year ? Number(formData.year) : undefined,
        externalSticker: formData.externalSticker.trim() || undefined,
        fuel: formData.fuel.trim() || undefined,
        inOutStatus: formData.inOutStatus as 'IN' | 'OUT' | undefined,
        lastParkingDeviceId: formData.lastParkingDeviceId ? Number(formData.lastParkingDeviceId) : undefined,
        frontImageUrl: formData.frontImageUrl.trim() || undefined,
        rearImageUrl: formData.rearImageUrl.trim() || undefined,
        sideImageUrl: formData.sideImageUrl.trim() || undefined,
        topImageUrl: formData.topImageUrl.trim() || undefined
      };
      onSubmit(submitData);
    }
  };
  // #endregion

  // #region 선택 옵션 정의
  const brandOptions = useMemo(() => [
    { value: '', label: '선택하세요' },
    { value: '현대', label: '현대' },
    { value: '기아', label: '기아' },
    { value: '제네시스', label: '제네시스' },
    { value: '삼성', label: '삼성' },
    { value: '쌍용', label: '쌍용' },
    { value: '한국GM', label: '한국GM' },
    { value: '르노삼성', label: '르노삼성' },
    { value: '벤츠', label: '벤츠' },
    { value: 'BMW', label: 'BMW' },
    { value: '아우디', label: '아우디' },
    { value: '토요타', label: '토요타' },
    { value: '혼다', label: '혼다' },
    { value: '니산', label: '니산' },
    { value: '기타', label: '기타' }
  ], []);

  const vehicleTypeOptions = useMemo(() => [
    { value: '', label: '선택하세요' },
    { value: '승용차', label: '승용차' },
    { value: 'SUV', label: 'SUV' },
    { value: '트럭', label: '트럭' },
    { value: '승합차', label: '승합차' },
    { value: '오토바이', label: '오토바이' },
    { value: '기타', label: '기타' }
  ], []);

  const fuelOptions = useMemo(() => [
    { value: '', label: '선택하세요' },
    { value: '가솔린', label: '가솔린' },
    { value: '디젤', label: '디젤' },
    { value: '하이브리드', label: '하이브리드' },
    { value: '전기', label: '전기' },
    { value: 'LPG', label: 'LPG' },
    { value: '기타', label: '기타' }
  ], []);

  const statusOptions = useMemo(() => [
    { value: '', label: '선택하세요' },
    { value: 'IN', label: '입차' },
    { value: 'OUT', label: '출차' }
  ], []);
  // #endregion

  // #region 읽기 전용 여부
  const isReadOnly = mode === 'view' || disabled;
  // #endregion

  // #region 폼 필드 정의
  const formFields = useMemo(() => [
    {
      label: '차량번호',
      required: true,
      content: (
        <SimpleTextInput
          placeholder="예: 12가1234"
          value={formData.carNumber}
          onChange={(value) => handleInputChange('carNumber', value)}
          disabled={isReadOnly || (mode === 'edit')} // 편집 시에도 차량번호는 수정 불가
        />
      )
    },
    {
      label: '제조사',
      content: (
        <SimpleDropdown
          options={brandOptions}
          value={formData.brand}
          onChange={(value) => handleInputChange('brand', value)}
          disabled={isReadOnly}
          placeholder="제조사를 선택하세요"
        />
      )
    },
    {
      label: '모델',
      content: (
        <SimpleTextInput
          placeholder="모델명을 입력하세요"
          value={formData.model}
          onChange={(value) => handleInputChange('model', value)}
          disabled={isReadOnly}
        />
      )
    },
    {
      label: '차종',
      content: (
        <SimpleDropdown
          options={vehicleTypeOptions}
          value={formData.type}
          onChange={(value) => handleInputChange('type', value)}
          disabled={isReadOnly}
          placeholder="차종을 선택하세요"
        />
      )
    },
    {
      label: '연식',
      content: (
        <SimpleNumberInput
          placeholder="예: 2023"
          value={formData.year ? Number(formData.year) : undefined}
          onChange={(value) => handleInputChange('year', value || '')}
          disabled={isReadOnly}
          min={1900}
          max={new Date().getFullYear() + 1}
        />
      )
    },
    {
      label: '연료',
      content: (
        <SimpleDropdown
          options={fuelOptions}
          value={formData.fuel}
          onChange={(value) => handleInputChange('fuel', value)}
          disabled={isReadOnly}
          placeholder="연료 종류를 선택하세요"
        />
      )
    },
    {
      label: '외부 텍스트',
      content: (
        <SimpleTextInput
          placeholder="차량 외부 표시 텍스트"
          value={formData.outerText}
          onChange={(value) => handleInputChange('outerText', value)}
          disabled={isReadOnly}
        />
      )
    },
    {
      label: '외부 스티커',
      content: (
        <SimpleTextInput
          placeholder="외부 스티커 정보"
          value={formData.externalSticker}
          onChange={(value) => handleInputChange('externalSticker', value)}
          disabled={isReadOnly}
        />
      )
    },
    ...(mode === 'view' ? [{
      label: '입출차 상태',
      content: (
        <SimpleDropdown
          options={statusOptions}
          value={formData.inOutStatus}
          onChange={(value) => handleInputChange('inOutStatus', value)}
          disabled={true}
          placeholder="상태"
        />
      )
    }] : []),
    {
      label: '정면 이미지 URL',
      content: (
        <SimpleTextInput
          placeholder="https://example.com/front.jpg"
          value={formData.frontImageUrl}
          onChange={(value) => handleInputChange('frontImageUrl', value)}
          disabled={isReadOnly}
        />
      )
    },
    {
      label: '후면 이미지 URL',
      content: (
        <SimpleTextInput
          placeholder="https://example.com/rear.jpg"
          value={formData.rearImageUrl}
          onChange={(value) => handleInputChange('rearImageUrl', value)}
          disabled={isReadOnly}
        />
      )
    },
    {
      label: '측면 이미지 URL',
      content: (
        <SimpleTextInput
          placeholder="https://example.com/side.jpg"
          value={formData.sideImageUrl}
          onChange={(value) => handleInputChange('sideImageUrl', value)}
          disabled={isReadOnly}
        />
      )
    },
    {
      label: '상단 이미지 URL',
      content: (
        <SimpleTextInput
          placeholder="https://example.com/top.jpg"
          value={formData.topImageUrl}
          onChange={(value) => handleInputChange('topImageUrl', value)}
          disabled={isReadOnly}
        />
      )
    },
    ...(mode === 'view' && data ? [
      {
        label: '총 이용 횟수',
        content: (
          <SimpleTextInput
            value={data.totalUseNumber?.toString() || '0'}
            disabled={true}
          />
        )
      },
      {
        label: '등록일',
        content: (
          <SimpleTextInput
            value={new Date(data.createdAt).toLocaleString('ko-KR')}
            disabled={true}
          />
        )
      },
      {
        label: '수정일',
        content: (
          <SimpleTextInput
            value={new Date(data.updatedAt).toLocaleString('ko-KR')}
            disabled={true}
          />
        )
      }
    ] : [])
  ], [formData, isReadOnly, mode, data, brandOptions, vehicleTypeOptions, fuelOptions, statusOptions, handleInputChange]);
  // #endregion

  return (
    <div className="p-6 rounded-lg border bg-card border-border">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {formFields.map((field, index) => (
          <div key={index} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="ml-1 text-red-500">*</span>}
            </label>
            {field.content}
          </div>
        ))}
      </div>
      
      {mode !== 'view' && (
        <div className="flex gap-3 justify-end mt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md border border-gray-300 hover:bg-gray-200 disabled:opacity-50"
            >
              취소
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || disabled}
            className="px-4 py-2 text-sm font-medium text-white rounded-md border border-transparent bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? '처리 중...' : (mode === 'create' ? '차량 생성' : '저장')}
          </button>
        </div>
      )}
    </div>
  );
}