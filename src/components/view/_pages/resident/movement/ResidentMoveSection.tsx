'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Home } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import { BaseTableColumn } from '@/components/ui/ui-data/baseTable/BaseTable';
import InstanceSearchSection, { InstanceSearchField } from '@/components/ui/ui-input/instance-search/InstanceSearchSection';

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

  // #region 제외할 세대 ID 목록
  const excludeInstanceIds = useMemo(() => 
    currentResidence?.instanceId ? [currentResidence.instanceId] : []
  , [currentResidence?.instanceId]);
  // #endregion

  // #region 핸들러
  const handleInstanceSelect = useCallback((instance: Instance) => {
    setSelectedInstance(instance);
  }, []);

  const handleExecuteMove = useCallback(async () => {
    if (!resident || !selectedInstance || isMoving) return;
    
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
  }, [resident, selectedInstance, isMoving, moveMemo, onMoveComplete]);
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
      width: '8%',
      align: 'center',
    },
    {
      key: 'dongHosu',
      header: '동호수',
      width: '15%',
      align: 'start',
      cell: (item: Instance) => `${item.address1Depth} ${item.address2Depth}`,
    },
    {
      key: 'name',
      header: '세대명',
      width: '15%',
      align: 'start',
      cell: (item: Instance) => item.name || '-',
    },
    {
      key: 'ownerName',
      header: '소유자',
      width: '12%',
      align: 'start',
      cell: (item: Instance) => item.ownerName || '-',
    },
    {
      key: 'phone',
      header: '연락처',
      width: '15%',
      align: 'start',
      cell: (item: Instance) => item.phone || '-',
    },
    {
      key: 'instanceType',
      header: '타입',
      width: '10%',
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
      header: '선택',
      width: '15%',
      align: 'center',
      cell: (item: Instance) => {
        const isSelected = selectedInstance?.id === item.id;
        
        return (
          <Button
            variant={isSelected ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleInstanceSelect(item)}
            disabled={isMoving}
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
          columns={columns}
          onRowClick={handleInstanceSelect}
          getRowClassName={(instance: Instance) => {
            const isSelected = selectedInstance?.id === instance.id;
            return isSelected 
              ? 'bg-blue-50 border-blue-200 cursor-pointer' 
              : 'cursor-pointer hover:bg-muted/50';
          }}
          showSection={false}
          defaultSearchOpen={true}
          searchMode="server"
          excludeInstanceIds={excludeInstanceIds}
          pageSize={5}
          minWidth="800px"
          title="이전할 세대 검색"
          subtitle="이전할 세대를 검색하고 선택하세요."
        />
      </div>

      {/* 선택된 세대 정보 */}
      <div className={`p-4 rounded-lg border transition-all duration-200 ${
        selectedInstance 
          ? 'bg-blue-50 border-blue-200' 
          : 'bg-muted/30 border-muted-foreground/20'
      }`}>
        <div className="flex gap-2 items-center mb-2">
          <Home size={16} className={selectedInstance ? 'text-blue-600' : 'text-muted-foreground'} />
          <span className={`font-medium ${selectedInstance ? 'text-blue-800' : 'text-muted-foreground'}`}>
            이전할 세대
          </span>
        </div>
        {selectedInstance ? (
          <p className="text-sm text-blue-700">
            {selectedInstance.address1Depth} {selectedInstance.address2Depth} {selectedInstance.address3Depth || ''}
            <span className="px-2 py-1 ml-2 text-xs bg-blue-100 rounded">
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
      <div className="space-y-2">
        <label htmlFor="moveMemo" className="block text-sm font-medium text-foreground">
          이동 사유 (선택사항)
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
