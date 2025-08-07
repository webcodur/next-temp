'use client';

import React from 'react';
import { RotateCcw, Send } from 'lucide-react';
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { Button } from '@/components/ui/ui-input/button/Button';
import { InstanceDetail, InstanceType } from '@/types/instance';

export interface InstanceFormData {
  address1Depth: string;
  address2Depth: string;
  address3Depth: string;
  instanceType: InstanceType | '';
  password: string;
  memo: string;
}

interface InstanceFormProps {
  mode: 'create' | 'edit';
  instance?: InstanceDetail | null;
  data: InstanceFormData;
  onChange: (data: InstanceFormData) => void;
  disabled?: boolean;
  showActions?: boolean;
  onReset?: () => void;
  onSubmit?: () => void;
  hasChanges?: boolean;
  isValid?: boolean;
}

const INSTANCE_TYPE_OPTIONS = [
  { value: 'GENERAL', label: '일반' },
  { value: 'TEMP', label: '임시' },
  { value: 'COMMERCIAL', label: '상업' },
];

const InstanceForm: React.FC<InstanceFormProps> = ({
  mode,
  instance,
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

  const handleFieldChange = (field: keyof InstanceFormData, value: string) => {
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
          주소 1단계
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            value={data.address1Depth}
            onChange={(value) => handleFieldChange('address1Depth', value)}
            placeholder="시/도를 입력해주세요"
            disabled={isReadOnly}
            validationRule={{
              type: 'free',
              mode: mode
            }}
          />
        </GridForm.Content>
      </GridForm.Row>

      <GridForm.Row>
        <GridForm.Label required>
          주소 2단계
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            value={data.address2Depth}
            onChange={(value) => handleFieldChange('address2Depth', value)}
            placeholder="시/군/구를 입력해주세요"
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
          주소 3단계
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            value={data.address3Depth}
            onChange={(value) => handleFieldChange('address3Depth', value)}
            placeholder="상세 주소를 입력해주세요"
            disabled={isReadOnly}
            validationRule={{
              type: 'free',
              mode: mode
            }}
          />
        </GridForm.Content>
      </GridForm.Row>

      <GridForm.Row>
        <GridForm.Label required>
          호실 타입
        </GridForm.Label>
        <GridForm.Content>
          <SimpleDropdown
            value={data.instanceType}
            onChange={(value) => handleFieldChange('instanceType', value)}
            options={INSTANCE_TYPE_OPTIONS}
            placeholder="타입을 선택하세요"
            disabled={isReadOnly}
            validationRule={{
              type: 'free',
              mode: mode
            }}
          />
        </GridForm.Content>
      </GridForm.Row>

      <GridForm.Row>
        <GridForm.Label required>
          비밀번호
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            type="password"
            value={data.password}
            onChange={(value) => handleFieldChange('password', value)}
            placeholder="호실 비밀번호를 입력해주세요"
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
          메모
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            value={data.memo}
            onChange={(value) => handleFieldChange('memo', value)}
            placeholder="메모를 입력해주세요"
            disabled={isReadOnly}
            validationRule={{
              type: 'free',
              mode: mode
            }}
          />
        </GridForm.Content>
      </GridForm.Row>

      {/* edit 모드에서만 표시되는 추가 정보 */}
      {mode === 'edit' && instance && (
        <>
          <GridForm.Row>
            <GridForm.Label>
              주차장 ID
            </GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={instance.parkinglotId?.toString() || '-'}
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
              등록일자
            </GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={new Date(instance.createdAt).toLocaleDateString('ko-KR', {
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
                value={new Date(instance.updatedAt).toLocaleDateString('ko-KR', {
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

export default InstanceForm;
