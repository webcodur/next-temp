'use client';

import React from 'react';
import { RotateCcw, Save } from 'lucide-react'; // Trash2 아이콘은 CrudButton에서 처리
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { Button } from '@/components/ui/ui-input/button/Button';
import { CrudButton } from '@/components/ui/ui-input/crud-button/CrudButton';
import { Admin, ROLE_ID_MAP } from '@/types/admin';

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

// ROLE_ID_MAP을 기반으로 동적 생성하여 일관성 보장
const ROLE_OPTIONS = Object.keys(ROLE_ID_MAP).map(roleName => ({
  value: roleName,
  label: roleName
}));

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

  // 액션 버튼들 정의 - 가이드에 따라 유틸(start) / 액션(end) 분리
  const topRightActions = null; // 상단에는 버튼 배치하지 않음

  // 유틸 버튼 (start 사이드) - 복구
  const bottomLeftActions = showActions ? (
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
          title="관리자 삭제"
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

  return (
    <GridForm 
      
      gap="16px"
      topRightActions={topRightActions}
      bottomLeftActions={bottomLeftActions}
      bottomRightActions={bottomRightActions}
    >
      <GridForm.Row>
        <GridForm.Label required={mode === 'create'}>
          아이디
        </GridForm.Label>
        <GridForm.Rules>
          영문, 숫자 4-20자
        </GridForm.Rules>
        <GridForm.Content>
          <SimpleTextInput
            value={data.account}
            onChange={(value) => handleFieldChange('account', value)}
            placeholder="계정명"
            disabled={disabled || mode !== 'create'}
            autocomplete="off"
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
        <GridForm.Rules>
          한글, 영문 2-50자
        </GridForm.Rules>
        <GridForm.Content>
          <SimpleTextInput
            value={data.name}
            onChange={(value) => handleFieldChange('name', value)}
            placeholder="이름"
            disabled={isReadOnly}
            autocomplete="off"
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
        <GridForm.Rules>
          유효한 이메일 형식
        </GridForm.Rules>
        <GridForm.Content>
          <SimpleTextInput
            type="email"
            value={data.email}
            onChange={(value) => handleFieldChange('email', value)}
            placeholder="이메일"
            disabled={isReadOnly}
            autocomplete="off"
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
        <GridForm.Rules>
          010-0000-0000 형식
        </GridForm.Rules>
        <GridForm.Content>
          <SimpleTextInput
            value={data.phone}
            onChange={(value) => handleFieldChange('phone', value)}
            placeholder="010-0000-0000"
            disabled={isReadOnly}
            autocomplete="off"
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
        <GridForm.Rules>
          역할 및 권한 설정
        </GridForm.Rules>
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
            <GridForm.Rules>
              8자 이상 영문/숫자/특수문자
            </GridForm.Rules>
            <GridForm.Content>
              <SimpleTextInput
                type="password"
                value={data.password}
                onChange={(value) => handleFieldChange('password', value)}
                placeholder="비밀번호"
                disabled={disabled}
                autocomplete="new-password"
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
            <GridForm.Rules>
              위와 동일한 비밀번호
            </GridForm.Rules>
            <GridForm.Content>
              <SimpleTextInput
                type="password"
                value={data.confirm}
                onChange={(value) => handleFieldChange('confirm', value)}
                placeholder="비밀번호 확인"
                disabled={disabled}
                autocomplete="new-password"
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
            <GridForm.Rules>
              시스템 자동 연결
            </GridForm.Rules>
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
            <GridForm.Rules>
              시스템 자동 기록
            </GridForm.Rules>
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