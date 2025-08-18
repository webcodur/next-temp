'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Users, Crown, UserCheck } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import { CrudButton } from '@/components/ui/ui-input/crud-button/CrudButton';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleNumberInput } from '@/components/ui/ui-input/simple-input/SimpleNumberInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { SimpleToggleSwitch } from '@/components/ui/ui-input/simple-input/SimpleToggleSwitch';
import InstanceSearchSection, { InstanceSearchField } from '@/components/ui/ui-input/instance-search/InstanceSearchSection';
import { getInstanceDetail } from '@/services/instances/instances@id_GET';
import { createCarInstanceResident } from '@/services/cars/cars_residents_POST';
import { deleteCarInstanceResident } from '@/services/cars/cars_residents@id_DELETE';
import { updateCarInstanceResident } from '@/services/cars/cars_residents@id_PATCH';
import { CarWithInstance, CarInstanceResidentDetail } from '@/types/car';
import { Instance, ResidentInstanceWithResident } from '@/types/instance';

interface CarResidentSectionProps {
  car: CarWithInstance;
  onDataChange: () => void;
}

interface CreateResidentFormData {
  selectedInstance: Instance | null;
  selectedResident: ResidentInstanceWithResident | null;
  carAlarm: boolean;
  isPrimary: boolean;
}

export default function CarResidentSection({ 
  car, 
  onDataChange 
}: CarResidentSectionProps) {
  // #region 상태 관리
  const [residentList, setResidentList] = useState<CarInstanceResidentDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableResidents, setAvailableResidents] = useState<ResidentInstanceWithResident[]>([]);
  const [loadingResidents, setLoadingResidents] = useState(false);
  
  // 모달 상태
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  // 폼 상태
  const [createFormData, setCreateFormData] = useState<CreateResidentFormData>({
    selectedInstance: null,
    selectedResident: null,
    carAlarm: false,
    isPrimary: false,
  });
  const [editTarget, setEditTarget] = useState<CarInstanceResidentDetail | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // #endregion

  // #region 기존 연결 정보
  const existingConnections = useMemo(() => 
    car.carInstance?.map(instance => instance.id) || []
  , [car.carInstance]);
  
  // 세대 거주자 목록 로드
  const loadInstanceResidents = useCallback(async (instanceId: number) => {
    setLoadingResidents(true);
    try {
      const result = await getInstanceDetail(instanceId);
      if (result.success && result.data) {
        setAvailableResidents(result.data.residentInstance || []);
      } else {
        console.error('세대 거주자 조회 실패:', result.errorMsg);
        setAvailableResidents([]);
      }
    } catch (error) {
      console.error('세대 거주자 조회 중 오류:', error);
      setAvailableResidents([]);
    } finally {
      setLoadingResidents(false);
    }
  }, []);

  // 세대 선택 핸들러
  const handleInstanceSelect = useCallback(async (instance: Instance) => {
    setCreateFormData(prev => ({ 
      ...prev, 
      selectedInstance: instance,
      selectedResident: null // 세대가 바뀌면 거주자 선택 초기화
    }));
    
    // 선택된 세대의 거주자 목록 로드
    await loadInstanceResidents(instance.id);
  }, [loadInstanceResidents]);

  // 거주자 선택 핸들러
  const handleResidentSelect = useCallback((resident: ResidentInstanceWithResident) => {
    setCreateFormData(prev => ({ ...prev, selectedResident: resident }));
  }, []);
  // #endregion

  // #region 데이터 로드
  const loadResidentData = useCallback(async () => {
    setLoading(true);
    try {
      // cars/instances GET API가 존재하지 않으므로 빈 배열로 초기화
      // 실제 거주자 연결 정보는 개별 API 호출이나 다른 방법으로 조회해야 함
      console.log('차량-거주자 연결 목록을 표시하려면 별도 API 구현이 필요합니다.');
      setResidentList([]);
    } catch (error) {
      console.error('차량-거주자 연결 조회 중 오류:', error);
      setResidentList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResidentData();
  }, [loadResidentData]);
  // #endregion

  // #region 이벤트 핸들러
  const handleCreate = async () => {
    if (!createFormData.selectedInstance || !createFormData.selectedResident || isSubmitting) return;
    
    // 해당 차량-세대 연결 찾기
    const targetCarInstance = car.carInstance?.find(
      instance => instance.instanceId === createFormData.selectedInstance!.id
    );
    
    if (!targetCarInstance) {
      setModalMessage('선택된 세대에 해당 차량이 연결되어 있지 않습니다.');
      setErrorModalOpen(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const createData = {
        carInstanceId: targetCarInstance.id,
        residentId: createFormData.selectedResident.residentId,
        carAlarm: createFormData.carAlarm,
        isPrimary: createFormData.isPrimary,
      };

      const result = await createCarInstanceResident(createData);

      if (result.success) {
        const instanceAddr = `${createFormData.selectedInstance.address1Depth} ${createFormData.selectedInstance.address2Depth}`;
        const residentName = createFormData.selectedResident.resident.name;
        setModalMessage(`${instanceAddr} 세대의 ${residentName} 거주자가 성공적으로 연결되었습니다.`);
        setSuccessModalOpen(true);
        setCreateModalOpen(false);
        setCreateFormData({ 
          selectedInstance: null,
          selectedResident: null,
          carAlarm: false, 
          isPrimary: false 
        });
        setAvailableResidents([]);
        await loadResidentData();
        onDataChange();
      } else {
        setModalMessage(`거주자 연결 생성에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('거주자 연결 생성 중 오류:', error);
      setModalMessage('거주자 연결 생성 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editTarget || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const updateData = {
        carAlarm: editTarget.carAlarm,
        isPrimary: editTarget.isPrimary,
      };

      const result = await updateCarInstanceResident(editTarget.id, updateData);

      if (result.success) {
        setModalMessage('거주자 연결이 성공적으로 수정되었습니다.');
        setSuccessModalOpen(true);
        setEditModalOpen(false);
        setEditTarget(null);
        await loadResidentData();
        onDataChange();
      } else {
        setModalMessage(`거주자 연결 수정에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('거주자 연결 수정 중 오류:', error);
      setModalMessage('거주자 연결 수정 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await deleteCarInstanceResident(deleteTargetId);
      
      if (result.success) {
        setResidentList(prev => prev.filter(item => item.id !== deleteTargetId));
        setModalMessage('거주자 연결이 성공적으로 삭제되었습니다.');
        setSuccessModalOpen(true);
        onDataChange();
      } else {
        setModalMessage(`거주자 연결 삭제에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('거주자 연결 삭제 중 오류:', error);
      setModalMessage('거주자 연결 삭제 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (resident: CarInstanceResidentDetail) => {
    setEditTarget(resident);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (residentId: number) => {
    setDeleteTargetId(residentId);
    setDeleteConfirmOpen(true);
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

  // 모달용 세대 검색 컬럼 정의
  const instanceSearchColumns: BaseTableColumn<Instance>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '8%',
      align: 'center',
    },
    {
      key: 'dongHosu',
      header: '동호수',
      width: '20%',
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
        const isConnectedToThisCar = car.carInstance?.some(carInst => carInst.instanceId === item.id);
        const isSelected = createFormData.selectedInstance?.id === item.id;
        
        if (!isConnectedToThisCar) {
          return (
            <Button
              variant="secondary"
              size="sm"
              disabled={true}
              className="opacity-60 cursor-not-allowed"
            >
              차량 미연결
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
            {isSelected ? '선택됨' : '선택'}
          </Button>
        );
      },
    },
  ];

  // 거주자 선택 테이블 컬럼 정의
  const residentColumns: BaseTableColumn<ResidentInstanceWithResident>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '10%',
      align: 'center',
      cell: (item: ResidentInstanceWithResident) => item.resident.id,
    },
    {
      key: 'name',
      header: '이름',
      width: '15%',
      align: 'start',
      cell: (item: ResidentInstanceWithResident) => item.resident.name,
    },
    {
      key: 'phone',
      header: '연락처',
      width: '20%',
      align: 'start',
      cell: (item: ResidentInstanceWithResident) => item.resident.phone,
    },
    {
      key: 'email',
      header: '이메일',
      width: '25%',
      align: 'start',
      cell: (item: ResidentInstanceWithResident) => item.resident.email,
    },
    {
      key: 'status',
      header: '상태',
      width: '10%',
      align: 'center',
      cell: (item: ResidentInstanceWithResident) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          item.status === 'ACTIVE' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {item.status === 'ACTIVE' ? '활성' : '비활성'}
        </span>
      ),
    },
    {
      header: '선택',
      width: '10%',
      align: 'center',
      cell: (item: ResidentInstanceWithResident) => {
        const isSelected = createFormData.selectedResident?.id === item.id;
        
        return (
          <Button
            variant={isSelected ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleResidentSelect(item)}
            disabled={isSubmitting || item.status !== 'ACTIVE'}
          >
            {isSelected ? '선택됨' : '선택'}
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
      width: '8%',
      align: 'center',
    },
    {
      key: 'carInstanceId',
      header: '차량 세대 ID',
      align: 'center',
      width: '15%',
    },
    {
      key: 'residentId',
      header: '거주자 ID',
      align: 'center',
      width: '12%',
    },
    {
      key: 'isPrimary',
      header: '주차량',
      align: 'center',
      width: '10%',
      cell: (item: CarInstanceResidentDetail) => (
        <div className="flex gap-1 justify-center items-center">
          {item.isPrimary && <Crown size={16} className="text-yellow-500" />}
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            item.isPrimary 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {item.isPrimary ? '주차량' : '보조차량'}
          </span>
        </div>
      ),
    },
    {
      key: 'carAlarm',
      header: '알람 설정',
      align: 'center',
      width: '12%',
      cell: (item: CarInstanceResidentDetail) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          item.carAlarm 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {item.carAlarm ? '알람 ON' : '알람 OFF'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: '등록일자',
      align: 'center',
      width: '15%',
      type: 'datetime',
    },
    {
      header: '관리',
      align: 'center',
      width: '15%',
      cell: (item: CarInstanceResidentDetail) => (
        <div className="flex gap-1 justify-center">
          <CrudButton
            action="edit"
            iconOnly
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(item);
            }}
            title="설정 수정"
          />
          <CrudButton
            action="delete"
            iconOnly
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(item.id);
            }}
            title="연결 삭제"
          />
        </div>
      ),
    },
  ];
  // #endregion

  return (
    <div className="space-y-6">
      <SectionPanel 
        title="거주자 연결 관리" 
        subtitle="차량을 이용하는 거주자를 관리합니다."
        icon={<UserCheck size={18} />}
        headerActions={residentList.length > 0 ? (
          <CrudButton
            action="create"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            title="새 거주자 연결"
          >
            연결 추가
          </CrudButton>
        ) : undefined}
      >
        <div className="space-y-4">
          
          {/* 테이블 또는 안내 메시지 */}
          {residentList.length === 0 && !loading ? (
            <div className="flex flex-col justify-center items-center py-12 text-center">
              <Users size={48} className="mb-4 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium text-foreground">
                거주자 연결 정보 없음
              </h3>
              <p className="mb-4 max-w-md text-muted-foreground">
                현재 이 차량에 연결된 거주자가 없습니다.<br />
                새 거주자 연결을 추가해보세요.
              </p>
              <CrudButton
                action="create"
                onClick={() => setCreateModalOpen(true)}
                title="새 거주자 연결"
              >
                거주자 연결 추가
              </CrudButton>
            </div>
          ) : (
            <PaginatedTable
                data={residentList as unknown as Record<string, unknown>[]}
                columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
                pageSize={5}
                pageSizeOptions={[5, 10, 20]}
                itemName="거주자 연결"
                isFetching={loading}
              />
          )}
        </div>
      </SectionPanel>

      {/* 거주자 연결 추가 모달 */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setCreateFormData({ selectedInstance: null, selectedResident: null, carAlarm: false, isPrimary: false });
          setAvailableResidents([]);
        }}
        title="거주자 연결 추가"
        size="xl"
      >
        <div className="space-y-6">
          {/* 1단계: 세대 검색 및 선택 */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium">1단계: 세대 선택</h4>
            <InstanceSearchSection
              searchFields={searchFields}
              tableType="base"
              columns={instanceSearchColumns}
              onRowClick={handleInstanceSelect}
              getRowClassName={(instance: Instance) => {
                const isConnected = car.carInstance?.some(carInst => carInst.instanceId === instance.id);
                const isSelected = createFormData.selectedInstance?.id === instance.id;
                let className = '';
                
                if (!isConnected) {
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
              pageSize={5}
              minWidth="700px"
              title="차량이 연결된 세대 검색"
              subtitle="해당 차량이 연결된 세대만 선택할 수 있습니다."
            />
          </div>

          {/* 2단계: 거주자 선택 */}
          {createFormData.selectedInstance && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium">2단계: 거주자 선택</h4>
              <div className="p-4 rounded-lg border bg-card">
                <div className="mb-4">
                  <span className="font-medium text-foreground">
                    선택된 세대: {createFormData.selectedInstance.address1Depth} {createFormData.selectedInstance.address2Depth}
                  </span>
                </div>
                
                {loadingResidents ? (
                  <div className="py-8 text-center">
                    <div className="text-muted-foreground">거주자 목록을 불러오는 중...</div>
                  </div>
                ) : availableResidents.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="text-muted-foreground">해당 세대에 등록된 활성 거주자가 없습니다.</div>
                  </div>
                ) : (
                  <PaginatedTable
                    data={availableResidents as unknown as Record<string, unknown>[]}
                    columns={residentColumns as unknown as BaseTableColumn<Record<string, unknown>>[]}
                    pageSize={5}
                    pageSizeOptions={[5, 10]}
                    itemName="거주자"
                    isFetching={loadingResidents}
                  />
                )}
              </div>
            </div>
          )}

          {/* 3단계: 설정 */}
          {createFormData.selectedInstance && createFormData.selectedResident && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium">3단계: 연결 설정</h4>
              
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* 선택 요약 */}
                <div className="p-4 rounded-lg border bg-card">
                  <div className="space-y-2">
                    <div className="font-medium text-foreground">선택 정보</div>
                    <div className="text-sm space-y-1">
                      <div><span className="text-muted-foreground">세대:</span> {createFormData.selectedInstance.address1Depth} {createFormData.selectedInstance.address2Depth}</div>
                      <div><span className="text-muted-foreground">거주자:</span> {createFormData.selectedResident.resident.name} ({createFormData.selectedResident.resident.phone})</div>
                    </div>
                  </div>
                </div>

                {/* 설정 옵션 */}
                <div className="p-4 rounded-lg border bg-card">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        주차량 설정
                      </label>
                      <SimpleToggleSwitch
                        checked={createFormData.isPrimary}
                        onChange={(checked) => setCreateFormData(prev => ({ ...prev, isPrimary: checked }))}
                        disabled={isSubmitting}
                        size="md"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        알람 설정
                      </label>
                      <SimpleToggleSwitch
                        checked={createFormData.carAlarm}
                        onChange={(checked) => setCreateFormData(prev => ({ ...prev, carAlarm: checked }))}
                        disabled={isSubmitting}
                        size="md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button 
              variant="ghost" 
              onClick={() => {
                setCreateModalOpen(false);
                setCreateFormData({ selectedInstance: null, selectedResident: null, carAlarm: false, isPrimary: false });
                setAvailableResidents([]);
              }}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button 
              variant="primary" 
              onClick={handleCreate}
              disabled={!createFormData.selectedInstance || !createFormData.selectedResident || isSubmitting}
            >
              {isSubmitting ? '연결 생성 중...' : '거주자 연결 생성'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 거주자 연결 수정 모달 */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="거주자 연결 수정"
        size="md"
      >
        {editTarget && (
          <div className="space-y-4">
            {(() => {
              const fields: GridFormFieldSchema[] = [
                {
                  id: 'carInstanceId',
                  label: '차량 세대 ID',
                  component: (
                    <SimpleTextInput
                      value={editTarget.carInstanceId?.toString() || ''}
                      onChange={() => {}}
                      disabled={true}
                      validationRule={{
                        type: 'free',
                        mode: 'edit'
                      }}
                    />
                  )
                },
                {
                  id: 'residentId',
                  label: '거주자 ID',
                  component: (
                    <SimpleTextInput
                      value={editTarget.residentId?.toString() || ''}
                      onChange={() => {}}
                      disabled={true}
                      validationRule={{
                        type: 'free',
                        mode: 'edit'
                      }}
                    />
                  )
                },
                {
                  id: 'isPrimary',
                  label: '주차량 설정',
                  component: (
                    <SimpleToggleSwitch
                      checked={editTarget.isPrimary}
                      onChange={(checked) => setEditTarget({ ...editTarget, isPrimary: checked })}
                      disabled={isSubmitting}
                      size="md"
                    />
                  )
                },
                {
                  id: 'carAlarm',
                  label: '알람 설정',
                  component: (
                    <SimpleToggleSwitch
                      checked={editTarget.carAlarm}
                      onChange={(checked) => setEditTarget({ ...editTarget, carAlarm: checked })}
                      disabled={isSubmitting}
                      size="md"
                    />
                  )
                }
              ];

              return <GridFormAuto fields={fields} gap="16px" />;
            })()}
            
            <div className="flex gap-3 justify-end pt-4">
              <Button 
                variant="ghost" 
                onClick={() => setEditModalOpen(false)}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button 
                variant="primary" 
                onClick={handleEdit}
                disabled={isSubmitting}
              >
                {isSubmitting ? '수정 중...' : '수정'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="거주자 연결 삭제 확인"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 삭제하시겠습니까?</h3>
            <p className="text-muted-foreground">
              이 작업은 되돌릴 수 없습니다. 거주자 연결이 영구적으로 삭제됩니다.
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
              {isSubmitting ? '삭제 중...' : '삭제'}
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

      {/* 오류 모달 */}
      <Modal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        title="오류 발생"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-red-600">오류</h3>
            <p className="text-muted-foreground">{modalMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setErrorModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
