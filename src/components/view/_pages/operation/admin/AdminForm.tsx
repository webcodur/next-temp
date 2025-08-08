'use client';

import React from 'react';
import { RotateCcw, Send, Trash2 } from 'lucide-react';
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { Button } from '@/components/ui/ui-input/button/Button';
import { Admin } from '@/types/admin';

export interface AdminFormData {
  account: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  confirm: string;
}

interface AdminFormProps {
  mode: 'create' | 'edit' | 'view';
  admin?: Admin | null;
  data: AdminFormData;
  onChange: (data: AdminFormData) => void;
  disabled?: boolean;
  showActions?: boolean;
  onReset?: () => void;
  onSubmit?: () => void;
  onDelete?: () => void;
  hasChanges?: boolean;
  isValid?: boolean;
}

const ROLE_OPTIONS = [
  { value: '현장 관리자', label: '현장 관리자' },
  { value: '운영자', label: '운영자' },
  { value: '근무자', label: '근무자' },
  { value: '상업자', label: '상업자' },
];

const AdminForm: React.FC<AdminFormProps> = ({
  mode,
  admin,
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
  const showPassword = mode === 'create'; // create 모드에서만 비밀번호 필드 표시
  const passwordRequired = mode === 'create';

  const handleFieldChange = (field: keyof AdminFormData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  // 액션 버튼들 정의
  const topRightActions = showActions && onDelete ? (
    <Button 
      variant="destructive" 
      size="default"
      onClick={onDelete}
      disabled={disabled}
      title="관리자 삭제"
    >
      <Trash2 size={16} />
      삭제
    </Button>
  ) : null;

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
      topRightActions={topRightActions}
      bottomRightActions={bottomRightActions}
    >
      <GridForm.Row>
        <GridForm.Label required={mode === 'create'}>
          아이디
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            value={data.account}
            onChange={(value) => handleFieldChange('account', value)}
            placeholder="계정명을 입력해주세요"
            disabled={disabled || mode !== 'create'}
            validationRule={{
              type: 'free',
              mode: mode
            }}
          />
        </GridForm.Content>
      </GridForm.Row>

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
              type: 'email',
              mode: mode
            }}
          />
        </GridForm.Content>
      </GridForm.Row>

      <GridForm.Row>
        <GridForm.Label>
          연락처
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            value={data.phone}
            onChange={(value) => handleFieldChange('phone', value)}
            placeholder="010-0000-0000"
            disabled={isReadOnly}
            validationRule={{
              type: 'phone',
              mode: mode
            }}
          />
        </GridForm.Content>
      </GridForm.Row>

      <GridForm.Row>
        <GridForm.Label required>
          권한
        </GridForm.Label>
        <GridForm.Content>
          <SimpleDropdown
            value={data.role}
            onChange={(value) => handleFieldChange('role', value)}
            options={ROLE_OPTIONS}
            placeholder="권한을 선택하세요"
            disabled={isReadOnly}
            validationRule={{
              type: 'free',
              mode: mode
            }}
          />
        </GridForm.Content>
      </GridForm.Row>

      {/* create 모드에서만 비밀번호 필드 표시 */}
      {showPassword && (
        <>
          <GridForm.Row>
            <GridForm.Label required={passwordRequired}>
              비밀번호
            </GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                type="password"
                value={data.password}
                onChange={(value) => handleFieldChange('password', value)}
                placeholder="비밀번호를 입력해주세요"
                disabled={disabled}
                validationRule={{
                  type: 'password',
                  mode: mode
                }}
              />
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label required={passwordRequired}>
              비밀번호 확인
            </GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                type="password"
                value={data.confirm}
                onChange={(value) => handleFieldChange('confirm', value)}
                placeholder="비밀번호를 다시 입력해주세요"
                disabled={disabled}
                validationRule={{
                  type: 'password-confirm',
                  originalPassword: data.password,
                  mode: mode
                }}
              />
            </GridForm.Content>
          </GridForm.Row>
        </>
      )}

      {/* view/edit 모드에서 항상 표시되는 추가 정보 */}
      {mode !== 'create' && (
        <>
          <GridForm.Row>
            <GridForm.Label>
              주차장
            </GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={admin?.parkinglot?.name || '-'}
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
                value={admin ? new Date(admin.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                }) : '-'}
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

export default AdminForm; 