'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Link, Home } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { BaseTableColumn } from '@/components/ui/ui-data/baseTable/BaseTable';
import ResidentInstanceTable from './ResidentInstanceTable';
import InstanceSearchSection, { InstanceSearchField } from '@/components/ui/ui-input/instance-search/InstanceSearchSection';

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



  // #region 기존 세대 ID 목록
  const existingInstanceIds = useMemo(() => 
    resident.residentInstance?.map(ri => ri.instanceId) || []
  , [resident.residentInstance]);
  // #endregion



  // #region 핸들러
  const handleOperationCompleteInternal = useCallback((success: boolean, message: string) => {
    onOperationComplete(success, message);
    if (success) {
      onDataChange(); // 데이터 새로고침
    }
  }, [onDataChange, onOperationComplete]);



  const handleInstanceSelect = useCallback((instance: Instance) => {
    // 이미 연결된 세대는 선택할 수 없음
    if (existingInstanceIds.includes(instance.id)) {
      return;
    }
    setSelectedInstance(instance);
  }, [existingInstanceIds]);

  // 이미 연결된 세대인지 확인
  const isInstanceAlreadyConnected = useCallback((instanceId: number) => {
    return existingInstanceIds.includes(instanceId);
  }, [existingInstanceIds]);

  const handleSubmit = useCallback(async () => {
    if (!selectedInstance) {
      onOperationComplete(false, '세대를 선택해주세요.');
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
        handleOperationCompleteInternal(true, `${resident.name}님과 ${address} 세대의 관계가 성공적으로 생성되었습니다.`);
        
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
  }, [selectedInstance, resident.id, resident.name, memo, handleOperationCompleteInternal, onOperationComplete]);


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

  // #region 테이블 컬럼 정의
  const columns: BaseTableColumn<Instance>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '5%',
      align: 'center',
    },
    {
      key: 'dongHosu',
      header: '동호수',
      width: '10%',
      align: 'start',
      cell: (item: Instance) => `${item.address1Depth} ${item.address2Depth}`,
    },
    {
      key: 'name',
      header: '세대명',
      width: '12%',
      align: 'start',
      cell: (item: Instance) => item.name || '-',
    },
    {
      key: 'ownerName',
      header: '소유자',
      width: '10%',
      align: 'start',
      cell: (item: Instance) => item.ownerName || '-',
    },
    {
      key: 'phone',
      header: '연락처',
      width: '12%',
      align: 'start',
      cell: (item: Instance) => item.phone || '-',
    },
    {
      key: 'instanceType',
      header: '타입',
      width: '8%',
      align: 'center',
      cell: (item: Instance) => {
        const typeMap = {
          GENERAL: '일반',
          TEMP: '임시',
          COMMERCIAL: '상업',
        };
        return typeMap[item.instanceType as keyof typeof typeMap] || item.instanceType;
      },
    },
    {
      key: 'residentCount',
      header: '거주민',
      width: '8%',
      align: 'center',
      cell: (item: Instance) => `${item.residentInstance?.length || 0}명`,
    },
    {
      key: 'carCount',
      header: '차량',
      width: '8%',
      align: 'center',
      cell: (item: Instance) => `${item.carInstance?.length || 0}대`,
    },
    {
      key: 'memo',
      header: '메모',
      width: '15%',
      align: 'start',
      cell: (item: Instance) => item.memo || '-',
    },
    {
      header: '선택',
      width: '12%',
      align: 'center',
      cell: (item: Instance) => {
        const isAlreadyConnected = isInstanceAlreadyConnected(item.id);
        const isSelected = selectedInstance?.id === item.id;
        
        if (isAlreadyConnected) {
          return (
            <div className="flex flex-col gap-1 items-center">
              <Button
                variant="secondary"
                size="sm"
                disabled={true}
                className="opacity-60 cursor-not-allowed"
              >
                이미 연결됨
              </Button>
            </div>
          );
        }
        
        return (
          <Button
            variant={isSelected ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleInstanceSelect(item)}
          >
            {isSelected ? '선택됨' : '선택'}
          </Button>
        );
      },
    },
  ];
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
            residentInstances={resident.residentInstance || []}
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
            columns={columns}
            onRowClick={handleInstanceSelect}
            getRowClassName={(instance: Instance) => {
              const isAlreadyConnected = isInstanceAlreadyConnected(instance.id);
              const isSelected = selectedInstance?.id === instance.id;
              let className = '';
              
              if (isAlreadyConnected) {
                className += 'bg-muted/30 opacity-75';
              } else {
                className += 'cursor-pointer hover:bg-muted/50';
                if (isSelected) {
                  className += ' bg-blue-50 border-blue-200';
                }
              }
              
              return className;
            }}
            showSection={false}
            defaultSearchOpen={true}
            searchMode="server"
            excludeInstanceIds={existingInstanceIds}
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
                  <span className="px-2 py-1 ml-2 text-xs bg-muted rounded">
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
