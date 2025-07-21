'use client';

import React from 'react';
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
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
}

const ROLE_OPTIONS = [
  { value: '근무자', label: '근무자' },
  { value: '운영자', label: '운영자' },
  { value: '현장 관리자', label: '현장 관리자' },
  { value: '상업자', label: '상업자' },
];

const AdminForm: React.FC<AdminFormProps> = ({
  mode,
  admin,
  data,
  onChange,
  disabled = false,
}) => {
  const isReadOnly = mode === 'view';
  const showPassword = mode === 'create'; // edit 모드에서는 비밀번호 필드를 숨김
  const passwordRequired = mode === 'create';

  // 검증
  const passwordsMatch = data.password === data.confirm || data.confirm === '';
  const showPasswordError = data.password.trim() && data.confirm.trim() && !passwordsMatch;

  const handleFieldChange = (field: keyof AdminFormData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <GridForm labelWidth="120px" gap="16px">
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
            disabled={disabled || isReadOnly}
          />
        </GridForm.Content>
      </GridForm.Row>

      <GridForm.Row>
        <GridForm.Label>
          이메일
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            value={data.email}
            onChange={(value) => handleFieldChange('email', value)}
            placeholder="이메일을 입력해주세요"
            disabled={disabled || isReadOnly}
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
            disabled={disabled || isReadOnly}
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
            disabled={disabled || isReadOnly}
          />
        </GridForm.Content>
      </GridForm.Row>

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
              />
              {showPasswordError && (
                <p className="mt-1 text-sm text-destructive">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </GridForm.Content>
          </GridForm.Row>
        </>
      )}

      {mode === 'view' && admin && (
        <>
          <GridForm.Row>
            <GridForm.Label>
              주차장
            </GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={admin.parkinglot?.name || '-'}
                onChange={() => {}}
                disabled={true}
              />
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label>
              등록일자
            </GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={new Date(admin.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
                onChange={() => {}}
                disabled={true}
              />
            </GridForm.Content>
          </GridForm.Row>
        </>
      )}
    </GridForm>
  );
};

export default AdminForm; 