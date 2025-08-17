'use client';

import React, { useState } from 'react';
import { Users, User, Phone, Mail, Calendar, UserCheck, Plus, Link } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ResidentInstanceWithResident } from '@/types/instance';
import InstanceItemCard, { InstanceItemCardField, InstanceItemCardBadge } from '@/components/ui/ui-layout/info-card/InstanceItemCard';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import Modal from '@/components/ui/ui-layout/modal/Modal';

interface InstanceResidentListProps {
  residentInstances?: ResidentInstanceWithResident[];
  loading?: boolean;
  instanceId?: number;
  onDataChange?: () => void;
}

export default function InstanceResidentList({ 
  residentInstances = [], 
  loading = false,
  instanceId,
  onDataChange
}: InstanceResidentListProps) {
  const router = useRouter();
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'detail' | 'exclude' | 'delete';
    residentId: number;
    residentName: string;
  }>({
    isOpen: false,
    type: 'detail',
    residentId: 0,
    residentName: ''
  });

  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    type: 'create' | 'connect';
  }>({
    isOpen: false,
    type: 'create'
  });

  const handleResidentClick = (residentId: number) => {
    router.push(`/parking/occupancy/resident/${residentId}`);
  };

  const handleDetailClick = (residentId: number, residentName: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'detail',
      residentId,
      residentName
    });
  };

  const handleExcludeClick = (residentId: number, residentName: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'exclude',
      residentId,
      residentName
    });
  };

  const handleDeleteClick = (residentId: number, residentName: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'delete',
      residentId,
      residentName
    });
  };

  const handleConfirm = () => {
    switch (confirmModal.type) {
      case 'detail':
        handleResidentClick(confirmModal.residentId);
        break;
      case 'exclude':
        // TODO: 세대과의 연결 해지 로직
        console.log('제외 처리:', confirmModal.residentId);
        break;
      case 'delete':
        // TODO: 거주민 정보 삭제 로직
        console.log('삭제 처리:', confirmModal.residentId);
        break;
    }
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleCreateClick = () => {
    setActionModal({
      isOpen: true,
      type: 'create'
    });
  };

  const handleConnectClick = () => {
    setActionModal({
      isOpen: true,
      type: 'connect'
    });
  };

  const handleActionConfirm = () => {
    switch (actionModal.type) {
      case 'create':
        // TODO: 새 거주민 생성 로직
        console.log('새 거주민 생성:', instanceId);
        break;
      case 'connect':
        // TODO: 기존 거주민 연결 로직
        console.log('거주민 연결:', instanceId);
        break;
    }
    setActionModal(prev => ({ ...prev, isOpen: false }));
    // 데이터 새로고침
    if (onDataChange) {
      onDataChange();
    }
  };

  const getModalContent = () => {
    switch (confirmModal.type) {
      case 'detail':
        return {
          title: '상세 화면 이동',
          message: `${confirmModal.residentName} 거주민의 상세 화면으로 이동하시겠습니까?`
        };
      case 'exclude':
        return {
          title: '세대 연결 해지',
          message: `${confirmModal.residentName} 거주민과 세대의 연결을 해지하시겠습니까?`
        };
      case 'delete':
        return {
          title: '거주민 정보 삭제',
          message: `${confirmModal.residentName} 거주민 정보를 서비스에서 완전히 삭제하시겠습니까?`
        };
      default:
        return { title: '', message: '' };
    }
  };

  const getActionModalContent = () => {
    switch (actionModal.type) {
      case 'create':
        return {
          title: '새 거주민 생성',
          message: '새로운 거주민을 생성하고 세대에 바로 등록합니까?'
        };
      case 'connect':
        return {
          title: '거주민 연결',
          message: '다른 거주민을 이 세대에 연결하시겠습니까?'
        };
      default:
        return { title: '', message: '' };
    }
  };

  if (loading) {
    return (
      <SectionPanel 
        title="거주민 목록" 
        subtitle="세대에 등록된 거주민을 관리합니다."
        icon={<Users size={18} />}
        headerActions={(
          <div className="flex gap-1 items-center">
            <button
              onClick={handleCreateClick}
              className="flex justify-center items-center w-8 h-8 rounded-full transition-colors hover:bg-green-100 text-muted-foreground hover:text-green-600"
              title="새 거주민 생성"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={handleConnectClick}
              className="flex justify-center items-center w-8 h-8 rounded-full transition-colors hover:bg-blue-100 text-muted-foreground hover:text-blue-600"
              title="거주민 연결"
            >
              <Link size={16} />
            </button>
          </div>
        )}
      >
        <div className="flex justify-center items-center py-8">
          <div className="text-muted-foreground">로딩 중...</div>
        </div>
      </SectionPanel>
    );
  }

  return (
    <div>
      <SectionPanel 
      title={
        <span className="flex gap-2 items-center">
          거주민 목록
          <span className="text-sm text-muted-foreground">({residentInstances.length}명)</span>
        </span>
      }
      icon={<Users size={18} />}
      headerActions={(
        <div className="flex gap-1 items-center">
          <button
            onClick={handleCreateClick}
            className="flex justify-center items-center w-8 h-8 rounded-full transition-colors hover:bg-green-100 text-muted-foreground hover:text-green-600"
            title="새 거주민 생성"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={handleConnectClick}
            className="flex justify-center items-center w-8 h-8 rounded-full transition-colors hover:bg-blue-100 text-muted-foreground hover:text-blue-600"
            title="거주민 연결"
          >
            <Link size={16} />
          </button>
        </div>
      )}
    >

        {residentInstances.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-8 text-center">
            <User size={32} className="mb-3 text-muted-foreground" />
            <h4 className="mb-1 text-sm font-medium text-foreground">
              등록된 거주민이 없습니다
            </h4>
            <p className="text-xs text-muted-foreground">
              이 세대에 거주민을 추가해보세요
            </p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {residentInstances.map((residentInstance) => {
              // 배지 정보
              const badges: InstanceItemCardBadge[] = [];
              if (residentInstance.status) {
                badges.push({
                  text: residentInstance.status === 'ACTIVE' ? '활성' : residentInstance.status,
                  variant: residentInstance.status === 'ACTIVE' ? 'success' : 'default'
                });
              }

              // 좌측 열 데이터
              const leftColumn: InstanceItemCardField[] = [
                {
                  icon: <Phone />,
                  value: residentInstance.resident.phone || '전화번호 없음'
                },
                {
                  icon: <Mail />,
                  value: residentInstance.resident.email || '',
                  show: !!residentInstance.resident.email
                }
              ];

              // 우측 열 데이터
              const rightColumn: InstanceItemCardField[] = [
                {
                  icon: <UserCheck />,
                  value: residentInstance.resident.gender === 'M' ? '남성' : 
                         residentInstance.resident.gender === 'F' ? '여성' : 
                         residentInstance.resident.gender || '',
                  show: !!residentInstance.resident.gender
                },
                {
                  icon: <Calendar />,
                  value: residentInstance.resident.birthDate 
                    ? new Date(residentInstance.resident.birthDate).toLocaleDateString('ko-KR')
                    : '',
                  show: !!residentInstance.resident.birthDate
                }
              ];

              return (
                <InstanceItemCard
                  key={residentInstance.id}
                  headerIcon={<User />}
                  title={residentInstance.resident.name}
                  badges={badges}
                  leftColumn={leftColumn}
                  rightColumn={rightColumn}
                  memo={residentInstance.memo || undefined}
                  onDetail={() => handleDetailClick(residentInstance.resident.id, residentInstance.resident.name)}
                  onExclude={() => handleExcludeClick(residentInstance.resident.id, residentInstance.resident.name)}
                  onDelete={() => handleDeleteClick(residentInstance.resident.id, residentInstance.resident.name)}
                />
              );
            })}
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

      {/* 액션 모달 */}
      <Modal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal(prev => ({ ...prev, isOpen: false }))}
        title={getActionModalContent().title}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-center text-foreground">
            {getActionModalContent().message}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setActionModal(prev => ({ ...prev, isOpen: false }))}
              className="px-4 py-2 text-sm rounded-md border border-border text-muted-foreground hover:bg-muted"
            >
              취소
            </button>
            <button
              onClick={handleActionConfirm}
              className="px-4 py-2 text-sm text-white rounded-md bg-primary hover:bg-primary/90"
            >
              확인
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
