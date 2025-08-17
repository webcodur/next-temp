'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import { CrudButton } from '@/components/ui/ui-input/crud-button/CrudButton';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleToggleSwitch } from '@/components/ui/ui-input/simple-input/SimpleToggleSwitch';
import InstanceSearchSection, { InstanceSearchField } from '@/components/ui/ui-input/instance-search/InstanceSearchSection';
// import { searchCarInstances } from '@/services/cars/cars_instances$_GET'; // 더 이상 사용하지 않음
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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  // 폼 상태
  const [createFormData, setCreateFormData] = useState<CreateInstanceFormData>({
    selectedInstance: null,
    carShareOnoff: false,
  });
  const [editTarget, setEditTarget] = useState<CarInstanceResidentDetail | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // #endregion

  // #region 데이터 로드
  const loadInstanceData = useCallback(async () => {
    setLoading(true);
    try {
      // CarWithInstance 데이터에서 직접 차량 세대 정보 사용
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
  const handleInstanceSelect = useCallback((instance: Instance) => {
    setCreateFormData(prev => ({ ...prev, selectedInstance: instance }));
  }, []);

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
        setCreateModalOpen(false);
        setCreateFormData({ selectedInstance: null, carShareOnoff: false });
        await loadInstanceData();
        onDataChange();
      } else {
        setModalMessage(`세대 연결 생성에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('세대 연결 생성 중 오류:', error);
      setModalMessage('세대 연결 생성 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editTarget?.carInstance || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const updateData = {
        carShareOnoff: editTarget.carInstance.carShareOnoff,
      };

      const result = await updateCarInstance(editTarget.carInstance.id, updateData);

      if (result.success) {
        setModalMessage('세대 연결이 성공적으로 수정되었습니다.');
        setSuccessModalOpen(true);
        setEditModalOpen(false);
        setEditTarget(null);
        await loadInstanceData();
        onDataChange();
      } else {
        setModalMessage(`세대 연결 수정에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('세대 연결 수정 중 오류:', error);
      setModalMessage('세대 연결 수정 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
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
        setModalMessage(`세대 연결 삭제에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('세대 연결 삭제 중 오류:', error);
      setModalMessage('세대 연결 삭제 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (instance: CarInstanceResidentDetail) => {
    setEditTarget(instance);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (instanceId: number) => {
    setDeleteTargetId(instanceId);
    setDeleteConfirmOpen(true);
  };

  const handleRowClick = (item: CarInstanceResidentDetail) => {
    if (item.carInstance?.instanceId) {
      router.push(`/parking/occupancy/instance/${item.carInstance.instanceId}`);
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
        const isSelected = createFormData.selectedInstance?.id === item.id;
        
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
  // #endregion

  // #region 컬럼 정의
  const columns: BaseTableColumn<CarInstanceResidentDetail>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '8%',
      align: 'center',
      cell: (item: CarInstanceResidentDetail) => item.carInstance?.id || '-',
    },
    {
      key: 'instanceId',
      header: '세대 ID',
      align: 'center',
      width: '12%',
      cell: (item: CarInstanceResidentDetail) => item.carInstance?.instanceId || '-',
    },
    {
      key: 'carShareOnoff',
      header: '공유 설정',
      align: 'center',
      width: '12%',
      cell: (item: CarInstanceResidentDetail) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          item.carInstance?.carShareOnoff 
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
      width: '15%',
      type: 'datetime',
      cell: (item: CarInstanceResidentDetail) => {
        if (!item.carInstance?.createdAt) return '-';
        return ''; // type: 'date'가 자동으로 포맷팅
      },
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
              if (item.carInstance?.id) {
                handleDeleteClick(item.carInstance.id);
              }
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
        title="세대 연결 관리" 
        subtitle="차량이 등록된 세대을 관리합니다."
        icon={<Home size={18} />}
        headerActions={(
          <CrudButton
            action="create"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            title="새 세대 연결"
          >
            연결 추가
          </CrudButton>
        )}
      >
        <div className="space-y-4">
          
          {/* 테이블 */}
          <PaginatedTable
              data={instanceList as unknown as Record<string, unknown>[]}
              columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
              pageSize={5}
              pageSizeOptions={[5, 10, 20]}
              itemName="세대 연결"
              isFetching={loading}
              onRowClick={(item) => handleRowClick(item as unknown as CarInstanceResidentDetail)}
            />
        </div>
      </SectionPanel>

      {/* 세대 연결 추가 모달 */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
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
                const isSelected = createFormData.selectedInstance?.id === instance.id;
                return isSelected 
                  ? 'bg-blue-50 border-blue-200 cursor-pointer' 
                  : 'cursor-pointer hover:bg-muted/50';
              }}
              showSection={false}
              defaultSearchOpen={true}
              searchMode="server"
              pageSize={5}
              minWidth="700px"
              title="연결할 세대 검색"
              subtitle="차량을 연결할 세대를 검색하고 선택하세요."
            />
          </div>

          {/* 선택된 세대 정보 및 공유 설정 */}
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

            {/* 공유 설정 */}
            <div className="p-4 rounded-lg border bg-card">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  공유 설정 <span className="text-xs text-muted-foreground">(같은 세대 거주자의 차량 이용 허용)</span>
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
              onClick={() => setCreateModalOpen(false)}
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

      {/* 세대 연결 수정 모달 */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="세대 연결 수정"
        size="md"
      >
        {editTarget && (
          <div className="space-y-4">
            {(() => {
              const fields: GridFormFieldSchema[] = [
                {
                  id: 'instanceId',
                  label: '세대 ID',
                  rules: '시스템 자동 연결',
                  component: (
                    <SimpleTextInput
                      value={editTarget.carInstance?.instanceId?.toString() || ''}
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
                  id: 'carShareOnoff',
                  label: '공유 설정',
                  rules: '공유/비공유 상태',
                  component: (
                    <SimpleToggleSwitch
                      checked={editTarget.carInstance?.carShareOnoff || false}
                      onChange={(checked) => {
                        if (editTarget.carInstance) {
                          setEditTarget({
                            ...editTarget,
                            carInstance: {
                              ...editTarget.carInstance,
                              carShareOnoff: checked,
                            }
                          });
                        }
                      }}
                      disabled={isSubmitting}
                      size="md"
                    />
                  )
                }
              ];

              return <GridFormAuto fields={fields} rulesWidth="120px" gap="16px" />;
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
        title="세대 연결 삭제 확인"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 삭제하시겠습니까?</h3>
            <p className="text-muted-foreground">
              이 작업은 되돌릴 수 없습니다. 세대 연결이 영구적으로 삭제됩니다.
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
