'use client';

import React from 'react';
import { Eraser, RotateCcw } from 'lucide-react';
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';
import TitleRow from '@/components/ui/ui-layout/title-row/TitleRow';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { Button } from '@/components/ui/ui-input/button/Button';
import { CrudButton } from '@/components/ui/ui-input/crud-button/CrudButton';
import { ResidentDetail } from '@/types/resident';

export interface ResidentFormData {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: 'M' | 'F' | '';
  emergencyContact: string;
  memo: string;
}

interface ResidentFormProps {
  mode: 'create' | 'edit';
  resident?: ResidentDetail | null;
  data: ResidentFormData;
  onChange: (data: ResidentFormData) => void;
  disabled?: boolean;
  showActions?: boolean;
  onReset?: () => void;
  onSubmit?: () => void;
  onDelete?: () => void;
  hasChanges?: boolean;
  isValid?: boolean;
}

const GENDER_OPTIONS = [
  { value: 'M', label: '남성' },
  { value: 'F', label: '여성' },
];

const ResidentForm: React.FC<ResidentFormProps> = ({
  mode,
  resident,
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

  const handleFieldChange = (field: keyof ResidentFormData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  // 유틸/액션 버튼 구성
  const handleClearAllFields = () => {
    onChange({
      name: '',
      phone: '',
      email: '',
      birthDate: '',
      gender: '',
      emergencyContact: '',
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

  return (
    <>
      <TitleRow title="거주자 기본 정보" subtitle="거주자의 개인 정보를 관리합니다." />
      <GridForm 
        labelWidth="120px" 
        gap="16px"
        bottomLeftActions={bottomLeftActions}
        bottomRightActions={bottomRightActions}
      >
      <GridForm.Row>
        <GridForm.Label required>
          이름
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            value={data.name}
            onChange={(value) => handleFieldChange('name', value)}
            placeholder="이름을 입력해주세요"
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
        <GridForm.Label>
          이메일
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            type="email"
            value={data.email}
            onChange={(value) => handleFieldChange('email', value)}
            placeholder="이메일을 입력해주세요"
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
          생년월일
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            type="text"
            value={data.birthDate}
            onChange={(value) => handleFieldChange('birthDate', value)}
            placeholder="YYYY-MM-DD 형식으로 입력해주세요"
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
          성별
        </GridForm.Label>
        <GridForm.Content>
          <SimpleDropdown
            value={data.gender}
            onChange={(value) => handleFieldChange('gender', value)}
            options={GENDER_OPTIONS}
            placeholder="성별을 선택하세요"
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
          비상연락처
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            value={data.emergencyContact}
            onChange={(value) => handleFieldChange('emergencyContact', value)}
            placeholder="비상연락처를 입력해주세요"
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
      {mode === 'edit' && resident && (
        <>
          <GridForm.Row>
            <GridForm.Label>
              거주자 ID
            </GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={resident.id?.toString() || '-'}
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
                value={new Date(resident.createdAt).toLocaleDateString('ko-KR', {
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
                value={new Date(resident.updatedAt).toLocaleDateString('ko-KR', {
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

export default ResidentForm;
