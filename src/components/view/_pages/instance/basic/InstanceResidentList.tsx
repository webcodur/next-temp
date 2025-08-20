/* 
  파일명: /components/view/_pages/instance/basic/InstanceResidentList.tsx
  기능: 세대에 연결된 거주민 목록 및 관리 컴포넌트
  책임: 거주민 연결/해제, 차량 연결 관리, 상세보기 및 삭제 기능을 제공한다.
*/ // ------------------------------

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Users, User, Phone, Mail, Calendar, UserCheck, Link, Plus, Unplug, Car, X, CarFront, BellRing } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import InstanceItemCard, { InstanceItemCardField, InstanceItemCardBadge } from '@/components/ui/ui-layout/info-card/InstanceItemCard';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { deleteResident } from '@/services/residents/residents@id_DELETE';
import { deleteResidentInstance } from '@/services/residents/residents_instances@id_DELETE';

import ResidentSearchModal from './ResidentSearchModal';

import type { CarResidentWithDetails } from '@/types/car';
import type { ResidentInstanceWithResident } from '@/types/instance';

// #region 타입 및 인터페이스
interface InstanceResidentListProps {
  residentInstances?: ResidentInstanceWithResident[];
  loading?: boolean;
  instanceId?: number;
  onDataChange?: () => void;
  residentManagementMode?: boolean;
  selectedCarNumber?: string;
  carResidents?: CarResidentWithDetails[];
  loadingCarResidents?: boolean;
  onCloseResidentManagement?: () => void;
  onConnectResident?: (residentId: number) => void;
  onDisconnectResident?: (residentId: number) => void;
  onTogglePrimary?: (residentId: number) => void;
  onToggleAlarm?: (residentId: number) => void;
}
// #endregion

export default function InstanceResidentList({ 
  residentInstances = [], 
  loading = false,
  instanceId,
  onDataChange,
  residentManagementMode = false,
  selectedCarNumber = '',
  carResidents = [],
  loadingCarResidents = false,
  onCloseResidentManagement,
  onConnectResident,
  onDisconnectResident,
  onTogglePrimary,
  onToggleAlarm
}: InstanceResidentListProps) {
  // #region 상태
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

  const [connectModalOpen, setConnectModalOpen] = useState(false);
  // #endregion

  // #region 훅
  const router = useRouter();
  // #endregion

  // #region 핸들러
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

  const handleConfirm = async () => {
    try {
      switch (confirmModal.type) {
        case 'detail':
          handleResidentClick(confirmModal.residentId);
          break;
        case 'exclude':
          // 거주민-인스턴스 연결 해지
          const residentInstance = residentInstances?.find(ri => ri.resident.id === confirmModal.residentId);
          if (residentInstance) {
            const result = await deleteResidentInstance(residentInstance.id);
            if (result.success) {
              // 데이터 새로고침
              if (onDataChange) {
                onDataChange();
              }
            } else {
              console.error('연결 해지 실패:', result.errorMsg);
            }
          }
          break;
        case 'delete':
          // 거주민 완전 삭제
          const deleteResult = await deleteResident(confirmModal.residentId);
          if (deleteResult.success) {
            // 데이터 새로고침
            if (onDataChange) {
              onDataChange();
            }
          } else {
            console.error('거주민 삭제 실패:', deleteResult.errorMsg);
          }
          break;
      }
    } catch (error) {
      console.error('작업 중 오류 발생:', error);
    } finally {
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
    }
  };



  const handleConnectClick = () => {
    setConnectModalOpen(true);
  };

  const handleModalSuccess = () => {
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
          message: `${confirmModal.residentName} 거주민 정보를 전체 서비스에서 완전히 삭제하시겠습니까?`
        };
      default:
        return { title: '', message: '' };
    }
  };

  if (loading) {
    return (
      <SectionPanel 
        title="연결된 거주민" 
        subtitle="세대에 등록된 거주민을 관리합니다."
        icon={<Users size={18} />}
        headerActions={(
          <div className="flex gap-1 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleConnectClick}
              title="거주민 연결"
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

  // 거주민이 차량에 연결되어 있는지 확인
  const isResidentConnectedToCar = (residentId: number) => {
    return carResidents.some(carResident => carResident.id === residentId);
  };
  // #endregion

  // #region 렌더링
  return (
    <div className="relative">
      <SectionPanel 
      title={
        <span className="flex gap-2 items-center">
          연결된 거주민
          <span className="text-sm text-muted-foreground">({residentInstances.length}명)</span>
        </span>
      }
      icon={<Users size={18} />}
      headerActions={(
        <div className="flex gap-1 items-center">
          {residentManagementMode && (
            <div className="flex gap-2 items-center mr-2">
              <Car size={14} className="text-purple-600" />
              <span className="text-sm font-medium text-purple-600">{selectedCarNumber}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={onCloseResidentManagement}
                title="관리 모드 종료"
                icon={X}
                className="w-6 h-6 min-w-6"
              />
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleConnectClick}
            title="거주민 연결"
            icon={Link}
          />
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
          <div className="p-4 space-y-2">
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

              const isConnected = isResidentConnectedToCar(residentInstance.resident.id);
              const carResident = carResidents.find(cr => cr.id === residentInstance.resident.id);

              return (
                <div key={residentInstance.id} className="relative">
                  <InstanceItemCard
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
                  
                  {/* 거주민 관리 모드 overlay */}
                  {residentManagementMode && (
                    <div className="flex absolute right-0 bottom-0 left-0 top-16 z-10 justify-center items-center rounded-b-lg backdrop-blur-sm bg-black/10">
                      {loadingCarResidents ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 rounded-full text-sm text-muted-foreground shadow-sm">
                          <div className="w-3 h-3 rounded-full border-2 border-current animate-spin border-t-transparent"></div>
                          로딩 중...
                        </div>
                      ) : (
                        <div className="flex gap-3 items-center">
                          {isConnected ? (
                            <>
                              {/* 연결 해지 버튼 */}
                              <div className="relative group">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => onDisconnectResident && onDisconnectResident(residentInstance.resident.id)}
                                  title="차량 연결 해지"
                                  icon={Unplug}
                                  className="w-12 h-12 min-w-12 text-white bg-red-500 rounded-full shadow-lg transition-all duration-200 hover:bg-red-600 hover:scale-110 hover:shadow-xl border-none [&_svg]:size-5 [&_svg]:transition-all [&_svg]:duration-200 [&_svg]:group-hover:scale-110 [&_svg]:group-hover:rotate-90"
                                />
                                {/* 경고 표시 */}
                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full border-2 border-white shadow-sm opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100">
                                  <X size={8} className="absolute inset-0 m-auto text-white" />
                                </div>
                              </div>
                              {/* 주차량 설정 버튼 */}
                              <div className="relative group">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => onTogglePrimary && onTogglePrimary(residentInstance.resident.id)}
                                  title={`주차량 설정 ${carResident?.isPrimary ? '(활성)' : '(비활성)'}`}
                                  icon={CarFront}
                                  className={`w-12 h-12 min-w-12 text-white rounded-full transition-all duration-200 hover:scale-110 shadow-lg hover:shadow-xl border-none [&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:group-hover:scale-110 ${
                                    carResident?.isPrimary 
                                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                                      : 'bg-blue-500 hover:bg-blue-600'
                                  }`}
                                />
                                {/* 설정 상태 표시 */}
                                <div className={`absolute -top-2 -right-2 w-4 h-4 border-2 border-white rounded-full transition-opacity duration-200 shadow-sm pointer-events-none ${
                                  carResident?.isPrimary 
                                    ? 'bg-green-400 opacity-100' 
                                    : 'bg-gray-300 opacity-0 group-hover:opacity-100'
                                }`}>
                                  {carResident?.isPrimary && (
                                    <div className="w-full h-full bg-green-400 rounded-full animate-ping pointer-events-none"></div>
                                  )}
                                </div>
                              </div>
                              
                              {/* 알람 설정 버튼 */}
                              <div className="relative group">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => onToggleAlarm && onToggleAlarm(residentInstance.resident.id)}
                                  title={`알람 설정 ${carResident?.carAlarm ? '(활성)' : '(비활성)'}`}
                                  icon={BellRing}
                                  className={`w-12 h-12 min-w-12 text-white rounded-full transition-all duration-200 hover:scale-110 shadow-lg hover:shadow-xl border-none [&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:group-hover:scale-110 ${carResident?.carAlarm ? '[&_svg]:animate-pulse' : ''} ${
                                    carResident?.carAlarm 
                                      ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700' 
                                      : 'bg-orange-500 hover:bg-orange-600'
                                  }`}
                                />
                                {/* 설정 상태 표시 */}
                                <div className={`absolute -top-2 -right-2 w-4 h-4 border-2 border-white rounded-full transition-opacity duration-200 shadow-sm pointer-events-none ${
                                  carResident?.carAlarm 
                                    ? 'bg-yellow-400 opacity-100' 
                                    : 'bg-gray-300 opacity-0 group-hover:opacity-100'
                                }`}>
                                  {carResident?.carAlarm && (
                                    <div className="w-full h-full bg-yellow-400 rounded-full animate-ping pointer-events-none"></div>
                                  )}
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              {/* 연결 추가 버튼 */}
                              <div className="relative">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => onConnectResident && onConnectResident(residentInstance.resident.id)}
                                  title="차량과 연결"
                                  icon={Plus}
                                  className="w-16 h-16 min-w-16 text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg transition-all duration-300 animate-pulse hover:from-green-600 hover:to-emerald-600 hover:scale-110 hover:shadow-xl hover:animate-none border-none [&_svg]:size-7 [&_svg]:transition-all [&_svg]:duration-300 [&_svg]:group-hover:rotate-90"
                                />
                                {/* 펄스 효과 */}
                                <div className="absolute inset-0 bg-green-400 rounded-full opacity-20 animate-ping pointer-events-none"></div>
                                {/* 연결 아이콘 */}
                                <div className="absolute -top-1 -right-1 p-1 bg-white rounded-full shadow-sm pointer-events-none">
                                  <Link size={12} className="text-green-600" />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
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

      {/* 거주민 검색 및 연결 모달 */}
      {instanceId && (
        <ResidentSearchModal
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
