'use client';

import React from 'react';
import { Eraser, RotateCcw, Car as CarIcon } from 'lucide-react';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleNumberInput } from '@/components/ui/ui-input/simple-input/SimpleNumberInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { SimpleDatePicker } from '@/components/ui/ui-input/simple-input/time/SimpleDatePicker';
import { Button } from '@/components/ui/ui-input/button/Button';
import { CrudButton } from '@/components/ui/ui-input/crud-button/CrudButton';
import { Car } from '@/types/car';

export interface CarFormData {
  carNumber: string;
  brand: string;
  model: string;
  type: string;
  outerText: string;
  year: string;
  externalSticker: string;
  fuel: string;
  frontImageUrl: string;
  rearImageUrl: string;
  sideImageUrl: string;
  topImageUrl: string;
}

interface CarFormProps {
  mode: 'create' | 'edit';
  car?: Car | null;
  data: CarFormData;
  onChange: (data: CarFormData) => void;
  disabled?: boolean;
  showActions?: boolean;
  onReset?: () => void;
  onSubmit?: () => void;
  onDelete?: () => void;
  hasChanges?: boolean;
  isValid?: boolean;
}

const CAR_TYPE_OPTIONS = [
  { value: 'SEDAN', label: '세단' },
  { value: 'SUV', label: 'SUV' },
  { value: 'HATCHBACK', label: '해치백' },
  { value: 'COUPE', label: '쿠페' },
  { value: 'CONVERTIBLE', label: '컨버터블' },
  { value: 'TRUCK', label: '트럭' },
  { value: 'VAN', label: '밴' },
  { value: 'OTHER', label: '기타' },
];

const FUEL_OPTIONS = [
  { value: 'GASOLINE', label: '휘발유' },
  { value: 'DIESEL', label: '경유' },
  { value: 'HYBRID', label: '하이브리드' },
  { value: 'ELECTRIC', label: '전기' },
  { value: 'LPG', label: 'LPG' },
  { value: 'OTHER', label: '기타' },
];

const CarForm: React.FC<CarFormProps> = ({
  mode,
  car,
  data,
  onChange,
  disabled = false,
  showActions = false,
  onReset,
  onSubmit,
  onDelete,
  hasChanges = false,
  isValid = false,
}) => {
  const isReadOnly = disabled;

  const handleFieldChange = (field: keyof CarFormData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  // 유틸/액션 버튼 구성
  const handleClearAllFields = () => {
    onChange({
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
  };

  const bottomLeftActions = showActions
    ? (
      mode === 'create'
        ? (
          <Button
            variant="outline"
            size="default"
            onClick={handleClearAllFields}
            disabled={disabled}
            title="모든 입력 필드를 비웁니다"
            icon={Eraser}
          >
            초기화
          </Button>
        )
        : mode === 'edit'
          ? (
            <Button
              variant="secondary"
              size="default"
              onClick={onReset}
              disabled={!hasChanges || disabled}
              title={!hasChanges ? '변경사항이 없습니다' : '폼 로딩 시점의 값으로 복구합니다'}
              icon={RotateCcw}
            >
              복구
            </Button>
          )
          : null
    )
    : null;

  const bottomRightActions = showActions
    ? (
      mode === 'create'
        ? (
          <CrudButton
            action="save"
            size="default"
            onClick={onSubmit}
            disabled={!isValid || disabled}
            title={disabled ? '저장 중...' : !isValid ? '필수 항목을 입력해주세요' : '저장'}
          />
        )
        : mode === 'edit'
          ? (
            <div className="flex gap-3">
              {onDelete && (
                <CrudButton
                  action="delete"
                  size="default"
                  onClick={onDelete}
                  disabled={disabled}
                  title="상세 항목을 삭제합니다"
                />
              )}
              <CrudButton
                action="save"
                size="default"
                onClick={onSubmit}
                disabled={!isValid || disabled}
                title={disabled ? '저장 중...' : !isValid ? '필수 항목을 입력해주세요' : '저장'}
              />
            </div>
          )
          : null
    )
    : null;

  // 폼 필드 정의
  const baseFields: GridFormFieldSchema[] = [
    {
      id: 'carNumber',
      label: '차량번호',
      required: true,
      rules: '번호판 형식 (예: 12가1234)',
      component: (
        <SimpleTextInput
          value={data.carNumber}
          onChange={(value) => handleFieldChange('carNumber', value)}
          placeholder="차량번호"
          disabled={isReadOnly}
          validationRule={{ type: 'free', mode: mode }}
        />
      )
    },
    {
      id: 'brand',
      label: '브랜드',
      rules: '자동차 제조사명',
      component: (
        <SimpleTextInput
          value={data.brand}
          onChange={(value) => handleFieldChange('brand', value)}
          placeholder="브랜드"
          disabled={isReadOnly}
          validationRule={{ type: 'free', mode: mode }}
        />
      )
    },
    {
      id: 'model',
      label: '모델',
      rules: '차량 모델명',
      component: (
        <SimpleTextInput
          value={data.model}
          onChange={(value) => handleFieldChange('model', value)}
          placeholder="모델"
          disabled={isReadOnly}
          validationRule={{ type: 'free', mode: mode }}
        />
      )
    },
    {
      id: 'type',
      label: '차종',
      rules: '차량 유형 선택',
      component: (
        <SimpleDropdown
          value={data.type}
          onChange={(value) => handleFieldChange('type', value)}
          options={CAR_TYPE_OPTIONS}
          placeholder="차종을 선택하세요"
          disabled={isReadOnly}
          validationRule={{ type: 'free', mode: mode }}
        />
      )
    },
    {
      id: 'year',
      label: '연식',
      rules: '4자리 연도 (예: 2023)',
      component: (
        <SimpleNumberInput
          value={data.year ? parseInt(data.year) : ''}
          onChange={(value) => handleFieldChange('year', value.toString())}
          placeholder="연식"
          disabled={isReadOnly}
          min={1900}
          max={2050}
        />
      )
    },
    {
      id: 'fuel',
      label: '연료',
      rules: '연료 타입 선택',
      component: (
        <SimpleDropdown
          value={data.fuel}
          onChange={(value) => handleFieldChange('fuel', value)}
          options={FUEL_OPTIONS}
          placeholder="연료를 선택하세요"
          disabled={isReadOnly}
          validationRule={{ type: 'free', mode: mode }}
        />
      )
    },
    {
      id: 'outerText',
      label: '외부 텍스트',
      rules: '차량 외부 표시 텍스트',
      component: (
        <SimpleTextInput
          value={data.outerText}
          onChange={(value) => handleFieldChange('outerText', value)}
          placeholder="외부 텍스트"
          disabled={isReadOnly}
          validationRule={{ type: 'free', mode: mode }}
        />
      )
    },
    {
      id: 'externalSticker',
      label: '외부 스티커',
      rules: '차량 외부 스티커 정보',
      component: (
        <SimpleTextInput
          value={data.externalSticker}
          onChange={(value) => handleFieldChange('externalSticker', value)}
          placeholder="외부 스티커"
          disabled={isReadOnly}
          validationRule={{ type: 'free', mode: mode }}
        />
      )
    },
    {
      id: 'frontImageUrl',
      label: '전면 이미지 URL',
      rules: '유효한 URL 형식',
      component: (
        <SimpleTextInput
          value={data.frontImageUrl}
          onChange={(value) => handleFieldChange('frontImageUrl', value)}
          placeholder="전면 이미지 URL"
          disabled={isReadOnly}
          validationRule={{ type: 'free', mode: mode }}
        />
      )
    },
    {
      id: 'rearImageUrl',
      label: '후면 이미지 URL',
      rules: '유효한 URL 형식',
      component: (
        <SimpleTextInput
          value={data.rearImageUrl}
          onChange={(value) => handleFieldChange('rearImageUrl', value)}
          placeholder="후면 이미지 URL"
          disabled={isReadOnly}
          validationRule={{ type: 'free', mode: mode }}
        />
      )
    },
    {
      id: 'sideImageUrl',
      label: '측면 이미지 URL',
      rules: '유효한 URL 형식',
      component: (
        <SimpleTextInput
          value={data.sideImageUrl}
          onChange={(value) => handleFieldChange('sideImageUrl', value)}
          placeholder="측면 이미지 URL"
          disabled={isReadOnly}
          validationRule={{ type: 'free', mode: mode }}
        />
      )
    },
    {
      id: 'topImageUrl',
      label: '상단 이미지 URL',
      rules: '유효한 URL 형식',
      component: (
        <SimpleTextInput
          value={data.topImageUrl}
          onChange={(value) => handleFieldChange('topImageUrl', value)}
          placeholder="상단 이미지 URL"
          disabled={isReadOnly}
          validationRule={{ type: 'free', mode: mode }}
        />
      )
    }
  ];

  // edit 모드 전용 필드
  const editFields: GridFormFieldSchema[] = mode === 'edit' && car ? [
    {
      id: 'createdAt',
      label: '등록일자',
      rules: '시스템 자동 기록',
      component: (
        <SimpleDatePicker
          value={car.createdAt}
          onChange={() => {}}
          disabled={true}
          dateFormat="yyyy-MM-dd"
          showTimeSelect={false}
          utcMode={true}
        />
      )
    },
    {
      id: 'updatedAt',
      label: '수정일자',
      rules: '시스템 자동 기록',
      component: (
        <SimpleDatePicker
          value={car.updatedAt}
          onChange={() => {}}
          disabled={true}
          dateFormat="yyyy-MM-dd"
          showTimeSelect={false}
          utcMode={true}
        />
      )
    }
  ] : [];

  const fields = [...baseFields, ...editFields];

  return (
    <SectionPanel 
      title="차량 기본 정보"
      subtitle="차량의 기본 정보를 관리합니다."
      icon={<CarIcon size={18} />}
    >
      <GridFormAuto 
        fields={fields}
        gap="16px"
        bottomLeftActions={bottomLeftActions}
        bottomRightActions={bottomRightActions}
      />
    </SectionPanel>
  );
};

export default CarForm;
