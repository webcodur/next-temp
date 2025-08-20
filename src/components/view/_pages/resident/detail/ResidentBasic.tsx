'use client';

import React from 'react';
import { Eraser, RotateCcw, User, Building } from 'lucide-react';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { SimpleDatePicker } from '@/components/ui/ui-input/simple-input/time/SimpleDatePicker';
import { Button } from '@/components/ui/ui-input/button/Button';
import { CrudButton } from '@/components/ui/ui-input/crud-button/CrudButton';
import { ResidentDetail, ResidentInstanceWithInstance } from '@/types/resident';
import { ValidationRule } from '@/utils/validation';

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

  // 필드별 유효성 규칙 생성 함수
  const getValidationRule = (fieldType: 'name' | 'phone' | 'email' | 'date' | 'dropdown' | 'text' | 'readonly', required = false): ValidationRule => {
    let validationType: ValidationRule['type'] = 'free';
    
    switch (fieldType) {
      case 'name':
        validationType = 'custom'; // 한글, 영문 2-50자 검증
        break;
      case 'phone':
        validationType = 'phone';
        break;
      case 'email':
        validationType = 'email';
        break;
      case 'date':
        validationType = 'free'; // 별도 컴포넌트에서 검증
        break;
      case 'dropdown':
      case 'text':
      case 'readonly':
        validationType = 'free';
        break;
    }
    
    const result: ValidationRule = { type: validationType, mode, required };
    return result;
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

  // 폼 필드 정의
  const baseFields: GridFormFieldSchema[] = [
    {
      id: 'name',
      label: '이름',
      required: true,
      rules: '한글, 영문 2-50자',
      component: (
        <SimpleTextInput
          value={data.name}
          onChange={(value) => handleFieldChange('name', value)}
          placeholder="이름"
          disabled={isReadOnly}
          validationRule={getValidationRule('name', true)}
        />
      )
    },
    {
      id: 'phone',
      label: '전화번호',
      rules: '010-0000-0000 형식',
      component: (
        <SimpleTextInput
          value={data.phone}
          onChange={(value) => handleFieldChange('phone', value)}
          placeholder="전화번호"
          disabled={isReadOnly}
          autocomplete="off"
          validationRule={getValidationRule('phone', false)}
        />
      )
    },
    {
      id: 'email',
      label: '이메일',
      rules: '유효한 이메일 형식',
      component: (
        <SimpleTextInput
          type="email"
          value={data.email}
          onChange={(value) => handleFieldChange('email', value)}
          placeholder="이메일"
          disabled={isReadOnly}
          autocomplete="off"
          validationRule={getValidationRule('email', false)}
        />
      )
    },
    {
      id: 'birthDate',
      label: '생년월일',
      rules: 'YYYY-MM-DD 형식',
      component: (
        <SimpleDatePicker
          value={data.birthDate}
          onChange={(value) => handleFieldChange('birthDate', value || '')}
          disabled={isReadOnly}
          dateFormat="yyyy-MM-dd"
          showTimeSelect={false}
          utcMode={true}
          validationRule={getValidationRule('date', false)}
        />
      )
    },
    {
      id: 'gender',
      label: '성별',
      rules: '남성/여성 선택',
      component: (
        <SimpleDropdown
          value={data.gender}
          onChange={(value) => handleFieldChange('gender', value)}
          options={GENDER_OPTIONS}
          placeholder="성별을 선택하세요"
          disabled={isReadOnly}
          validationRule={getValidationRule('dropdown', false)}
        />
      )
    },
    {
      id: 'emergencyContact',
      label: '비상연락처',
      rules: '010-0000-0000 형식',
      component: (
        <SimpleTextInput
          value={data.emergencyContact}
          onChange={(value) => handleFieldChange('emergencyContact', value)}
          placeholder="비상연락처"
          disabled={isReadOnly}
          validationRule={getValidationRule('phone', false)}
        />
      )
    },
    {
      id: 'memo',
      label: '메모',
      rules: '자유 형식 텍스트',
      component: (
        <SimpleTextInput
          value={data.memo}
          onChange={(value) => handleFieldChange('memo', value)}
          placeholder="메모"
          disabled={isReadOnly}
          validationRule={getValidationRule('text', false)}
        />
      )
    }
  ];

  // edit 모드 전용 필드
  const editFields: GridFormFieldSchema[] = mode === 'edit' && resident ? [
    {
      id: 'residentId',
      label: '주민 ID',
      rules: '시스템 자동 생성',
      component: (
        <SimpleTextInput
          value={resident.id?.toString() || '-'}
          onChange={() => {}}
          disabled={true}
          validationRule={getValidationRule('readonly', false)}
        />
      )
    },
    {
      id: 'createdAt',
      label: '등록일자',
      rules: '시스템 자동 기록',
      component: (
        <SimpleDatePicker
          value={resident.createdAt}
          onChange={() => {}}
          disabled={true}
          dateFormat="yyyy-MM-dd"
          showTimeSelect={false}
          utcMode={true}
          validationRule={{ type: 'free', mode: 'view' }}
        />
      )
    },
    {
      id: 'updatedAt',
      label: '수정일자',
      rules: '시스템 자동 기록',
      component: (
        <SimpleDatePicker
          value={resident.updatedAt}
          onChange={() => {}}
          disabled={true}
          dateFormat="yyyy-MM-dd"
          showTimeSelect={false}
          utcMode={true}
          validationRule={{ type: 'free', mode: 'view' }}
        />
      )
    }
  ] : [];

  const fields = [...baseFields, ...editFields];

  // #region 현재 거주지 정보
  const currentResidences = resident?.residentInstance?.filter(ri => ri.instance) || [];
  
  const createResidenceFields = (residence: ResidentInstanceWithInstance): GridFormFieldSchema[] => residence?.instance ? [
    {
      id: 'instanceId',
      label: '세대 ID',
      component: (
        <SimpleTextInput
          value={`#${residence.instance.id}`}
          onChange={() => {}}
          disabled={true}
          validationRule={getValidationRule('readonly', false)}
        />
      ),
      rules: 'API에서 관리하는 세대 고유 식별자'
    },
    {
      id: 'address1Depth',
      label: '1차 주소',
      component: (
        <SimpleTextInput
          value={residence.instance.address1Depth}
          onChange={() => {}}
          disabled={true}
          validationRule={getValidationRule('readonly', false)}
        />
      ),
      rules: '1차 주소 정보'
    },
    {
      id: 'address2Depth',
      label: '2차 주소',
      component: (
        <SimpleTextInput
          value={residence.instance.address2Depth}
          onChange={() => {}}
          disabled={true}
          validationRule={getValidationRule('readonly', false)}
        />
      ),
      rules: '2차 주소 정보'
    },
    {
      id: 'address3Depth',
      label: '3차 주소',
      component: (
        <SimpleTextInput
          value={residence.instance.address3Depth || '-'}
          onChange={() => {}}
          disabled={true}
          validationRule={getValidationRule('readonly', false)}
        />
      ),
      rules: '3차 주소 정보'
    },
    {
      id: 'instanceType',
      label: '세대 타입',
      component: (
        <SimpleTextInput
          value={(() => {
            const typeMap = {
              GENERAL: '일반',
              TEMP: '임시',
              COMMERCIAL: '상업',
            };
            return typeMap[residence.instance.instanceType as keyof typeof typeMap] || residence.instance.instanceType;
          })()}
          onChange={() => {}}
          disabled={true}
          validationRule={getValidationRule('readonly', false)}
        />
      ),
      rules: 'GENERAL/TEMP/COMMERCIAL 타입'
    },
    {
      id: 'relationId',
      label: '관계 ID',
      component: (
        <SimpleTextInput
          value={`#${residence.id}`}
          onChange={() => {}}
          disabled={true}
          validationRule={getValidationRule('readonly', false)}
        />
      ),
      rules: '주민-세대 관계 ID'
    },
    {
      id: 'relationMemo',
      label: '관계 메모',
      component: (
        <SimpleTextInput
          value={residence.memo || '-'}
          onChange={() => {}}
          disabled={true}
          validationRule={getValidationRule('readonly', false)}
        />
      ),
      rules: '관계 메모 정보'
    },
    {
      id: 'relationCreatedAt',
      label: '관계 생성일',
      component: (
        <SimpleDatePicker
          value={residence.createdAt}
          onChange={() => {}}
          disabled={true}
          dateFormat="yyyy-MM-dd HH:mm"
          showTimeSelect={true}
          utcMode={true}
          validationRule={{ type: 'free', mode: 'view' }}
        />
      ),
      rules: '관계 생성 일시'
    }
  ] : [];
  // #endregion

  return (
    <div className="space-y-6">
      {/* 기본 정보 */}
      <SectionPanel 
        title="주민 기본 정보"
        subtitle="주민의 개인 정보를 관리합니다."
        icon={<User size={18} />}
      >
        <GridFormAuto 
          fields={fields}
          gap="16px"
          bottomLeftActions={bottomLeftActions}
          bottomRightActions={bottomRightActions}
        />
      </SectionPanel>

      {/* 현재 거주지 정보 */}
      <SectionPanel 
        title={`현재 거주지 정보 (${currentResidences.length}개)`}
        subtitle="주민이 현재 거주하는 세대 정보입니다."
        icon={<Building size={18} />}
      >
        {currentResidences.length > 0 ? (
          <div className="space-y-6">
            {currentResidences.map((residence, index) => (
              <div key={residence.id} className="p-4 rounded-lg border bg-card">
                <h4 className="mb-3 text-sm font-medium text-muted-foreground">
                  거주지 #{index + 1}
                </h4>
                <GridFormAuto 
                  fields={createResidenceFields(residence)}
                  gap="16px"
                  bottomRightActions={null}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            현재 연결된 거주지가 없습니다.
          </div>
        )}
      </SectionPanel>
    </div>
  );
};

export default ResidentForm;
