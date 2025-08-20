'use client';

import React, { useMemo } from 'react';
import { Home } from 'lucide-react';

import Modal from '@/components/ui/ui-layout/modal/Modal';
import { Button } from '@/components/ui/ui-input/button/Button';
import { SimpleToggleSwitch } from '@/components/ui/ui-input/simple-input/SimpleToggleSwitch';
import InstanceSearchSection, { InstanceSearchField, ColumnConfiguration } from '@/components/ui/ui-input/instance-search/InstanceSearchSection';

import { Instance } from '@/types/instance';

// #region 공통 인터페이스
export interface TransferFromInfo {
  id: string | number;
  instanceId: number;
  displayName: string;
  instanceType?: string;
  address?: {
    address1Depth: string;
    address2Depth: string;
    address3Depth?: string | null;
  };
}

export interface AdditionalFieldConfig {
  type: 'text' | 'textarea' | 'toggle';
  key: string;
  label: string;
  placeholder?: string;
  description?: string;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  disabled?: boolean;
  rows?: number; // textarea용
  size?: 'sm' | 'md' | 'lg'; // toggle용
}

export interface InstanceTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  
  // 출발지 정보
  fromInfo: TransferFromInfo | null;
  fromLabel: string; // "변경 전 세대", "이전 출발지" 등
  fromColorClass: string; // "orange", "red" 등
  
  // 목적지 정보  
  selectedToInstance: Instance | null;
  toLabel: string; // "변경 후 세대", "이전 목적지" 등
  toColorClass: string; // "green", "blue" 등
  
  // 세대 검색 설정
  searchFields: InstanceSearchField[];
  excludeInstanceIds: number[];
  onInstanceSelect: (instance: Instance) => void;
  getRowClassName?: (instance: Instance) => string;
  
  // 추가 입력 필드들
  additionalFields?: AdditionalFieldConfig[];
  
  // 액션
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  submitButtonText: string;
  
  // 유효성 검증
  isSubmitDisabled?: boolean;
}
// #endregion

export default function InstanceTransferModal({
  isOpen,
  onClose,
  title,
  fromInfo,
  fromLabel,
  fromColorClass,
  selectedToInstance,
  toLabel,
  toColorClass,
  searchFields,
  excludeInstanceIds,
  onInstanceSelect,
  getRowClassName,
  additionalFields = [],
  onSubmit,
  isSubmitting,
  submitButtonText,
  isSubmitDisabled = false,
}: InstanceTransferModalProps) {
  
  // #region 기본 설정
  const fromColorClasses = {
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: 'text-orange-600',
      title: 'text-orange-800',
      text: 'text-orange-700',
      badge: 'text-orange-800 bg-orange-200',
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200', 
      icon: 'text-red-600',
      title: 'text-red-800',
      text: 'text-red-700',
      badge: 'text-red-800 bg-red-200',
    },
  };

  const toColorClasses = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600', 
      title: 'text-green-800',
      text: 'text-green-700',
      badge: 'text-green-800 bg-green-200',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-800', 
      text: 'text-blue-700',
      badge: 'text-blue-800 bg-blue-200',
    },
  };

  const fromColors = fromColorClasses[fromColorClass as keyof typeof fromColorClasses] || fromColorClasses.orange;
  const toColors = toColorClasses[toColorClass as keyof typeof toColorClasses] || toColorClasses.green;
  // #endregion

  // #region 세대 검색 컬럼 설정
  const columnConfig: ColumnConfiguration = useMemo(() => ({
    preset: 'detailed',
    selectColumnConfig: {
      selectedState: (instance) => selectedToInstance?.id === instance.id,
      onSelect: onInstanceSelect,
      buttonText: (instance) => selectedToInstance?.id === instance.id ? '선택됨' : '선택',
      isLoading: isSubmitting,
    },
  }), [selectedToInstance, onInstanceSelect, isSubmitting]);
  // #endregion

  // #region 렌더링 헬퍼
  const renderInstanceInfo = (instance: { address?: { address1Depth: string; address2Depth: string; address3Depth?: string | null }; instanceType?: string }, fallbackText: string) => {
    if (!instance.address) {
      return <span className="text-sm">{fallbackText}</span>;
    }
    
    const address = `${instance.address.address1Depth} ${instance.address.address2Depth}${instance.address.address3Depth ? ` ${instance.address.address3Depth}` : ''}`;
    
    return (
      <p className="text-sm">
        {address}
        {instance.instanceType && (
          <span className="px-2 py-1 ml-2 text-xs rounded">
            {{
              GENERAL: '일반',
              TEMP: '임시',
              COMMERCIAL: '상업',
            }[instance.instanceType] || instance.instanceType}
          </span>
        )}
      </p>
    );
  };

  const renderAdditionalField = (field: AdditionalFieldConfig) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={field.value as string}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled || isSubmitting}
            className="px-3 py-2 w-full text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        );
      case 'textarea':
        return (
          <textarea
            value={field.value as string}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            disabled={field.disabled || isSubmitting}
            className="px-3 py-2 w-full text-sm rounded-md border resize-none border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        );
      case 'toggle':
        return (
          <SimpleToggleSwitch
            checked={field.value as boolean}
            onChange={field.onChange as (checked: boolean) => void}
            disabled={field.disabled || isSubmitting}
            size={field.size as 'sm' | 'md' | 'lg' || 'md'}
          />
        );
      default:
        return null;
    }
  };
  // #endregion

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="xl"
    >
      <div className="space-y-6">
        {/* 이전 정보 표시 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* 출발지 */}
          <div className={`p-4 rounded-lg border ${fromColors.bg} ${fromColors.border}`}>
            <div className="flex gap-2 items-center mb-2">
              <Home size={16} className={fromColors.icon} />
              <span className={`font-medium ${fromColors.title}`}>{fromLabel}</span>
            </div>
            <div className={fromColors.text}>
              {fromInfo ? (
                renderInstanceInfo({
                  address: fromInfo.address,
                  instanceType: fromInfo.instanceType
                }, fromInfo.displayName)
              ) : (
                <span className="text-sm">정보 없음</span>
              )}
            </div>
          </div>

          {/* 목적지 */}
          <div className={`p-4 rounded-lg border ${toColors.bg} ${toColors.border}`}>
            <div className="flex gap-2 items-center mb-2">
              <Home size={16} className={toColors.icon} />
              <span className={`font-medium ${toColors.title}`}>{toLabel}</span>
            </div>
            <div className={toColors.text}>
              {selectedToInstance ? (
                renderInstanceInfo({
                  address: {
                    address1Depth: selectedToInstance.address1Depth,
                    address2Depth: selectedToInstance.address2Depth,
                    address3Depth: selectedToInstance.address3Depth || undefined
                  },
                  instanceType: selectedToInstance.instanceType
                }, `세대 ID: ${selectedToInstance.id}`)
              ) : (
                <span className="text-sm">아래에서 목적지를 선택해주세요</span>
              )}
            </div>
          </div>
        </div>

        {/* 세대 검색 및 목록 */}
        <InstanceSearchSection
          searchFields={searchFields}
          tableType="base"
          columnConfig={columnConfig}
          onRowClick={onInstanceSelect}
          getRowClassName={getRowClassName}
          showSection={false}
          searchMode="server"
          excludeInstanceIds={excludeInstanceIds}
          pageSize={5}
          minWidth="800px"
          title="새 거주지 검색"
          subtitle="이전할 목적지 세대를 검색하고 선택하세요"
        />

        {/* 추가 입력 필드들 */}
        {additionalFields.map((field) => (
          <div key={field.key} className="p-4 rounded-lg border bg-card">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                {field.label}
                {field.description && (
                  <span className="ml-1 text-xs text-muted-foreground">({field.description})</span>
                )}
              </label>
              {renderAdditionalField(field)}
            </div>
          </div>
        ))}

        {/* 액션 버튼 */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitDisabled || isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? '처리 중...' : submitButtonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
