'use client';

import React from 'react';
import { Eraser, RotateCcw, Save, Trash2 } from 'lucide-react';
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';
import TitleRow from '@/components/ui/ui-layout/title-row/TitleRow';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { Button } from '@/components/ui/ui-input/button/Button';
import { InstanceDetail, InstanceType } from '@/types/instance';

export interface InstanceFormData {
  name: string;
  ownerName: string;
  phone: string;
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
  onDelete?: () => void;
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
  onDelete,
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

  // 유틸/액션 버튼 구성
  const handleClearAllFields = () => {
    onChange({
      name: '',
      ownerName: '',
      phone: '',
      address1Depth: '',
      address2Depth: '',
      address3Depth: '',
      instanceType: '',
      password: '',
      memo: '',
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
          <Button
            variant="primary"
            size="default"
            onClick={onSubmit}
            disabled={!isValid || disabled}
            title={disabled ? '저장 중...' : !isValid ? '필수 항목을 입력해주세요' : '저장'}
            icon={Save}
          >
            저장
          </Button>
        )
        : mode === 'edit'
          ? (
            <div className="flex gap-3">
              {onDelete && (
                <Button
                  variant="destructive"
                  size="default"
                  onClick={onDelete}
                  disabled={disabled}
                  title="상세 항목을 삭제합니다"
                  icon={Trash2}
                >
                  삭제
                </Button>
              )}
              <Button
                variant="primary"
                size="default"
                onClick={onSubmit}
                disabled={!isValid || disabled}
                title={disabled ? '저장 중...' : !isValid ? '필수 항목을 입력해주세요' : '저장'}
                icon={Save}
              >
                저장
              </Button>
            </div>
          )
          : null
    )
    : null;

  return (
    <>
      <TitleRow title="호실 기본 정보" subtitle="호실의 기본 설정을 관리합니다." />
      <GridForm 
        labelWidth="120px" 
        gap="16px"
        bottomLeftActions={bottomLeftActions}
        bottomRightActions={bottomRightActions}
      >
      <GridForm.Row>
        <GridForm.Label required>
          호실 이름
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            value={data.name}
            onChange={(value) => handleFieldChange('name', value)}
            placeholder="호실 이름을 입력해주세요"
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
          소유자 이름
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            value={data.ownerName}
            onChange={(value) => handleFieldChange('ownerName', value)}
            placeholder="소유자 이름을 입력해주세요"
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
          전화번호
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            value={data.phone}
            onChange={(value) => handleFieldChange('phone', value)}
            placeholder="전화번호를 입력해주세요"
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
    </>
  );
};

export default InstanceForm;
