'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';

import { CrudButton } from '@/components/ui/ui-input/crud-button/CrudButton';


import { searchInstances } from '@/services/instances/instances$_GET';
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
  const [instances, setInstances] = useState<Instance[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedInstanceId, setSelectedInstanceId] = useState<number | null>(null);
  const [moveMemo, setMoveMemo] = useState('');
  const [isMoving, setIsMoving] = useState(false);
  const [moveError, setMoveError] = useState<string | null>(null);
  const [moveSuccess, setMoveSuccess] = useState<string | null>(null);
  // #endregion

  // #region 데이터 로드
  const loadInstances = useCallback(async () => {
    setIsSearching(true);
    setMoveError(null);
    try {
      const result = await searchInstances({ page: 1, limit: 1000 });
      if (result.success && result.data) {
        setInstances(result.data.data || []);
      } else {
        setInstances([]);
        setMoveError(`세대 목록을 불러올 수 없습니다${result.errorMsg ? `: ${result.errorMsg}` : ''}`);
      }
    } catch (error) {
      console.error('세대 목록 조회 중 오류:', error);
      setMoveError('세대 목록을 불러오는 중 오류가 발생했습니다.');
      setInstances([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    loadInstances();
  }, [loadInstances]);
  // #endregion

  // #region 계산된 값들
  const instanceOptions = useMemo(() => {
    return instances
      .filter(instance => instance.id !== currentResidence?.instanceId)
      .map(instance => ({
        value: instance.id.toString(),
        label: `${instance.address1Depth} ${instance.address2Depth} ${instance.address3Depth || ''}`.trim(),
      }));
  }, [instances, currentResidence?.instanceId]);

  const isMoveValid = useMemo(() => {
    return selectedInstanceId !== null && selectedInstanceId !== currentResidence?.instanceId;
  }, [selectedInstanceId, currentResidence?.instanceId]);
  // #endregion

  // #region 핸들러
  const handleInstanceChange = useCallback((value: string) => {
    setSelectedInstanceId(value ? Number(value) : null);
  }, []);

  const handleExecuteMove = useCallback(async () => {
    if (!resident || !isMoveValid || isMoving) return;
    
    setIsMoving(true);
    setMoveError(null);
    setMoveSuccess(null);
    
    try {
      const result = await moveResident({
        residentId: resident.id,
        instanceId: selectedInstanceId as number,
        memo: moveMemo.trim() || undefined,
      });

      if (result.success) {
        const successMessage = '거주자 세대 이전이 성공적으로 완료되었습니다.';
        setMoveSuccess(successMessage);
        setSelectedInstanceId(null);
        setMoveMemo('');
        onMoveComplete(true, successMessage);
      } else {
        const errorMessage = `세대 이전에 실패했습니다: ${result.errorMsg}`;
        setMoveError(errorMessage);
        onMoveComplete(false, errorMessage);
      }
    } catch (error) {
      console.error('세대 이전 중 오류:', error);
      const errorMessage = '세대 이전 중 오류가 발생했습니다.';
      setMoveError(errorMessage);
      onMoveComplete(false, errorMessage);
    } finally {
      setIsMoving(false);
    }
  }, [resident, isMoveValid, isMoving, selectedInstanceId, moveMemo, onMoveComplete]);
  // #endregion



  return (
    <div className="p-6 rounded-lg border bg-card border-border">
      {moveError && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-md border border-red-200">
          {moveError}
        </div>
      )}
      {moveSuccess && (
        <div className="p-3 mb-4 text-sm text-green-700 bg-green-50 rounded-md border border-green-200">
          {moveSuccess}
        </div>
      )}

      <div className="space-y-4">

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              새 거주지 <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedInstanceId?.toString() || ''}
              onChange={(e) => handleInstanceChange(e.target.value)}
              disabled={isSearching || isMoving}
              className="px-3 py-2 w-full rounded-md border border-input bg-background"
            >
              <option value="">
                {isSearching ? '세대 목록을 불러오는 중...' : '이동할 세대을 선택하세요'}
              </option>
              {instanceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">이동 사유</label>
            <input
              type="text"
              value={moveMemo}
              onChange={(e) => setMoveMemo(e.target.value)}
              placeholder="이동 사유나 메모를 입력하세요"
              disabled={isMoving}
              className="px-3 py-2 w-full rounded-md border border-input bg-background"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <CrudButton
            action="save"
            onClick={handleExecuteMove}
            disabled={!isMoveValid || isMoving || isSearching}
            title={isMoving ? '이동 중...' : !isMoveValid ? '세대을 선택해주세요' : '세대 이전 실행'}
          >
            {isMoving ? '이동 중...' : '이동 실행'}
          </CrudButton>
        </div>
      </div>
    </div>
  );
}
