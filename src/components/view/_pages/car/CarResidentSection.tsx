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
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { SimpleToggleSwitch } from '@/components/ui/ui-input/simple-input/SimpleToggleSwitch';
// import { searchCarInstances } from '@/services/cars/cars_instances$_GET'; // API가 존재하지 않음
import { createCarInstanceResident } from '@/services/cars/cars_residents_POST';
import { deleteCarInstanceResident } from '@/services/cars/cars_residents@id_DELETE';
import { updateCarInstanceResident } from '@/services/cars/cars_residents@id_PATCH';
import { CarWithInstance, CarInstanceResidentDetail } from '@/types/car';

interface CarResidentSectionProps {
  car: CarWithInstance;
  onDataChange: () => void;
}

interface CreateResidentFormData {
  carInstanceId: string;
  residentId: string;
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
  
  // 모달 상태
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  // 폼 상태
  const [createFormData, setCreateFormData] = useState<CreateResidentFormData>({
    carInstanceId: '',
    residentId: '',
    carAlarm: false,
    isPrimary: false,
  });
  const [editTarget, setEditTarget] = useState<CarInstanceResidentDetail | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // #endregion

  // #region 차량 세대 옵션
  const carInstanceOptions = useMemo(() => {
    return car.carInstance?.map(instance => ({
      value: instance.id.toString(),
      label: `세대 ID: ${instance.instanceId} (${instance.carShareOnoff ? '공유' : '전용'})`,
    })) || [];
  }, [car.carInstance]);
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
    if (!createFormData.carInstanceId.trim() || !createFormData.residentId.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const createData = {
        carInstanceId: parseInt(createFormData.carInstanceId),
        residentId: parseInt(createFormData.residentId),
        carAlarm: createFormData.carAlarm,
        isPrimary: createFormData.isPrimary,
      };

      const result = await createCarInstanceResident(createData);

      if (result.success) {
        setModalMessage('거주자 연결이 성공적으로 생성되었습니다.');
        setSuccessModalOpen(true);
        setCreateModalOpen(false);
        setCreateFormData({ 
          carInstanceId: '', 
          residentId: '', 
          carAlarm: false, 
          isPrimary: false 
        });
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
            <div className="p-4">
              <PaginatedTable
                data={residentList as unknown as Record<string, unknown>[]}
                columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
                pageSize={5}
                pageSizeOptions={[5, 10, 20]}
                itemName="거주자 연결"
              />
            </div>
          )}
        </div>
      </SectionPanel>

      {/* 거주자 연결 추가 모달 */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="거주자 연결 추가"
        size="md"
      >
        <div className="space-y-4">
          {(() => {
            const fields: GridFormFieldSchema[] = [
              {
                id: 'carInstanceId',
                label: '차량 세대',
                required: true,
                rules: '차량이 소속된 세대',
                component: (
                  <SimpleDropdown
                    value={createFormData.carInstanceId}
                    onChange={(value) => setCreateFormData(prev => ({ ...prev, carInstanceId: value }))}
                    options={carInstanceOptions}
                    placeholder="차량 세대를 선택해주세요"
                    disabled={isSubmitting}
                    validationRule={{
                      type: 'free',
                      mode: 'create'
                    }}
                  />
                )
              },
              {
                id: 'residentId',
                label: '거주자 ID',
                required: true,
                rules: '연결할 거주자 선택',
                component: (
                  <SimpleTextInput
                    type="number"
                    value={createFormData.residentId}
                    onChange={(value) => setCreateFormData(prev => ({ ...prev, residentId: value }))}
                    placeholder="거주자 ID"
                    disabled={isSubmitting}
                    validationRule={{
                      type: 'free',
                      mode: 'create'
                    }}
                  />
                )
              },
              {
                id: 'isPrimary',
                label: '주차량 설정',
                rules: '주/보조 차량 설정',
                component: (
                  <SimpleToggleSwitch
                    checked={createFormData.isPrimary}
                    onChange={(checked) => setCreateFormData(prev => ({ ...prev, isPrimary: checked }))}
                    disabled={isSubmitting}
                    size="md"
                  />
                )
              },
              {
                id: 'carAlarm',
                label: '알람 설정',
                rules: '알람 수신 여부',
                component: (
                  <SimpleToggleSwitch
                    checked={createFormData.carAlarm}
                    onChange={(checked) => setCreateFormData(prev => ({ ...prev, carAlarm: checked }))}
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
              onClick={() => setCreateModalOpen(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button 
              variant="primary" 
              onClick={handleCreate}
              disabled={!createFormData.carInstanceId.trim() || !createFormData.residentId.trim() || isSubmitting}
            >
              {isSubmitting ? '생성 중...' : '생성'}
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
