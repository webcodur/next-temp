'use client';

import React from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { SimpleTextArea } from '@/components/ui/ui-input/simple-input/SimpleTextArea';
import { SimpleCheckbox } from '@/components/ui/ui-input/simple-input/SimpleCheckbox';
import { SimpleDatePicker } from '@/components/ui/ui-input/simple-input/time/SimpleDatePicker';
import { Button } from '@/components/ui/ui-input/button/Button';
import { CrudButton } from '@/components/ui/ui-input/crud-button/CrudButton';
import { AppBoard, ENUM_APP_BOARD_STATUS, APP_BOARD_STATUS_LABELS, APP_BOARD_CATEGORIES } from '@/types/appBoard';
import { ValidationRule } from '@/utils/validation';
import dynamic from 'next/dynamic';

// TipTap Editor를 동적 로딩 (SSR 방지)
const Editor = dynamic(
  () => import('@/components/ui/ui-input/editor/Editor'),
  { ssr: false }
);

export interface AppBoardFormData {
  title: string;
  content: string;
  category: string;
  status: ENUM_APP_BOARD_STATUS;
  isFixed: boolean;
}

interface AppBoardFormProps {
  mode: 'create' | 'edit' | 'view';
  appBoard?: AppBoard | null;
  data: AppBoardFormData;
  onChange: (data: AppBoardFormData) => void;
  disabled?: boolean;
  showActions?: boolean;
  onReset?: () => void;
  onSubmit?: () => void;
  onDelete?: () => void;
  hasChanges?: boolean;
  isValid?: boolean;
}

// 상태 옵션 생성
const STATUS_OPTIONS = Object.values(ENUM_APP_BOARD_STATUS).map(status => ({
  value: status,
  label: APP_BOARD_STATUS_LABELS[status]
}));

const AppBoardForm: React.FC<AppBoardFormProps> = ({
  mode,
  appBoard,
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
  const isReadOnly = disabled || mode === 'view';

  const handleFieldChange = (field: keyof AppBoardFormData, value: string | boolean) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  // 필드별 유효성 규칙 생성 함수
  const getValidationRule = (fieldType: 'title' | 'content' | 'dropdown' | 'checkbox' | 'readonly' | 'date', required = false): ValidationRule => {
    let validationType: ValidationRule['type'] = 'free';
    
    switch (fieldType) {
      case 'title':
        validationType = 'free'; // 제목은 자유 텍스트
        break;
      case 'content':
        validationType = 'free'; // 내용도 자유 텍스트
        break;
      case 'dropdown':
      case 'checkbox':
      case 'readonly':
      case 'date':
        validationType = 'free';
        break;
    }
    
    const result: ValidationRule = { 
      type: validationType, 
      mode, 
      required
    };
    return result;
  };

  // 액션 버튼들 정의 - 가이드에 따라 유틸(start) / 액션(end) 분리
  const topRightActions = null; // 상단에는 버튼 배치하지 않음

  // 유틸 버튼 (start 사이드) - 초기화/복구
  const resetButtonText = mode === 'create' ? '초기화' : '복구';
  const resetButtonTitle = mode === 'create' 
    ? (!hasChanges ? '변경사항이 없습니다' : '입력 내용 초기화') 
    : (!hasChanges ? '변경사항이 없습니다' : '변경사항 되돌리기');
    
  const bottomLeftActions = showActions ? (
    <Button 
      variant="secondary" 
      size="default"
      onClick={onReset} 
      disabled={!hasChanges || disabled}
      title={resetButtonTitle}
    >
      <RotateCcw size={16} />
      {resetButtonText}
    </Button>
  ) : null;

  // 액션 버튼 (end 사이드) - 삭제, 저장
  const bottomRightActions = showActions ? (
    <div className="flex gap-3">
      {onDelete && (
        <CrudButton 
          action="delete"
          size="default"
          onClick={onDelete}
          disabled={disabled}
          title="게시글 삭제"
        />
      )}
      <Button 
        variant="primary" 
        size="default"
        onClick={onSubmit} 
        disabled={!isValid || disabled}
        title={disabled ? '저장 중...' : !isValid ? '필수 항목을 입력해주세요' : '변경사항 저장'}
      >
        <Save size={16} />
        저장
      </Button>
    </div>
  ) : null;

  // 기본 필드 정의
  const baseFields: GridFormFieldSchema[] = [
    {
      id: 'title',
      label: '제목',
      required: true,
      rules: '게시글 제목',
      align: 'start',
      component: (
        <SimpleTextInput
          value={data.title}
          onChange={(value) => handleFieldChange('title', value)}
          placeholder="게시글 제목을 입력하세요"
          disabled={isReadOnly}
          autocomplete="off"
          validationRule={getValidationRule('title', true)}
        />
      )
    },
    {
      id: 'content',
      label: '내용',
      required: true,
      rules: '게시글 내용',
      align: 'start',
      component: (
        <div className="min-h-[400px]">
          {isReadOnly ? (
            <SimpleTextArea
              value={data.content}
              onChange={(value) => handleFieldChange('content', value)}
              placeholder="게시글 내용을 입력하세요"
              disabled={true}
              rows={10}
              validationRule={getValidationRule('content', true)}
            />
          ) : (
            <Editor
              value={data.content}
              onChange={(value) => handleFieldChange('content', value)}
              placeholder="게시글 내용을 입력하세요"
              disabled={false}
              height={400}
            />
          )}
        </div>
      )
    },
    {
      id: 'category',
      label: '카테고리',
      required: true,
      rules: '게시글 분류',
      align: 'start',
      component: (
        <SimpleDropdown
          value={data.category}
          onChange={(value) => handleFieldChange('category', value)}
          options={[...APP_BOARD_CATEGORIES]}
          placeholder="카테고리를 선택하세요"
          disabled={isReadOnly}
          validationRule={getValidationRule('dropdown', true)}
        />
      )
    },
    {
      id: 'status',
      label: '상태',
      required: true,
      rules: '게시 상태',
      align: 'start',
      component: (
        <SimpleDropdown
          value={data.status}
          onChange={(value) => handleFieldChange('status', value as ENUM_APP_BOARD_STATUS)}
          options={STATUS_OPTIONS}
          placeholder="상태를 선택하세요"
          disabled={isReadOnly}
          validationRule={getValidationRule('dropdown', true)}
        />
      )
    },
    {
      id: 'isFixed',
      label: '고정 게시글',
      rules: '상단 고정 여부',
      align: 'start',
      component: (
        <SimpleCheckbox
          checked={data.isFixed}
          onChange={(checked) => handleFieldChange('isFixed', checked)}
          disabled={isReadOnly}
        />
      )
    }
  ];

  // 추가 정보 필드 (view/edit 모드에서만)
  const additionalFields: GridFormFieldSchema[] = mode !== 'create' ? [
    {
      id: 'viewCount',
      label: '조회수',
      rules: '시스템 자동 기록',
      align: 'start',
      component: (
        <SimpleTextInput
          value={appBoard?.viewCount?.toString() || '0'}
          onChange={() => {}}
          disabled={true}
          validationRule={getValidationRule('readonly', false)}
        />
      )
    },
    {
      id: 'authorName',
      label: '작성자',
      rules: '시스템 자동 기록',
      align: 'start',
      component: (
        <SimpleTextInput
          value={appBoard?.authorName || '-'}
          onChange={() => {}}
          disabled={true}
          validationRule={getValidationRule('readonly', false)}
        />
      )
    },
    {
      id: 'createdAt',
      label: '작성일자',
      rules: '시스템 자동 기록',
      align: 'start',
      component: (
        <SimpleDatePicker
          value={appBoard?.createdAt || null}
          onChange={() => {}}
          disabled={true}
          dateFormat="yyyy-MM-dd"
          showTimeSelect={false}
          utcMode={true}
          validationRule={getValidationRule('readonly', false)}
        />
      )
    }
  ] : [];

  const fields = [...baseFields, ...additionalFields];

  return (
    <GridFormAuto 
      fields={fields}
      gap="16px"
      topRightActions={topRightActions}
      bottomLeftActions={bottomLeftActions}
      bottomRightActions={bottomRightActions}
    />
  );
};

export default AppBoardForm;
