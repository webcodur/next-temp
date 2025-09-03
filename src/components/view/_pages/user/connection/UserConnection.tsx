'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/ui-input/button/Button';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';

import Modal from '@/components/ui/ui-layout/modal/Modal';
import UserInstanceTable from './UserInstanceTable';
import InstanceSearchSection, { InstanceSearchField, DisabledInstance, ColumnConfiguration } from '@/components/ui/ui-input/instance-search/InstanceSearchSection';
import InstanceTransferModal, { TransferFromInfo, AdditionalFieldConfig } from '@/components/ui/ui-input/instance-transfer/InstanceTransferModal';

import { createUserInstance } from '@/services/users/users_instances_POST';
import { deleteUserInstance } from '@/services/users/users_instances@id_DELETE';
import { updateUserInstance } from '@/services/users/users_instances@id_PATCH';
import { Instance } from '@/types/instance';
import { CreateUserInstanceRequest, UpdateUserInstanceRequest, UserDetail, UserInstanceWithInstance } from '@/types/user';

interface UserConnectionProps {
  user: UserDetail;
  onDataChange: () => void;
  onOperationComplete: (success: boolean, message: string) => void;
}

export default function UserConnection({ 
  user, 
  onDataChange,
  onOperationComplete
}: UserConnectionProps) {
  const router = useRouter();
  
  // #region 상태 관리
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null);
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDisconnectCompleteModal, setShowDisconnectCompleteModal] = useState(false);
  const [showCreateConnectionModal, setShowCreateConnectionModal] = useState(false);
  const [showEditConnectionModal, setShowEditConnectionModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveFromUser, setMoveFromUser] = useState<UserInstanceWithInstance | null>(null);
  const [editConnectionTarget, setEditConnectionTarget] = useState<UserInstanceWithInstance | null>(null);
  // #endregion

  // #region 기존 세대 ID 목록 및 비활성화 항목 설정
  const existingInstanceIds = useMemo(() => {
    if (!user?.userInstance || !Array.isArray(user.userInstance)) {
      return [];
    }
    return user.userInstance.map(ri => ri.instanceId);
  }, [user?.userInstance]);

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
      const currentInstanceCount = user?.userInstance?.length || 0;
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
  }, [onDataChange, onOperationComplete, user?.userInstance?.length]);

  const handleDisconnectCompleteConfirm = useCallback(() => {
    setShowDisconnectCompleteModal(false);
    router.push('/parking/occupancy/user');
  }, [router]);

  const handleInstanceSelect = useCallback((instance: Instance) => {
    setSelectedInstance(instance);
  }, []);

  const handleCreateConnection = useCallback(() => {
    setShowCreateConnectionModal(true);
  }, []);

  const handleMoveFromHere = useCallback((userInstance: UserInstanceWithInstance) => {
    setMoveFromUser(userInstance);
    setShowMoveModal(true);
  }, []);

  const handleEditConnection = useCallback((userInstance: UserInstanceWithInstance) => {
    setEditConnectionTarget(userInstance);
    setMemo(userInstance.memo || '');
    setShowEditConnectionModal(true);
  }, []);

  const handleEditConnectionSubmit = useCallback(async () => {
    if (!editConnectionTarget || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const updateData: UpdateUserInstanceRequest = {
        memo: memo.trim() || undefined,
      };

      const result = await updateUserInstance(editConnectionTarget.id, updateData);

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
        onOperationComplete(false, '연결 정보 수정에 실패했습니다.');
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

    if (!user?.id) {
      onOperationComplete(false, '사용자 정보가 유효하지 않습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData: CreateUserInstanceRequest = {
        userId: user.id,
        instanceId: selectedInstance.id,
        memo: memo.trim() || undefined,
      };

      const result = await createUserInstance(requestData);
      
      if (result.success) {
        const address = `${selectedInstance.address1Depth} ${selectedInstance.address2Depth} ${selectedInstance.address3Depth || ''}`.trim();
        const userName = user?.name || '사용자';
        
        // 성공 처리 (데이터 새로고침 포함)
        await handleOperationCompleteInternal(true, `${userName}님과 ${address} 세대의 관계가 성공적으로 생성되었습니다.`);
        
        // 폼 초기화 및 모달 닫기
        setSelectedInstance(null);
        setMemo('');
        setShowCreateConnectionModal(false);
      } else {
        onOperationComplete(false, '관계 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('관계 생성 중 오류:', error);
      onOperationComplete(false, '관계 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedInstance, user?.id, user?.name, memo, handleOperationCompleteInternal, onOperationComplete]);

  const handleMoveSubmit = useCallback(async () => {
    if (!moveFromUser || !selectedInstance || !user || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // 1단계: 기존 관계 삭제
      const deleteResult = await deleteUserInstance(moveFromUser.id);
      
      if (!deleteResult.success) {
        throw new Error(`기존 관계 해제에 실패했습니다: ${deleteResult.errorMsg}`);
      }

      // 2단계: 새 관계 생성
      const createData: CreateUserInstanceRequest = {
        userId: user.id,
        instanceId: selectedInstance.id,
        memo: memo.trim() || '세대 이전',
      };

      const createResult = await createUserInstance(createData);
      
      if (!createResult.success) {
        throw new Error(`새 관계 생성에 실패했습니다: ${createResult.errorMsg}`);
      }

      // 성공 처리
      const fromAddress = moveFromUser.instance ? 
        `${moveFromUser.instance.address1Depth} ${moveFromUser.instance.address2Depth} ${moveFromUser.instance.address3Depth || ''}`.trim() 
        : '이전 세대';
      const toAddress = `${selectedInstance.address1Depth} ${selectedInstance.address2Depth} ${selectedInstance.address3Depth || ''}`.trim();
      
      const successMessage = `${user.name}님이 ${fromAddress}에서 ${toAddress}로 성공적으로 이전되었습니다.`;
      
      // 폼 초기화 및 모달 닫기
      setSelectedInstance(null);
      setMemo('');
      setMoveFromUser(null);
      setShowMoveModal(false);
      
      await handleOperationCompleteInternal(true, successMessage);
      
    } catch (error) {
      console.error('세대 이전 중 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '세대 이전 중 오류가 발생했습니다.';
      onOperationComplete(false, errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [moveFromUser, selectedInstance, user, memo, isSubmitting, handleOperationCompleteInternal, onOperationComplete]);

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

  // #region 세대 이전 모달을 위한 데이터 변환
  const moveFromInfo: TransferFromInfo | null = useMemo(() => {
    if (!moveFromUser) return null;
    
    return {
      id: moveFromUser.id,
      instanceId: moveFromUser.instanceId,
      displayName: `세대 ID: ${moveFromUser.instanceId}`,
      instanceType: moveFromUser.instance?.instanceType,
      address: moveFromUser.instance ? {
        address1Depth: moveFromUser.instance.address1Depth,
        address2Depth: moveFromUser.instance.address2Depth,
        address3Depth: moveFromUser.instance.address3Depth,
      } : undefined,
    };
  }, [moveFromUser]);

  const moveAdditionalFields: AdditionalFieldConfig[] = useMemo(() => [
    {
      type: 'text',
      key: 'memo',
      label: '이전 사유',
      placeholder: '이전 사유나 메모를 입력하세요',
      description: '선택사항',
      value: memo,
      onChange: (value: string | boolean) => setMemo(value as string),
      disabled: false,
    }
  ], [memo]);

  const handleMoveModalClose = useCallback(() => {
    setShowMoveModal(false);
    setSelectedInstance(null);
    setMemo('');
    setMoveFromUser(null);
  }, []);

  const moveRowClassName = useCallback((instance: Instance) => {
    const isSelected = selectedInstance?.id === instance.id;
    const isCurrentUser = moveFromUser && instance.id === moveFromUser.instanceId;
    return isSelected ? 'cursor-pointer hover:bg-muted/50 bg-green-50 border-green-200' : 
          isCurrentUser ? 'cursor-not-allowed bg-orange-50 border-orange-200 opacity-50' :
          'cursor-pointer hover:bg-muted/50';
  }, [selectedInstance, moveFromUser]);


  // #endregion

  return (
    <div className="space-y-6">
      <SectionPanel 
        title="[ 사용자 - 세대 ] 연결 목록"
        subtitle="사용자와 연결된 세대 목록을 확인할 수 있습니다."
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
          <UserInstanceTable 
            userInstances={user?.userInstance && Array.isArray(user.userInstance) ? user.userInstance : []}
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
              해당 사용자는 건물의 모든 세대에서 연결이 해제되어 더이상 시스템에서 확인할 수 없습니다.
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
            <strong>{user?.name}</strong>님과 연결할 세대를 선택해주세요.
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
      <InstanceTransferModal
        isOpen={showMoveModal}
        onClose={handleMoveModalClose}
        title="세대 이전"
        fromInfo={moveFromInfo}
        fromLabel="이전 출발지"
        fromColorClass="orange"
        selectedToInstance={selectedInstance}
        toLabel="이전 목적지"
        toColorClass="green"
        searchFields={searchFields}
        excludeInstanceIds={[]}
        onInstanceSelect={handleInstanceSelect}
        getRowClassName={moveRowClassName}
        additionalFields={moveAdditionalFields}
        onSubmit={handleMoveSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="세대 이전 실행"
        isSubmitDisabled={!selectedInstance}
      />
    </div>
  );
}