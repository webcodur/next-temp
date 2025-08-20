'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Link, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/ui-input/button/Button';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';

import Modal from '@/components/ui/ui-layout/modal/Modal';
import ResidentInstanceTable from './ResidentInstanceTable';
import InstanceSearchSection, { InstanceSearchField, DisabledInstance, ColumnConfiguration } from '@/components/ui/ui-input/instance-search/InstanceSearchSection';

import { createResidentInstance } from '@/services/residents/residents_instances_POST';
import { deleteResidentInstance } from '@/services/residents/residents_instances@id_DELETE';
import { updateResidentInstance } from '@/services/residents/residents_instances@id_PATCH';
import { Instance } from '@/types/instance';
import { CreateResidentInstanceRequest, UpdateResidentInstanceRequest, ResidentDetail, ResidentInstanceWithInstance } from '@/types/resident';

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
  const router = useRouter();
  
  // #region 상태 관리
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null);
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDisconnectCompleteModal, setShowDisconnectCompleteModal] = useState(false);
  const [showCreateConnectionModal, setShowCreateConnectionModal] = useState(false);
  const [showEditConnectionModal, setShowEditConnectionModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveFromResidence, setMoveFromResidence] = useState<ResidentInstanceWithInstance | null>(null);
  const [editConnectionTarget, setEditConnectionTarget] = useState<ResidentInstanceWithInstance | null>(null);
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
    // 해지 작업 성공 시 연결된 세대가 1개였다면 모달 표시
    if (success && message.includes('관계가 성공적으로 해제되었습니다')) {
      const currentInstanceCount = resident?.residentInstance?.length || 0;
      if (currentInstanceCount === 1) {
        // 해지 전에 1개였으므로 해지 후 0개가 됨 -> 안내 모달 표시
        setShowDisconnectCompleteModal(true);
        return;
      }
    }
    
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
  }, [onDataChange, onOperationComplete, resident?.residentInstance?.length]);

  const handleDisconnectCompleteConfirm = useCallback(() => {
    setShowDisconnectCompleteModal(false);
    router.push('/parking/occupancy/resident');
  }, [router]);

  const handleInstanceSelect = useCallback((instance: Instance) => {
    setSelectedInstance(instance);
  }, []);

  const handleCreateConnection = useCallback(() => {
    setShowCreateConnectionModal(true);
  }, []);

  const handleMoveFromHere = useCallback((residence: ResidentInstanceWithInstance) => {
    setMoveFromResidence(residence);
    setShowMoveModal(true);
  }, []);

  const handleEditConnection = useCallback((residence: ResidentInstanceWithInstance) => {
    setEditConnectionTarget(residence);
    setMemo(residence.memo || '');
    setShowEditConnectionModal(true);
  }, []);

  const handleEditConnectionSubmit = useCallback(async () => {
    if (!editConnectionTarget || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const updateData: UpdateResidentInstanceRequest = {
        memo: memo.trim() || undefined,
      };

      const result = await updateResidentInstance(editConnectionTarget.id, updateData);

      if (result.success) {
        const address = editConnectionTarget.instance ? 
          `${editConnectionTarget.instance.address1Depth} ${editConnectionTarget.instance.address2Depth} ${editConnectionTarget.instance.address3Depth || ''}`.trim() 
          : '세대';
        
        // 성공 처리
        await handleOperationCompleteInternal(true, `${address}와의 연결 정보가 성공적으로 수정되었습니다.`);
        
        // 폼 초기화 및 모달 닫기
        setEditConnectionTarget(null);
        setMemo('');
        setShowEditConnectionModal(false);
      } else {
        onOperationComplete(false, `연결 정보 수정에 실패했습니다: ${result.errorMsg}`);
      }
    } catch (error) {
      console.error('연결 정보 수정 중 오류:', error);
      onOperationComplete(false, '연결 정보 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }, [editConnectionTarget, memo, isSubmitting, handleOperationCompleteInternal, onOperationComplete]);

  const handleSubmit = useCallback(async () => {
    if (!selectedInstance) {
      onOperationComplete(false, '세대를 선택해주세요.');
      return;
    }

    if (!resident?.id) {
      onOperationComplete(false, '주민 정보가 유효하지 않습니다.');
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
        const residentName = resident?.name || '주민';
        
        // 성공 처리 (데이터 새로고침 포함)
        await handleOperationCompleteInternal(true, `${residentName}님과 ${address} 세대의 관계가 성공적으로 생성되었습니다.`);
        
        // 폼 초기화 및 모달 닫기
        setSelectedInstance(null);
        setMemo('');
        setShowCreateConnectionModal(false);
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

  const handleMoveSubmit = useCallback(async () => {
    if (!moveFromResidence || !selectedInstance || !resident || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // 1단계: 기존 관계 삭제
      const deleteResult = await deleteResidentInstance(moveFromResidence.id);
      
      if (!deleteResult.success) {
        throw new Error(`기존 관계 해제에 실패했습니다: ${deleteResult.errorMsg}`);
      }

      // 2단계: 새 관계 생성
      const createData: CreateResidentInstanceRequest = {
        residentId: resident.id,
        instanceId: selectedInstance.id,
        memo: memo.trim() || '세대 이전',
      };

      const createResult = await createResidentInstance(createData);
      
      if (!createResult.success) {
        throw new Error(`새 관계 생성에 실패했습니다: ${createResult.errorMsg}`);
      }

      // 성공 처리
      const fromAddress = moveFromResidence.instance ? 
        `${moveFromResidence.instance.address1Depth} ${moveFromResidence.instance.address2Depth} ${moveFromResidence.instance.address3Depth || ''}`.trim() 
        : '이전 세대';
      const toAddress = `${selectedInstance.address1Depth} ${selectedInstance.address2Depth} ${selectedInstance.address3Depth || ''}`.trim();
      
      const successMessage = `${resident.name}님이 ${fromAddress}에서 ${toAddress}로 성공적으로 이전되었습니다.`;
      
      // 폼 초기화 및 모달 닫기
      setSelectedInstance(null);
      setMemo('');
      setMoveFromResidence(null);
      setShowMoveModal(false);
      
      await handleOperationCompleteInternal(true, successMessage);
      
    } catch (error) {
      console.error('세대 이전 중 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '세대 이전 중 오류가 발생했습니다.';
      onOperationComplete(false, errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [moveFromResidence, selectedInstance, resident, memo, isSubmitting, handleOperationCompleteInternal, onOperationComplete]);

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
      <SectionPanel 
        title="[ 주민 - 세대 ] 연결 목록"
        subtitle="주민과 연결된 세대 목록을 확인할 수 있습니다."
        icon={<Link size={18} />}
        headerActions={
          <Button
            variant="outline"
            size="default"
            onClick={handleCreateConnection}
            className="gap-1"
          >
            <Link size={14} />
            세대 연결 추가
          </Button>
        }
      >
        <div className="space-y-4">
          <ResidentInstanceTable 
            residentInstances={resident?.residentInstance && Array.isArray(resident.residentInstance) ? resident.residentInstance : []}
            onCreateRelation={() => {}} // 더이상 사용하지 않음
            onDeleteComplete={handleOperationCompleteInternal}
            onMoveFromHere={handleMoveFromHere}
            onEditConnection={handleEditConnection}
          />
        </div>
      </SectionPanel>

      {/* 연결 해제 완료 안내 모달 */}
      <Modal
        isOpen={showDisconnectCompleteModal}
        onClose={handleDisconnectCompleteConfirm}
        title="세대 연결 해제 완료"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground">
              해당 주민은 건물의 모든 세대에서 연결이 해제되어 더이상 시스템에서 확인할 수 없습니다.
            </p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={handleDisconnectCompleteConfirm}>
              확인
            </Button>
          </div>
        </div>
      </Modal>

      {/* 새 연결 추가 모달 */}
      <Modal
        isOpen={showCreateConnectionModal}
        onClose={() => {
          setShowCreateConnectionModal(false);
          setSelectedInstance(null);
          setMemo('');
        }}
        title="새 세대 연결 생성"
        size="lg"
      >
        <div className="space-y-6">
          <div className="text-sm text-muted-foreground">
            <strong>{resident?.name}</strong>님과 연결할 세대를 선택해주세요.
          </div>

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
            pageSize={5}
            minWidth="800px"
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
              variant="ghost"
              onClick={() => {
                setShowCreateConnectionModal(false);
                setSelectedInstance(null);
                setMemo('');
              }}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedInstance || isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? '생성 중...' : '관계 생성'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 연결 정보 수정 모달 */}
      <Modal
        isOpen={showEditConnectionModal}
        onClose={() => {
          setShowEditConnectionModal(false);
          setEditConnectionTarget(null);
          setMemo('');
        }}
        title="연결 정보 수정"
        size="md"
      >
        <div className="space-y-6">
          {/* 현재 연결 정보 표시 */}
          {editConnectionTarget && (
            <div className="p-4 rounded-lg border bg-card">
              <div className="mb-2">
                <span className="font-medium text-foreground">
                  연결된 세대 정보
                </span>
              </div>
              <p className="mb-2 text-sm text-foreground">
                {editConnectionTarget.instance ? (
                  <>
                    {editConnectionTarget.instance.address1Depth} {editConnectionTarget.instance.address2Depth} {editConnectionTarget.instance.address3Depth || ''}
                    <span className="px-2 py-1 ml-2 text-xs rounded bg-muted">
                      {{
                        GENERAL: '일반',
                        TEMP: '임시',
                        COMMERCIAL: '상업',
                      }[editConnectionTarget.instance.instanceType] || editConnectionTarget.instance.instanceType}
                    </span>
                  </>
                ) : (
                  `세대 ID: ${editConnectionTarget.instanceId}`
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                연결일: {new Date(editConnectionTarget.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* 메모 수정 */}
          <div className="space-y-3">
            <label htmlFor="editMemo" className="block text-sm font-medium text-foreground">
              메모 <span className="text-xs text-muted-foreground">(관계에 대한 추가 정보)</span>
            </label>
            <textarea
              id="editMemo"
              placeholder="메모를 입력하세요"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={4}
              disabled={isSubmitting}
              className="px-3 py-2 w-full text-sm rounded-md border resize-none border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => {
                setShowEditConnectionModal(false);
                setEditConnectionTarget(null);
                setMemo('');
              }}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              onClick={handleEditConnectionSubmit}
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? '수정 중...' : '수정 완료'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 세대 이전 모달 */}
      <Modal
        isOpen={showMoveModal}
        onClose={() => {
          setShowMoveModal(false);
          setSelectedInstance(null);
          setMemo('');
          setMoveFromResidence(null);
        }}
        title="세대 이전"
        size="lg"
      >
        <div className="space-y-6">
          {/* 이전 정보 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* 출발 세대 */}
            <div className="p-4 bg-orange-50 rounded-lg border">
              <div className="flex gap-2 items-center mb-2">
                <Home size={16} className="text-orange-600" />
                <span className="font-medium text-orange-800">이전 출발지</span>
              </div>
              {moveFromResidence?.instance ? (
                <p className="text-sm text-orange-700">
                  {moveFromResidence.instance.address1Depth} {moveFromResidence.instance.address2Depth} {moveFromResidence.instance.address3Depth || ''}
                  <span className="px-2 py-1 ml-2 text-xs text-orange-800 bg-orange-200 rounded">
                    {{
                      GENERAL: '일반',
                      TEMP: '임시',
                      COMMERCIAL: '상업',
                    }[moveFromResidence.instance.instanceType] || moveFromResidence.instance.instanceType}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-orange-600">출발지 정보 없음</p>
              )}
            </div>

            {/* 도착 세대 */}
            <div className="p-4 bg-green-50 rounded-lg border">
              <div className="flex gap-2 items-center mb-2">
                <Home size={16} className="text-green-600" />
                <span className="font-medium text-green-800">이전 목적지</span>
              </div>
              {selectedInstance ? (
                <p className="text-sm text-green-700">
                  {selectedInstance.address1Depth} {selectedInstance.address2Depth} {selectedInstance.address3Depth || ''}
                  <span className="px-2 py-1 ml-2 text-xs text-green-800 bg-green-200 rounded">
                    {{
                      GENERAL: '일반',
                      TEMP: '임시',
                      COMMERCIAL: '상업',
                    }[selectedInstance.instanceType] || selectedInstance.instanceType}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-green-600">아래에서 목적지를 선택해주세요</p>
              )}
            </div>
          </div>

          {/* 세대 검색 및 목록 */}
          <InstanceSearchSection
            searchFields={searchFields}
            tableType="base"
            columnConfig={columnConfig}
            onRowClick={handleInstanceSelect}
            getRowClassName={(instance: Instance) => {
              const isSelected = selectedInstance?.id === instance.id;
              const isCurrentResidence = moveFromResidence && instance.id === moveFromResidence.instanceId;
              return isSelected ? 'cursor-pointer hover:bg-muted/50 bg-green-50 border-green-200' : 
                    isCurrentResidence ? 'cursor-not-allowed bg-orange-50 border-orange-200 opacity-50' :
                    'cursor-pointer hover:bg-muted/50';
            }}
            showSection={false}
            searchMode="server"
            excludeInstanceIds={[]}
            disabledInstances={useMemo(() => {
              if (!moveFromResidence) return [];
              
              return existingInstanceIds.map(instanceId => {
                if (instanceId === moveFromResidence.instanceId) {
                  return {
                    instanceId,
                    disabledText: '현재 거주지 (출발지)',
                    disabledClassName: 'bg-orange-50',
                  };
                } else {
                  return {
                    instanceId,
                    disabledText: '이미 연결됨',
                    disabledClassName: '',
                  };
                }
              });
            }, [moveFromResidence, existingInstanceIds])}
            pageSize={5}
            minWidth="800px"
            title="새 거주지 검색"
            subtitle="이전할 목적지 세대를 검색하고 선택하세요"
          />

          {/* 이전 사유 입력 */}
          <div className="p-4 rounded-lg border bg-card">
            <div className="space-y-3">
              <label htmlFor="moveMemo" className="block text-sm font-medium text-foreground">
                이전 사유 <span className="text-xs text-muted-foreground">(선택사항)</span>
              </label>
              <input
                id="moveMemo"
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="이전 사유나 메모를 입력하세요"
                disabled={isSubmitting}
                className="px-3 py-2 w-full text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => {
                setShowMoveModal(false);
                setSelectedInstance(null);
                setMemo('');
                setMoveFromResidence(null);
              }}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              onClick={handleMoveSubmit}
              disabled={!selectedInstance || isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? '이전 중...' : '세대 이전 실행'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
