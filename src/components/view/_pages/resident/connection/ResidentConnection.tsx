'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Link, Home } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import ResidentInstanceTable from './ResidentInstanceTable';
import InstanceSearchSection, { InstanceSearchField, DisabledInstance, ColumnConfiguration } from '@/components/ui/ui-input/instance-search/InstanceSearchSection';

import { createResidentInstance } from '@/services/residents/residents_instances_POST';
import { Instance } from '@/types/instance';
import { CreateResidentInstanceRequest, ResidentDetail } from '@/types/resident';

interface ResidentConnectionProps {
  resident: ResidentDetail;
  onDataChange: () => void;
  onOperationComplete: (success: boolean, message: string) => void;
}

export default function ResidentConnection({ 
  resident, 
  onDataChange,
  onOperationComplete
}: ResidentConnectionProps) {
  // #region 상태 관리
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null);
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // #endregion

  // #region 기존 세대 ID 목록 및 비활성화 항목 설정
  const existingInstanceIds = useMemo(() => {
    if (!resident?.residentInstance || !Array.isArray(resident.residentInstance)) {
      return [];
    }
    return resident.residentInstance.map(ri => ri.instanceId);
  }, [resident?.residentInstance]);

  const disabledInstances = useMemo((): DisabledInstance[] => {
    return existingInstanceIds.map(instanceId => ({
      instanceId,
      disabledText: '이미 연결됨',
      disabledClassName: '',
    }));
  }, [existingInstanceIds]);
  // #endregion

  // #region 핸들러
  const handleOperationCompleteInternal = useCallback(async (success: boolean, message: string) => {
    // 먼저 성공 메시지를 표시
    onOperationComplete(success, message);
    
    // 성공한 경우에만 데이터 새로고침 시도
    if (success) {
      try {
        await onDataChange(); // 데이터 새로고침
      } catch (error) {
        console.warn('데이터 새로고침 중 오류 발생:', error);
        // 데이터 새로고침 실패는 별도 처리하지 않음 (성공 메시지는 유지)
      }
    }
  }, [onDataChange, onOperationComplete]);

  const handleInstanceSelect = useCallback((instance: Instance) => {
    setSelectedInstance(instance);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedInstance) {
      onOperationComplete(false, '세대를 선택해주세요.');
      return;
    }

    if (!resident?.id) {
      onOperationComplete(false, '거주자 정보가 유효하지 않습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData: CreateResidentInstanceRequest = {
        residentId: resident.id,
        instanceId: selectedInstance.id,
        memo: memo.trim() || undefined,
      };

      const result = await createResidentInstance(requestData);
      
      if (result.success) {
        const address = `${selectedInstance.address1Depth} ${selectedInstance.address2Depth} ${selectedInstance.address3Depth || ''}`.trim();
        const residentName = resident?.name || '거주자';
        
        // 성공 처리 (데이터 새로고침 포함)
        await handleOperationCompleteInternal(true, `${residentName}님과 ${address} 세대의 관계가 성공적으로 생성되었습니다.`);
        
        // 폼 초기화
        setSelectedInstance(null);
        setMemo('');
      } else {
        onOperationComplete(false, `관계 생성에 실패했습니다: ${result.errorMsg}`);
      }
    } catch (error) {
      console.error('관계 생성 중 오류:', error);
      onOperationComplete(false, '관계 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedInstance, resident?.id, resident?.name, memo, handleOperationCompleteInternal, onOperationComplete]);


  // #endregion

  // #region 검색 필드 구성
  const searchFields: InstanceSearchField[] = useMemo(() => [
    {
      key: 'address1Depth',
      label: '동 정보 검색',
      placeholder: '동 정보 입력',
      type: 'text',
      visible: true,
    },
    {
      key: 'address2Depth',
      label: '호수 정보 검색',
      placeholder: '호수 정보 입력',
      type: 'text',
      visible: true,
    },
    {
      key: 'instanceType',
      label: '세대 타입 검색',
      placeholder: '타입 선택',
      type: 'select',
      visible: true,
    },
  ], []);
  // #endregion

  // #region 컬럼 설정
  const columnConfig: ColumnConfiguration = useMemo(() => ({
    preset: 'detailed',
    selectColumnConfig: {
      selectedState: (instance) => selectedInstance?.id === instance.id,
      onSelect: handleInstanceSelect,
      buttonText: (instance) => selectedInstance?.id === instance.id ? '선택됨' : '선택',
      isLoading: isSubmitting,
    },
  }), [selectedInstance, handleInstanceSelect, isSubmitting]);
  // #endregion

  return (
    <div className="space-y-6">
      {/* 첫 번째 섹션: 기존 세대 연결 목록 */}
      <SectionPanel 
        title="연결된 세대 목록"
        subtitle="거주자와 연결된 세대 목록을 확인할 수 있습니다."
        icon={<Link size={18} />}
      >
        <div className="space-y-4">
          <ResidentInstanceTable 
            residentInstances={resident?.residentInstance && Array.isArray(resident.residentInstance) ? resident.residentInstance : []}
            onCreateRelation={() => {}} // 더이상 모달을 열지 않음
            onDeleteComplete={handleOperationCompleteInternal}
          />
        </div>
      </SectionPanel>

      {/* 두 번째 섹션: 새로운 세대 연결 생성 */}
      <SectionPanel 
        title="세대 연결 생성"
        subtitle="새로운 세대와 거주자를 연결합니다."
        icon={<Home size={18} />}
      >
        <div className="space-y-6">
          {/* 세대 검색 및 목록 */}
          <InstanceSearchSection
            searchFields={searchFields}
            tableType="base"
            columnConfig={columnConfig}
            onRowClick={handleInstanceSelect}
            getRowClassName={(instance: Instance) => {
              const isSelected = selectedInstance?.id === instance.id;
              return isSelected ? 'cursor-pointer hover:bg-muted/50 bg-blue-50 border-blue-200' : 'cursor-pointer hover:bg-muted/50';
            }}
            showSection={false}
            searchMode="server"
            excludeInstanceIds={[]}
            disabledInstances={disabledInstances}
            pageSize={10}
            minWidth="1200px"
          />

          {/* 선택된 세대 정보 및 메모 입력 */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* 선택된 세대 */}
            <div className="p-4 rounded-lg border bg-card">
              <div className="mb-2">
                <span className="font-medium text-foreground">
                  선택된 세대
                </span>
              </div>
              {selectedInstance ? (
                <p className="text-sm text-foreground">
                  {selectedInstance.address1Depth} {selectedInstance.address2Depth} {selectedInstance.address3Depth || ''}
                  <span className="px-2 py-1 ml-2 text-xs rounded bg-muted">
                    {{
                      GENERAL: '일반',
                      TEMP: '임시',
                      COMMERCIAL: '상업',
                    }[selectedInstance.instanceType] || selectedInstance.instanceType}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  위 목록에서 세대를 선택해주세요
                </p>
              )}
            </div>

            {/* 메모 입력 */}
            <div className="p-4 rounded-lg border bg-card">
              <div className="space-y-3">
                <label htmlFor="memo" className="block text-sm font-medium text-foreground">
                  메모 <span className="text-xs text-muted-foreground">(관계에 대한 추가 정보)</span>
                </label>
                <textarea
                  id="memo"
                  placeholder="메모를 입력하세요"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  rows={3}
                  className="px-3 py-2 w-full text-sm rounded-md border resize-none border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              onClick={handleSubmit}
              disabled={!selectedInstance || isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? '생성 중...' : '관계 생성'}
            </Button>
          </div>
        </div>
      </SectionPanel>
    </div>
  );
}
