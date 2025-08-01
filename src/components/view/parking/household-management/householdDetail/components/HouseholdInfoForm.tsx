'use client';

import React from 'react';
import { Save, X } from 'lucide-react';
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { HouseholdFormData } from '../types';
import type { Household } from '@/types/household';

// #region 타입 정의
type FormMode = 'create' | 'update';

interface HouseholdInfoFormProps {
  mode: FormMode;
  household?: Household | null;
  formData: HouseholdFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
  onFieldChange: (field: keyof HouseholdFormData) => (value: string) => void;
  onReset?: () => void;
  onSave: () => void;
  onCancel?: () => void;
}
// #endregion

export default function HouseholdInfoForm({
  mode,
  household,
  formData,
  errors,
  isSubmitting,
  isValid,
  onFieldChange,
  onReset,
  onSave,
  onCancel,
}: HouseholdInfoFormProps) {
  // #region 모드별 동작 정의
  const showSystemFields = mode === 'update';
  
  const householdTypeOptions = [
    { value: 'GENERAL', label: '일반 세대' },
    { value: 'TEMP', label: '임시 세대' },
    { value: 'COMMERCIAL', label: '상업 세대' },
  ];
  // #endregion

  return (
    <div className="p-6 rounded-lg border bg-card border-border">
      <h2 className="mb-4 text-lg font-semibold">호실 정보</h2>
      
      <GridForm labelWidth="120px" gap="16px">
        {/* 시스템 식별자 (등록 모드 제외, 항상 비활성화) */}
        {showSystemFields && household && (
          <GridForm.Row>
            <GridForm.Label>호실 ID</GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={household.id.toString()}
                onChange={() => {}}
                disabled={true}
              />
            </GridForm.Content>
          </GridForm.Row>
        )}

        <GridForm.Row>
          <GridForm.Label required htmlFor="lv1Address">동 정보</GridForm.Label>
          <GridForm.Content>
            <SimpleTextInput
              value={formData.lv1Address}
              onChange={onFieldChange('lv1Address')}
              placeholder="예: 101동"
              disabled={false}
            />
            {errors.lv1Address && (
              <div className="text-sm text-red-600">{errors.lv1Address}</div>
            )}
          </GridForm.Content>
        </GridForm.Row>

        <GridForm.Row>
          <GridForm.Label required htmlFor="lv2Address">호 정보</GridForm.Label>
          <GridForm.Content>
            <SimpleTextInput
              value={formData.lv2Address}
              onChange={onFieldChange('lv2Address')}
              placeholder="예: 1001호"
              disabled={false}
            />
            {errors.lv2Address && (
              <div className="text-sm text-red-600">{errors.lv2Address}</div>
            )}
          </GridForm.Content>
        </GridForm.Row>

        <GridForm.Row>
          <GridForm.Label htmlFor="lv3Address">기타 주소</GridForm.Label>
          <GridForm.Content>
            <SimpleTextInput
              value={formData.lv3Address}
              onChange={onFieldChange('lv3Address')}
              placeholder="예: 도로명 주소"
              disabled={false}
            />
          </GridForm.Content>
        </GridForm.Row>

        <GridForm.Row>
          <GridForm.Label required htmlFor="householdType">세대 타입</GridForm.Label>
          <GridForm.Content>
            <SimpleDropdown
              value={formData.householdType}
              onChange={onFieldChange('householdType')}
              options={householdTypeOptions}
              placeholder="타입 선택"
              disabled={false}
            />
            {errors.householdType && (
              <div className="text-sm text-red-600">{errors.householdType}</div>
            )}
          </GridForm.Content>
        </GridForm.Row>

        <GridForm.Row>
          <GridForm.Label htmlFor="memo">메모</GridForm.Label>
          <GridForm.Content>
            <SimpleTextInput
              value={formData.memo}
              onChange={onFieldChange('memo')}
              placeholder="특이사항이나 추가 정보를 입력하세요"
              disabled={false}
            />
          </GridForm.Content>
        </GridForm.Row>

        {/* 시스템 생성 정보 (등록 모드 제외, 항상 비활성화) */}
        {showSystemFields && household && (
          <>
            <GridForm.Row>
              <GridForm.Label>등록일</GridForm.Label>
              <GridForm.Content>
                <SimpleTextInput
                  value={new Date(household.createdAt).toLocaleDateString()}
                  onChange={() => {}}
                  disabled={true}
                />
              </GridForm.Content>
            </GridForm.Row>

            <GridForm.Row>
              <GridForm.Label>수정일</GridForm.Label>
              <GridForm.Content>
                <SimpleTextInput
                  value={new Date(household.updatedAt).toLocaleDateString()}
                  onChange={() => {}}
                  disabled={true}
                />
              </GridForm.Content>
            </GridForm.Row>
          </>
        )}

      </GridForm>

      {/* 액션 버튼들 - 폼 바깥쪽 우하단 배치 */}
      <div className="flex gap-2 justify-end mt-4">
        {mode === 'create' && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex gap-2 items-center px-4 py-2 rounded-lg border transition-colors border-border hover:bg-muted disabled:opacity-50"
            title="등록 취소"
          >
            <X className="w-4 h-4" />
            취소
          </button>
        )}
        {mode === 'update' && onReset && (
          <button
            type="button"
            onClick={onReset}
            disabled={isSubmitting}
            className="flex gap-2 items-center px-4 py-2 rounded-lg border transition-colors border-border hover:bg-muted disabled:opacity-50"
            title="원본 데이터로 초기화"
          >
            <X className="w-4 h-4" />
            초기화
          </button>
        )}
        <button
          onClick={onSave}
          disabled={isSubmitting || !isValid}
          className="flex gap-2 items-center px-4 py-2 rounded-lg transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          title={mode === 'create' ? '호실 등록' : '변경사항 저장'}
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? (mode === 'create' ? '등록 중...' : '저장 중...') : (mode === 'create' ? '등록' : '저장')}
        </button>
      </div>
    </div>
  );
}