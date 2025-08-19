'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Home } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import InstanceSearchSection, { InstanceSearchField, DisabledInstance, ColumnConfiguration } from '@/components/ui/ui-input/instance-search/InstanceSearchSection';

import { moveResident } from '@/services/residents/residents_move_POST';
import { ResidentDetail, ResidentInstanceWithInstance } from '@/types/resident';
import { Instance } from '@/types/instance';

interface ResidentMoveSectionProps {
  resident: ResidentDetail;
  currentResidence: ResidentInstanceWithInstance | undefined;
  onMoveComplete: (success: boolean, message: string) => void;
}

export default function ResidentMoveSection({ 
  resident, 
  currentResidence, 
  onMoveComplete 
}: ResidentMoveSectionProps) {
  // #region 상태 관리
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null);
  const [moveMemo, setMoveMemo] = useState('');
  const [isMoving, setIsMoving] = useState(false);
  // #endregion

  // #region 비활성화할 세대 목록 설정
  const disabledInstances = useMemo((): DisabledInstance[] => {
    return currentResidence?.instanceId 
      ? [{ instanceId: currentResidence.instanceId, disabledText: '현재 거주지' }]
      : [];
  }, [currentResidence?.instanceId]);
  // #endregion

  // #region 핸들러
  const handleInstanceSelect = useCallback((instance: Instance) => {
    setSelectedInstance(instance);
  }, []);

  const handleExecuteMove = useCallback(async () => {
    if (!resident || !selectedInstance || isMoving) return;
    
    // 현재 거주지와 동일한 세대로 이동하려는 경우 방지
    if (currentResidence?.instanceId === selectedInstance.id) {
      onMoveComplete(false, '이미 해당 세대에 거주하고 있습니다. 다른 세대를 선택해주세요.');
      return;
    }
    
    setIsMoving(true);
    
    try {
      const result = await moveResident({
        residentId: resident.id,
        instanceId: selectedInstance.id,
        memo: moveMemo.trim() || undefined,
      });

      if (result.success) {
        const address = `${selectedInstance.address1Depth} ${selectedInstance.address2Depth} ${selectedInstance.address3Depth || ''}`.trim();
        const successMessage = `${resident.name}님이 ${address} 세대로 성공적으로 이전되었습니다.`;
        setSelectedInstance(null);
        setMoveMemo('');
        onMoveComplete(true, successMessage);
      } else {
        onMoveComplete(false, `세대 이전에 실패했습니다: ${result.errorMsg}`);
      }
    } catch (error) {
      console.error('세대 이전 중 오류:', error);
      onMoveComplete(false, '세대 이전 중 오류가 발생했습니다.');
    } finally {
      setIsMoving(false);
    }
  }, [resident, selectedInstance, isMoving, moveMemo, onMoveComplete, currentResidence?.instanceId]);
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
    preset: 'basic',
    selectColumnConfig: {
      selectedState: (instance) => selectedInstance?.id === instance.id,
      onSelect: handleInstanceSelect,
      buttonText: (instance) => selectedInstance?.id === instance.id ? '선택됨' : '선택',
      isLoading: isMoving,
    },
  }), [selectedInstance, handleInstanceSelect, isMoving]);
  // #endregion

  return (
    <div className="space-y-6">
      {/* 현재 거주지 정보 */}
      {currentResidence && (
        <div className="p-4 rounded-lg border bg-muted/30">
          <h4 className="mb-2 text-sm font-medium">현재 거주지</h4>
          <p className="text-sm text-muted-foreground">
            {currentResidence.instance?.address1Depth} {currentResidence.instance?.address2Depth} {currentResidence.instance?.address3Depth || ''}
          </p>
        </div>
      )}

      {/* 세대 검색 및 선택 */}
      <div className="space-y-4">
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
          pageSize={5}
          minWidth="800px"
          title="이전할 세대 검색"
          subtitle="이전할 세대를 검색하고 선택하세요."
        />
      </div>

      {/* 선택된 세대 정보 및 이동 사유 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 선택된 세대 */}
        <div className="p-4 rounded-lg border bg-card">
          <div className="flex gap-2 items-center mb-2">
            <Home size={16} className={selectedInstance ? 'text-blue-600' : 'text-muted-foreground'} />
            <span className={`font-medium ${selectedInstance ? 'text-blue-800' : 'text-muted-foreground'}`}>
              이전할 세대
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
              위 목록에서 이전할 세대를 선택해주세요
            </p>
          )}
        </div>

        {/* 이동 사유 입력 */}
        <div className="p-4 rounded-lg border bg-card">
          <div className="space-y-3">
            <label htmlFor="moveMemo" className="block text-sm font-medium text-foreground">
              이동 사유 <span className="text-xs text-muted-foreground">(선택사항)</span>
            </label>
            <input
              id="moveMemo"
              type="text"
              value={moveMemo}
              onChange={(e) => setMoveMemo(e.target.value)}
              placeholder="이동 사유나 메모를 입력하세요"
              disabled={isMoving}
              className="px-3 py-2 w-full text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button
          onClick={handleExecuteMove}
          disabled={!selectedInstance || isMoving}
          className="min-w-[120px]"
        >
          {isMoving ? '이전 중...' : '세대 이전 실행'}
        </Button>
      </div>
    </div>
  );
}
