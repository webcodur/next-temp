/* 
  파일명: /components/view/_pages/instance/basic/user-panel/InstanceUserList.tsx
  기능: 세대에 연결된 사용자 목록 및 관리 컴포넌트
  책임: 사용자 연결/해제, 차량 연결 관리, 상세보기 및 삭제 기능을 제공한다.
*/ // ------------------------------

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Users, User, Link } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { toast } from '@/components/ui/ui-effects/toast/Toast';
import { deleteUser } from '@/services/users/users@id_DELETE';
import { deleteUserInstance } from '@/services/users/users_instances@id_DELETE';

import UserSearchModal from './UserSearchModal';
import UserCardItem from './UserCardItem';

import type { CarUserWithDetails } from '@/types/car';
import type { UserInstanceWithUser } from '@/types/instance';

// #region 타입 및 인터페이스
interface InstanceUserListProps {
  userInstances?: UserInstanceWithUser[];
  loading?: boolean;
  instanceId?: number;
  onDataChange?: () => void;
  userManagementMode?: boolean;

  carUsers?: CarUserWithDetails[];
  loadingCarUsers?: boolean;
  onConnectUser?: (userId: number) => void;
  onDisconnectUser?: (userId: number) => void;
  onTogglePrimary?: (userId: number) => void;
  onToggleAlarm?: (userId: number) => void;
  
  // 연결 상태 확인 헬퍼
  isUserConnectedToSelectedCar?: (userId: number) => boolean;
}
// #endregion

export default function InstanceUserList({ 
  userInstances = [], 
  loading = false,
  instanceId,
  onDataChange,
  userManagementMode = false,

  carUsers = [],
  loadingCarUsers = false,
  onConnectUser,
  onDisconnectUser,
  onTogglePrimary,
  onToggleAlarm,
  
  // 연결 상태 확인 헬퍼
  isUserConnectedToSelectedCar
}: InstanceUserListProps) {
  // #region 상태
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'detail' | 'exclude' | 'delete';
    userId: number;
    userName: string;
  }>({
    isOpen: false,
    type: 'detail',
    userId: 0,
    userName: ''
  });

  const [connectModalOpen, setConnectModalOpen] = useState(false);
  // #endregion

  // #region 훅
  const router = useRouter();
  // #endregion

  // #region 핸들러
  const handleUserClick = (userId: number) => {
    router.push(`/parking/occupancy/user/${userId}`);
  };

  const handleDetailClick = (userId: number, userName: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'detail',
      userId,
      userName
    });
  };

  const handleExcludeClick = (userId: number, userName: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'exclude',
      userId,
      userName
    });
  };

  const handleDeleteClick = (userId: number, userName: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'delete',
      userId,
      userName
    });
  };

  const handleConfirm = async () => {
    try {
      switch (confirmModal.type) {
        case 'detail':
          handleUserClick(confirmModal.userId);
          break;
        case 'exclude':
          // 사용자-세대 연결 해지 (서버에서 관련 차량-사용자 연결도 함께 정리됨)
          const userInstance = userInstances?.find(ri => ri.user.id === confirmModal.userId);
          if (userInstance) {
            const result = await deleteUserInstance(userInstance.id);
            if (result.success) {
              toast.success('사용자-세대 연결이 성공적으로 해지되었습니다.');
              // 데이터 새로고침
              if (onDataChange) {
                onDataChange();
              }
            } else {
              console.error('사용자-세대 연결 해지 실패:', '대상 작업에 실패했습니다.');
              toast.error('사용자-세대 연결 해지에 실패했습니다.');
            }
          }
          break;
        case 'delete':
          // 사용자 완전 삭제
          const deleteResult = await deleteUser(confirmModal.userId);
          if (deleteResult.success) {
            toast.success('사용자가 성공적으로 삭제되었습니다.');
            // 데이터 새로고침
            if (onDataChange) {
              onDataChange();
            }
          } else {
            console.error('사용자 삭제 실패:', '대상 작업에 실패했습니다.');
            toast.error('사용자 삭제에 실패했습니다.');
          }
          break;
      }
    } catch (error) {
      console.error('작업 중 오류 발생:', error);
      toast.error('작업 중 오류가 발생했습니다.');
    } finally {
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
    }
  };

  const handleConnectClick = () => {
    setConnectModalOpen(true);
  };

  const handleModalSuccess = () => {
    // 사용자 연결 성공 시 데이터 새로고침
    toast.success('사용자 연결이 완료되었습니다.');
    if (onDataChange) {
      onDataChange();
    }
  };

  const getModalContent = () => {
    switch (confirmModal.type) {
      case 'detail':
        return {
          title: '상세 화면 이동',
          message: `${confirmModal.userName} 사용자의 상세 화면으로 이동하시겠습니까?`
        };
      case 'exclude':
        return {
          title: '세대 연결 해지',
          message: `${confirmModal.userName} 사용자와 세대의 연결을 해지하시겠습니까?`
        };
      case 'delete':
        return {
          title: '사용자 정보 삭제',
          message: `${confirmModal.userName} 사용자 정보를 전체 서비스에서 완전히 삭제하시겠습니까?`
        };
      default:
        return { title: '', message: '' };
    }
  };

  if (loading) {
    return (
      <SectionPanel 
        title="연결된 사용자" 
        subtitle="세대에 등록된 사용자를 관리합니다."
        icon={<Users size={18} />}
        headerActions={(
          <div className="flex gap-1 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleConnectClick}
              title="사용자 연결"
              icon={Link}
            />
          </div>
        )}
      >
        <div className="flex justify-center items-center py-8">
          <div className="text-muted-foreground">로딩 중...</div>
        </div>
      </SectionPanel>
    );
  }

  // #endregion

  // #region 렌더링
  return (
    <div className="relative">
      <SectionPanel 
      title={
        <span className="flex gap-2 items-center">
          연결된 사용자
          <span className="text-sm text-muted-foreground">({userInstances.length}명)</span>
        </span>
      }
      icon={<Users size={18} />}
      headerActions={(
        <div className="flex gap-1 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleConnectClick}
            title="사용자 연결"
            icon={Link}
          />
        </div>
      )}
    >

        {userInstances.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-8 text-center">
            <User size={32} className="mb-3 text-muted-foreground" />
            <h4 className="mb-1 text-sm font-medium text-foreground">
              등록된 사용자가 없습니다
            </h4>
            <p className="text-xs text-muted-foreground">
              이 세대에 사용자를 추가해보세요
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {userInstances.map((userInstance) => (
              <UserCardItem
                key={userInstance.id}
                userInstance={userInstance}
                userManagementMode={userManagementMode}
                carUsers={carUsers}
                loadingCarUsers={loadingCarUsers}
                onDetailClick={handleDetailClick}
                onExcludeClick={handleExcludeClick}
                onDeleteClick={handleDeleteClick}
                onConnectUser={onConnectUser}
                onDisconnectUser={onDisconnectUser}
                onTogglePrimary={onTogglePrimary}
                onToggleAlarm={onToggleAlarm}
                isUserConnectedToSelectedCar={isUserConnectedToSelectedCar}
              />
            ))}
          </div>
        )}
      </SectionPanel>

      {/* 확인 모달 */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        title={getModalContent().title}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-center text-foreground">
            {getModalContent().message}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              className="px-4 py-2 text-sm rounded-md border border-border text-muted-foreground hover:bg-muted"
            >
              취소
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-sm text-white rounded-md bg-primary hover:bg-primary/90"
            >
              확인
            </button>
          </div>
        </div>
      </Modal>

      {/* 사용자 검색 및 연결 모달 */}
      {instanceId && (
        <UserSearchModal
          isOpen={connectModalOpen}
          onClose={() => setConnectModalOpen(false)}
          instanceId={instanceId}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
  // #endregion
}