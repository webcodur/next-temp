'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Home, ExternalLink, Link, Unplug, Edit, ArrowRightLeft } from 'lucide-react';

import Modal from '@/components/ui/ui-layout/modal/Modal';
import { Button } from '@/components/ui/ui-input/button/Button';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { SimpleToggleSwitch } from '@/components/ui/ui-input/simple-input/SimpleToggleSwitch';
import InstanceSearchSection, { InstanceSearchField } from '@/components/ui/ui-input/instance-search/InstanceSearchSection';
import InstanceTransferModal, { TransferFromInfo, AdditionalFieldConfig } from '@/components/ui/ui-input/instance-transfer/InstanceTransferModal';

import { createCarInstance } from '@/services/cars/cars_instances_POST';
import { deleteCarInstance } from '@/services/cars/cars_instances@id_DELETE';
import { updateCarInstance } from '@/services/cars/cars_instances@id_PATCH';
import { CarWithInstance, CarInstanceResidentDetail } from '@/types/car';
import { Instance } from '@/types/instance';

interface CarInstanceSectionProps {
  car: CarWithInstance;
  onDataChange: () => void;
}
interface CreateInstanceFormData {
  selectedInstance: Instance | null;
  carShareOnoff: boolean;
}

export default function CarInstanceSection({
  car,
  onDataChange
}: CarInstanceSectionProps) {
  // #region 상태 관리
  const router = useRouter();
  const [instanceList, setInstanceList] = useState<CarInstanceResidentDetail[]>([]);
  const [loading, setLoading] = useState(false);

  // 모달 상태
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // 세대 변경 상태
  const [changeFromInstance, setChangeFromInstance] = useState<CarInstanceResidentDetail | null>(null);

  // 폼 상태
  const [createFormData, setCreateFormData] = useState<CreateInstanceFormData>({
    selectedInstance: null,
    carShareOnoff: false,
  });
  const [editTarget, setEditTarget] = useState<CarInstanceResidentDetail | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // #endregion

  // #region 기존 세대 ID 목록
  const existingInstanceIds = useMemo(() =>
    car.carInstance?.map(instance => instance.instanceId) || []
    , [car.carInstance]);
  // #endregion

  // #region 데이터 로드
  const loadInstanceData = useCallback(async () => {
    setLoading(true);
    try {
      const carInstances = car.carInstance?.map(instance => ({
        id: instance.id, // CarInstanceResident ID는 임시로 CarInstance ID 사용
        carInstanceId: instance.id,
        residentId: 0, // 세대 연결에서는 사용하지 않음
        carAlarm: false,
        isPrimary: false,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt,
        carInstance: instance,
        resident: undefined,
      })) || [];

      setInstanceList(carInstances);
    } catch (error) {
      console.error('차량-세대 연결 조회 중 오류:', error);
      setInstanceList([]);
    } finally {
      setLoading(false);
    }
  }, [car]);

  useEffect(() => {
    loadInstanceData();
  }, [loadInstanceData]);
  // #endregion

  // #region 이벤트 핸들러
  // 이미 연결된 세대인지 확인 (수정 모드에서는 현재 편집 중인 세대는 선택 가능)
  const isInstanceAlreadyConnected = useCallback((instanceId: number) => {
    const currentEditInstanceId = editTarget?.carInstance?.instanceId;

    // 수정 모드가 아닌 경우: 모든 기존 연결된 세대 제외
    if (!editTarget) {
      return existingInstanceIds.includes(instanceId);
    }

    // 수정 모드인 경우: 현재 편집 중인 세대는 선택 가능, 나머지는 제외
    if (currentEditInstanceId === instanceId) {
      return false; // 현재 편집 중인 세대는 선택 가능
    }

    return existingInstanceIds.includes(instanceId);
  }, [existingInstanceIds, editTarget]);

  const handleInstanceSelect = useCallback((instance: Instance) => {
    // 이미 연결된 세대는 선택할 수 없음 (단, 수정 모드에서 현재 편집 중인 세대는 예외)
    if (isInstanceAlreadyConnected(instance.id)) {
      return;
    }
    setCreateFormData(prev => ({ ...prev, selectedInstance: instance }));
  }, [isInstanceAlreadyConnected]);

  const handleCreate = async () => {
    if (!createFormData.selectedInstance || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const createData = {
        carNumber: car.carNumber,
        instanceId: createFormData.selectedInstance.id,
        carShareOnoff: createFormData.carShareOnoff,
      };

      const result = await createCarInstance(createData);

      if (result.success) {
        const address = `${createFormData.selectedInstance.address1Depth} ${createFormData.selectedInstance.address2Depth} ${createFormData.selectedInstance.address3Depth || ''}`.trim();
        setModalMessage(`${car.carNumber} 차량이 ${address} 세대에 성공적으로 연결되었습니다.`);
        setSuccessModalOpen(true);
        setCreateFormData({ selectedInstance: null, carShareOnoff: false });
        setCreateModalOpen(false);
        await loadInstanceData();
        onDataChange();
      } else {
        // 에러 처리는 통합 모듈에서 담당
      }
    } catch (error) {
      console.error('세대 연결 생성 중 오류:', error);
      // 에러 처리는 통합 모듈에서 담당
    } finally {
      setIsSubmitting(false);
    }
  };

  // 공유 여부 수정 핸들러
  const handleUpdateSettings = async () => {
    if (!editTarget?.carInstance || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const updateData = {
        carShareOnoff: createFormData.carShareOnoff,
      };
      const result = await updateCarInstance(editTarget.carInstance.id, updateData);
      if (!result.success) {
        throw new Error('설정 수정에 실패했습니다.');
      }

      setModalMessage('세대 연결 설정이 성공적으로 수정되었습니다.');
      setSuccessModalOpen(true);
      setEditModalOpen(false);
      setEditTarget(null);
      setCreateFormData({ selectedInstance: null, carShareOnoff: false });
      await loadInstanceData();
      onDataChange();
    } catch (error) {
      console.error('설정 수정 중 오류:', error);
      // 에러 처리는 통합 모듈에서 담당
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await deleteCarInstance(deleteTargetId);

      if (result.success) {
        setInstanceList(prev => prev.filter(item => item.carInstance?.id !== deleteTargetId));
        setModalMessage('세대 연결이 성공적으로 삭제되었습니다.');
        setSuccessModalOpen(true);
        onDataChange();
      } else {
        // 에러 처리는 통합 모듈에서 담당
      }
    } catch (error) {
      console.error('세대 연결 삭제 중 오류:', error);
      // 에러 처리는 통합 모듈에서 담당
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (instance: CarInstanceResidentDetail) => {
    setEditTarget(instance);
    // 설정 수정 시 현재 공유 여부을 초기값으로 설정
    setCreateFormData({
      selectedInstance: null,
      carShareOnoff: instance.carInstance?.carShareOnoff || false
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (instanceId: number) => {
    setDeleteTargetId(instanceId);
    setDeleteConfirmOpen(true);
  };

  const handleInstanceDetailClick = (item: CarInstanceResidentDetail) => {
    if (item.carInstance?.instanceId) {
      router.push(`/parking/occupancy/instance/${item.carInstance.instanceId}`);
    }
  };

  // 세대 변경 핸들러
  const handleChangeInstanceClick = (instance: CarInstanceResidentDetail) => {
    setChangeFromInstance(instance);
    setCreateFormData({ selectedInstance: null, carShareOnoff: instance.carInstance?.carShareOnoff || false });
    setChangeModalOpen(true);
  };

  const handleChangeSubmit = async () => {
    if (!changeFromInstance?.carInstance || !createFormData.selectedInstance || isSubmitting) return;
    if (changeFromInstance.carInstance.instanceId === createFormData.selectedInstance.id) return; // 같은 세대는 변경할 수 없음

    setIsSubmitting(true);

    try {
      // 1단계: 기존 연결 삭제
      const deleteResult = await deleteCarInstance(changeFromInstance.carInstance.id);
      if (!deleteResult.success) {
        throw new Error(`기존 연결 삭제 실패: ${deleteResult.errorMsg}`);
      }

      // 2단계: 새 연결 생성
      const createData = {
        carNumber: car.carNumber,
        instanceId: createFormData.selectedInstance.id,
        carShareOnoff: createFormData.carShareOnoff,
      };
      const createResult = await createCarInstance(createData);
      if (!createResult.success) {
        throw new Error(`새 연결 생성 실패: ${createResult.errorMsg}`);
        
      }

      // 성공 처리
      const fromAddress = changeFromInstance.carInstance.instance ? 
        `${changeFromInstance.carInstance.instance.address1Depth} ${changeFromInstance.carInstance.instance.address2Depth} ${changeFromInstance.carInstance.instance.address3Depth || ''}`.trim() 
        : `세대 ID: ${changeFromInstance.carInstance.instanceId}`;
      const toAddress = `${createFormData.selectedInstance.address1Depth} ${createFormData.selectedInstance.address2Depth} ${createFormData.selectedInstance.address3Depth || ''}`.trim();
      
      const successMessage = `${car.carNumber} 차량이 ${fromAddress}에서 ${toAddress}로 성공적으로 변경되었습니다.`;
      
      // 폼 초기화 및 모달 닫기
      setCreateFormData({ selectedInstance: null, carShareOnoff: false });
      setChangeFromInstance(null);
      setChangeModalOpen(false);
      setModalMessage(successMessage);
      setSuccessModalOpen(true);
      
      await loadInstanceData();
      onDataChange();
      
    } catch (error) {
      console.error('세대 변경 중 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  // #endregion

  // #region 검색 필드 구성 (모달용)
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

  // #region 모달용 세대 검색 컬럼 정의
  const instanceSearchColumns: BaseTableColumn<Instance>[] = [
    {
      key: 'id',
      header: 'ID',
      minWidth: '80px',
      align: 'center',
    },
    {
      key: 'dongHosu',
      header: '동호수',
      minWidth: '120px',
      align: 'start',
      cell: (item: Instance) => `${item.address1Depth} ${item.address2Depth}`,
    },
    {
      key: 'name',
      header: '세대명',
      minWidth: '120px',
      align: 'start',
      cell: (item: Instance) => item.name || '-',
    },
    {
      key: 'ownerName',
      header: '소유자',
      minWidth: '100px',
      align: 'start',
      cell: (item: Instance) => item.ownerName || '-',
    },
    {
      key: 'instanceType',
      header: '타입',
      minWidth: '80px',
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
      minWidth: '100px',
      align: 'center',
      cell: (item: Instance) => {
        const isAlreadyConnected = isInstanceAlreadyConnected(item.id);
        const isSelected = createFormData.selectedInstance?.id === item.id;
        const isCurrentInstance = editTarget?.carInstance?.instanceId === item.id;

        if (isAlreadyConnected) {
          return (
            <Button
              variant="secondary"
              size="sm"
              disabled={true}
              className="opacity-60 cursor-not-allowed"
            >
              이미 연결됨
            </Button>
          );
        }

        return (
          <Button
            variant={isSelected ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleInstanceSelect(item)}
            disabled={isSubmitting}
          >
            {isCurrentInstance && isSelected ? '기존 연결 세대' :
              isSelected ? '선택됨' : '선택'}
          </Button>
        );
      },
    },
  ];
  // #endregion

  // #region 컬럼 정의
  const columns: BaseTableColumn<CarInstanceResidentDetail>[] = [
    {
      key: 'id',
      header: 'ID',
      minWidth: '80px',
      align: 'center',
      cell: (item: CarInstanceResidentDetail) => item.carInstance?.id || '-',
    },
    {
      key: 'instanceId',
      header: '세대 ID',
      align: 'center',
      minWidth: '80px',
      cell: (item: CarInstanceResidentDetail) => item.carInstance?.instanceId || '-',
    },
    {
      key: 'dongHosu',
      header: '동호수',
      align: 'start',
      minWidth: '120px',
      cell: (item: CarInstanceResidentDetail) => {
        if (item.carInstance?.instance) {
          const { address1Depth, address2Depth, address3Depth } = item.carInstance.instance;
          return `${address1Depth} ${address2Depth}${address3Depth ? ` ${address3Depth}` : ''}`;
        }
        return `세대 ID: ${item.carInstance?.instanceId || '-'}`;
      },
    },
    {
      key: 'carShareOnoff',
      header: '공유 여부',
      align: 'center',
      minWidth: '100px',
      cell: (item: CarInstanceResidentDetail) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${item.carInstance?.carShareOnoff
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
          }`}>
          {item.carInstance?.carShareOnoff ? '공유' : '전용'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: '등록일자',
      align: 'center',
      minWidth: '120px',
      type: 'datetime',
      cell: (item: CarInstanceResidentDetail) => {
        if (!item.carInstance?.createdAt) return '-';
        return ''; // type: 'date'가 자동으로 포맷팅
      },
    },
    {
      header: '관리',
      align: 'center',
      minWidth: '250px',
      cell: (item: CarInstanceResidentDetail) => (
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleInstanceDetailClick(item);
            }}
            title="세대 정보 보기"
            className="flex gap-1 items-center px-2 py-1 text-xs"
          >
            <ExternalLink size={12} />
            세대정보
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(item);
            }}
            title="공유 여부 수정"
            className="flex gap-1 items-center px-2 py-1 text-xs"
          >
            <Edit size={12} />
            관계정보
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleChangeInstanceClick(item);
            }}
            title="다른 세대로 변경"
            className="flex gap-1 items-center px-2 py-1 text-xs hover:bg-blue-50"
          >
            <ArrowRightLeft size={12} />
            세대변경
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (item.carInstance?.id) {
                handleDeleteClick(item.carInstance.id);
              }
            }}
            title="연결 해제"
            className="flex gap-1 items-center px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Unplug size={12} />
            연결해제
          </Button>
        </div>
      ),
    },
  ];
  // #endregion

  // #region 세대 변경 모달을 위한 데이터 변환
  const changeFromInfo: TransferFromInfo | null = useMemo(() => {
    if (!changeFromInstance?.carInstance) return null;
    
    return {
      id: changeFromInstance.carInstance.id,
      instanceId: changeFromInstance.carInstance.instanceId,
      displayName: `세대 ID: ${changeFromInstance.carInstance.instanceId}`,
      instanceType: changeFromInstance.carInstance.instance?.instanceType as string,
      address: changeFromInstance.carInstance.instance ? {
        address1Depth: changeFromInstance.carInstance.instance.address1Depth as string,
        address2Depth: changeFromInstance.carInstance.instance.address2Depth as string,
        address3Depth: changeFromInstance.carInstance.instance.address3Depth as string,
      } : undefined,
    };
  }, [changeFromInstance]);

  const changeAdditionalFields: AdditionalFieldConfig[] = useMemo(() => [
    {
      type: 'toggle',
      key: 'carShareOnoff',
      label: '공유 여부',
      description: '같은 세대 주민의 차량 이용 허용',
      value: createFormData.carShareOnoff,
      onChange: (value: string | boolean) => setCreateFormData(prev => ({ ...prev, carShareOnoff: value as boolean })),
      disabled: false,
      size: 'md',
    }
  ], [createFormData.carShareOnoff]);

  const handleChangeModalClose = useCallback(() => {
    setChangeModalOpen(false);
    setChangeFromInstance(null);
    setCreateFormData({ selectedInstance: null, carShareOnoff: false });
  }, []);

  const changeRowClassName = useCallback((instance: Instance) => {
    const isSelected = createFormData.selectedInstance?.id === instance.id;
    const isCurrentInstance = changeFromInstance && instance.id === changeFromInstance.carInstance?.instanceId;
    const isAlreadyConnected = isInstanceAlreadyConnected(instance.id);
    
    if (isCurrentInstance) {
      return 'cursor-not-allowed bg-orange-50 border-orange-200 opacity-50';
    }
    if (isAlreadyConnected) {
      return 'bg-muted/30 opacity-75';
    }
    return isSelected ? 'cursor-pointer hover:bg-muted/50 bg-green-50 border-green-200' : 'cursor-pointer hover:bg-muted/50';
  }, [createFormData.selectedInstance, changeFromInstance, isInstanceAlreadyConnected]);
  // #endregion

  return (
    <div className="space-y-6">
      {/* 세대 연결 목록 */}
      <SectionPanel
        title="[ 차량 - 세대 ] 연결 목록"
        subtitle="차량이 연결된 세대 목록을 확인합니다."
        icon={<Home size={18} />}
        headerActions={
          <Button
            variant="outline"
            size="default"
            onClick={() => setCreateModalOpen(true)}
            className="gap-1"
          >
            <Link size={14} />
            세대 연결 추가
          </Button>
        }
      >
        <div className="space-y-4">
          <PaginatedTable
            data={instanceList as unknown as Record<string, unknown>[]}
            columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
            pageSize={5}
            pageSizeOptions={[5, 10, 20]}
            itemName="세대 연결"
            isFetching={loading}
          />
        </div>
      </SectionPanel>

      {/* 세대 연결 추가 모달 */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setCreateFormData({ selectedInstance: null, carShareOnoff: false });
        }}
        title="세대 연결 추가"
        size="xl"
      >
        <div className="space-y-6">
          {/* 세대 검색 및 선택 */}
          <div className="space-y-4">
            <InstanceSearchSection
              searchFields={searchFields}
              tableType="base"
              columns={instanceSearchColumns}
              onRowClick={handleInstanceSelect}
              getRowClassName={(instance: Instance) => {
                const isAlreadyConnected = isInstanceAlreadyConnected(instance.id);
                const isSelected = createFormData.selectedInstance?.id === instance.id;
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
              searchMode="server"
              excludeInstanceIds={existingInstanceIds}
              pageSize={5}
              title="연결할 세대 검색"
              subtitle="차량을 연결할 세대를 검색하고 선택하세요."
            />
          </div>

          {/* 선택된 세대 정보 및 공유 여부 */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* 선택된 세대 */}
            <div className="p-4 rounded-lg border bg-card">
              <div className="mb-2">
                <span className="font-medium text-foreground">
                  선택된 세대
                </span>
              </div>
              {createFormData.selectedInstance ? (
                <p className="text-sm text-foreground">
                  {createFormData.selectedInstance.address1Depth} {createFormData.selectedInstance.address2Depth} {createFormData.selectedInstance.address3Depth || ''}
                  <span className="px-2 py-1 ml-2 text-xs rounded bg-muted">
                    {{
                      GENERAL: '일반',
                      TEMP: '임시',
                      COMMERCIAL: '상업',
                    }[createFormData.selectedInstance.instanceType] || createFormData.selectedInstance.instanceType}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  위 목록에서 세대를 선택해주세요
                </p>
              )}
            </div>

            {/* 공유 여부 */}
            <div className="p-4 rounded-lg border bg-card">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  공유 여부 <span className="text-xs text-muted-foreground">(같은 세대 주민의 차량 이용 허용)</span>
                </label>
                <SimpleToggleSwitch
                  checked={createFormData.carShareOnoff}
                  onChange={(checked) => setCreateFormData(prev => ({ ...prev, carShareOnoff: checked }))}
                  disabled={isSubmitting}
                  size="md"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => {
                setCreateModalOpen(false);
                setCreateFormData({ selectedInstance: null, carShareOnoff: false });
              }}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              variant="primary"
              onClick={handleCreate}
              disabled={!createFormData.selectedInstance || isSubmitting}
            >
              {isSubmitting ? '생성 중...' : '연결 생성'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 세대 연결 설정 수정 모달 */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditTarget(null);
          setCreateFormData({ selectedInstance: null, carShareOnoff: false });
        }}
        title="세대 연결 설정 수정"
        size="md"
      >
        <div className="space-y-6">
          {/* 현재 연결 정보 표시 */}
          {editTarget && (
            <div className="p-4 rounded-lg border bg-card">
              <div className="mb-2">
                <span className="font-medium text-foreground">
                  연결된 세대 정보
                </span>
              </div>
              <p className="mb-2 text-sm text-foreground">
                {editTarget.carInstance?.instance ? (
                  <>
                    {editTarget.carInstance.instance.address1Depth} {editTarget.carInstance.instance.address2Depth} {editTarget.carInstance.instance.address3Depth || ''}
                    <span className="px-2 py-1 ml-2 text-xs rounded bg-muted">
                      {(() => {
                        const typeMap: Record<string, string> = {
                          GENERAL: '일반',
                          TEMP: '임시',
                          COMMERCIAL: '상업',
                        };
                        const instanceType = String(editTarget.carInstance.instance.instanceType || '');
                        return typeMap[instanceType] || instanceType;
                      })()}
                    </span>
                  </>
                ) : (
                  `세대 ID: ${editTarget.carInstance?.instanceId}`
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                연결일: {editTarget.carInstance?.createdAt ? new Date(editTarget.carInstance.createdAt).toLocaleDateString() : '-'}
              </p>
            </div>
          )}

          {/* 공유 여부 수정 */}
          <div className="p-4 rounded-lg border bg-card">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                공유 여부 <span className="text-xs text-muted-foreground">(같은 세대 주민의 차량 이용 허용)</span>
              </label>
              <SimpleToggleSwitch
                checked={createFormData.carShareOnoff}
                onChange={(checked) => setCreateFormData(prev => ({ ...prev, carShareOnoff: checked }))}
                disabled={isSubmitting}
                size="md"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => {
                setEditModalOpen(false);
                setEditTarget(null);
                setCreateFormData({ selectedInstance: null, carShareOnoff: false });
              }}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateSettings}
              disabled={isSubmitting || 
                       editTarget?.carInstance?.carShareOnoff === createFormData.carShareOnoff}
            >
              {isSubmitting ? '수정 중...' : '설정 수정 완료'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 세대 변경 모달 */}
      <InstanceTransferModal
        isOpen={changeModalOpen}
        onClose={handleChangeModalClose}
        title="세대 변경"
        fromInfo={changeFromInfo}
        fromLabel="변경 전 세대"
        fromColorClass="orange"
        selectedToInstance={createFormData.selectedInstance}
        toLabel="변경 후 세대"
        toColorClass="green"
        searchFields={searchFields}
        excludeInstanceIds={existingInstanceIds}
        onInstanceSelect={handleInstanceSelect}
        getRowClassName={changeRowClassName}
        additionalFields={changeAdditionalFields}
        onSubmit={handleChangeSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="세대 변경 실행"
        isSubmitDisabled={!createFormData.selectedInstance || changeFromInstance?.carInstance?.instanceId === createFormData.selectedInstance?.id}
      />

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="세대 연결 해제 확인"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 해제하시겠습니까?</h3>
            <p className="text-muted-foreground">
              이 작업은 되돌릴 수 없습니다. 세대 연결이 영구적으로 해제됩니다.
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? '해제 중...' : '해제'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 성공 모달 */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="작업 완료"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-green-600">성공</h3>
            <p className="text-muted-foreground">{modalMessage}</p>
          </div>

          <div className="flex justify-center pt-4">
            <Button onClick={() => setSuccessModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>

      {/* 오류 모달 제거됨 - 통합 모듈에서 처리 */}
    </div>
  );
}
