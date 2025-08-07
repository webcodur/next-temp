'use client';

import React from 'react';
import { RotateCcw, Send } from 'lucide-react';
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { Button } from '@/components/ui/ui-input/button/Button';
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

  // 액션 버튼들 정의
  const bottomRightActions = showActions ? (
    <div className="flex gap-3">
      <Button 
        variant="secondary" 
        size="default"
        onClick={onReset} 
        disabled={!hasChanges || disabled}
        title={!hasChanges ? '변경사항이 없습니다' : '변경사항 되돌리기'}
      >
        <RotateCcw size={16} />
        복구
      </Button>
      <Button 
        variant="primary" 
        size="default"
        onClick={onSubmit} 
        disabled={!isValid || disabled}
        title={disabled ? '전송 중...' : !isValid ? '필수 항목을 입력해주세요' : '변경사항 저장'}
      >
        <Send size={16} />
        전송
      </Button>
    </div>
  ) : null;

  return (
    <GridForm 
      labelWidth="120px" 
      gap="16px"
      bottomRightActions={bottomRightActions}
    >
      <GridForm.Row>
        <GridForm.Label required>
          차량번호
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            value={data.carNumber}
            onChange={(value) => handleFieldChange('carNumber', value)}
            placeholder="차량번호를 입력해주세요"
            disabled={isReadOnly}
            validationRule={{
              type: 'free',
              mode: mode
            }}
          />
        </GridForm.Content>
      </GridForm.Row>

      <GridForm.Row>
        <GridForm.Label>
          브랜드
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            value={data.brand}
            onChange={(value) => handleFieldChange('brand', value)}
            placeholder="브랜드를 입력해주세요"
            disabled={isReadOnly}
            validationRule={{
              type: 'free',
              mode: mode
            }}
          />
        </GridForm.Content>
      </GridForm.Row>

      <GridForm.Row>
        <GridForm.Label>
          모델
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            value={data.model}
            onChange={(value) => handleFieldChange('model', value)}
            placeholder="모델을 입력해주세요"
            disabled={isReadOnly}
            validationRule={{
              type: 'free',
              mode: mode
            }}
          />
        </GridForm.Content>
      </GridForm.Row>

      <GridForm.Row>
        <GridForm.Label>
          차종
        </GridForm.Label>
        <GridForm.Content>
          <SimpleDropdown
            value={data.type}
            onChange={(value) => handleFieldChange('type', value)}
            options={CAR_TYPE_OPTIONS}
            placeholder="차종을 선택하세요"
            disabled={isReadOnly}
            validationRule={{
              type: 'free',
              mode: mode
            }}
          />
        </GridForm.Content>
      </GridForm.Row>

      <GridForm.Row>
        <GridForm.Label>
          연식
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            type="number"
            value={data.year}
            onChange={(value) => handleFieldChange('year', value)}
            placeholder="연식을 입력해주세요"
            disabled={isReadOnly}
            validationRule={{
              type: 'free',
              mode: mode
            }}
          />
        </GridForm.Content>
      </GridForm.Row>

      <GridForm.Row>
        <GridForm.Label>
          연료
        </GridForm.Label>
        <GridForm.Content>
          <SimpleDropdown
            value={data.fuel}
            onChange={(value) => handleFieldChange('fuel', value)}
            options={FUEL_OPTIONS}
            placeholder="연료를 선택하세요"
            disabled={isReadOnly}
            validationRule={{
              type: 'free',
              mode: mode
            }}
          />
        </GridForm.Content>
      </GridForm.Row>

      <GridForm.Row>
        <GridForm.Label>
          외부 텍스트
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            value={data.outerText}
            onChange={(value) => handleFieldChange('outerText', value)}
            placeholder="외부 텍스트를 입력해주세요"
            disabled={isReadOnly}
            validationRule={{
              type: 'free',
              mode: mode
            }}
          />
        </GridForm.Content>
      </GridForm.Row>

      <GridForm.Row>
        <GridForm.Label>
          외부 스티커
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            value={data.externalSticker}
            onChange={(value) => handleFieldChange('externalSticker', value)}
            placeholder="외부 스티커를 입력해주세요"
            disabled={isReadOnly}
            validationRule={{
              type: 'free',
              mode: mode
            }}
          />
        </GridForm.Content>
      </GridForm.Row>

      <GridForm.Row>
        <GridForm.Label>
          전면 이미지 URL
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            value={data.frontImageUrl}
            onChange={(value) => handleFieldChange('frontImageUrl', value)}
            placeholder="전면 이미지 URL을 입력해주세요"
            disabled={isReadOnly}
            validationRule={{
              type: 'free',
              mode: mode
            }}
          />
        </GridForm.Content>
      </GridForm.Row>

      <GridForm.Row>
        <GridForm.Label>
          후면 이미지 URL
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            value={data.rearImageUrl}
            onChange={(value) => handleFieldChange('rearImageUrl', value)}
            placeholder="후면 이미지 URL을 입력해주세요"
            disabled={isReadOnly}
            validationRule={{
              type: 'free',
              mode: mode
            }}
          />
        </GridForm.Content>
      </GridForm.Row>

      <GridForm.Row>
        <GridForm.Label>
          측면 이미지 URL
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            value={data.sideImageUrl}
            onChange={(value) => handleFieldChange('sideImageUrl', value)}
            placeholder="측면 이미지 URL을 입력해주세요"
            disabled={isReadOnly}
            validationRule={{
              type: 'free',
              mode: mode
            }}
          />
        </GridForm.Content>
      </GridForm.Row>

      <GridForm.Row>
        <GridForm.Label>
          상단 이미지 URL
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            value={data.topImageUrl}
            onChange={(value) => handleFieldChange('topImageUrl', value)}
            placeholder="상단 이미지 URL을 입력해주세요"
            disabled={isReadOnly}
            validationRule={{
              type: 'free',
              mode: mode
            }}
          />
        </GridForm.Content>
      </GridForm.Row>

      {/* edit 모드에서만 표시되는 추가 정보 */}
      {mode === 'edit' && car && (
        <>
          <GridForm.Row>
            <GridForm.Label>
              등록일자
            </GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={new Date(car.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
                onChange={() => {}}
                disabled={true}
                validationRule={{
                  type: 'free',
                  mode: mode
                }}
              />
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label>
              수정일자
            </GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={new Date(car.updatedAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
                onChange={() => {}}
                disabled={true}
                validationRule={{
                  type: 'free',
                  mode: mode
                }}
              />
            </GridForm.Content>
          </GridForm.Row>
        </>
      )}

    </GridForm>
  );
};

export default CarForm;
