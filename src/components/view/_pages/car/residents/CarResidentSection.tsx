'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Users, Plus } from 'lucide-react';

import Modal from '@/components/ui/ui-layout/modal/Modal';
import { Button } from '@/components/ui/ui-input/button/Button';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { SimpleToggleSwitch } from '@/components/ui/ui-input/simple-input/SimpleToggleSwitch';

import { createCarInstanceResident } from '@/services/cars/cars_residents_POST';
import { deleteCarInstanceResident } from '@/services/cars/cars_residents@id_DELETE';

import { getInstanceDetail } from '@/services/instances/instances@id_GET';
import { getCarResidents } from '@/services/cars/cars@carId_residents_GET';
import { Instance, ResidentInstanceWithResident } from '@/types/instance';
import { CarWithInstance } from '@/types/car';
import { ResidentWithAddress } from '@/types/resident';

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
  // 데이터 상태
  const [carResidents, setCarResidents] = useState<ResidentWithAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableResidents, setAvailableResidents] = useState<ResidentInstanceWithResident[]>([]);
  const [loadingResidents, setLoadingResidents] = useState(false);

  // 모달 상태
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
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 연결된 세대 목록
  const connectedInstances = useMemo(() =>
    car.carInstance?.map(carInstance => ({
      id: carInstance.id,
      instanceId: carInstance.instanceId,
      carShareOnoff: carInstance.carShareOnoff,
      createdAt: carInstance.createdAt,
      // 세대 정보는 실제로는 별도 API 호출이 필요하지만 임시로 구성
      address1Depth: `세대 ID: ${carInstance.instanceId}`,
      address2Depth: carInstance.carShareOnoff ? '(공유)' : '(전용)',
      ownerName: '-',
      instanceType: 'GENERAL' as const,
    })) || []
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

  // 세대 선택 핸들러 (연결된 세대에서 선택)
  const handleConnectedInstanceSelect = useCallback(async (connectedInstance: typeof connectedInstances[0]) => {
    // Instance 형태로 변환하여 저장
    const instanceForForm: Instance = {
      id: connectedInstance.instanceId,
      parkinglotId: 1,
      address1Depth: connectedInstance.address1Depth,
      address2Depth: connectedInstance.address2Depth,
      address3Depth: '',
      instanceType: connectedInstance.instanceType,
      name: '',
      ownerName: connectedInstance.ownerName,
      password: '',
      memo: '',
      residentInstance: [],
      carInstance: [],
      createdAt: connectedInstance.createdAt,
      updatedAt: connectedInstance.createdAt
    };

    setCreateFormData(prev => ({
      ...prev,
      selectedInstance: instanceForForm,
      selectedResident: null // 세대가 바뀌면 거주자 선택 초기화
    }));

    // 선택된 세대의 거주자 목록 로드
    await loadInstanceResidents(connectedInstance.instanceId);
  }, [loadInstanceResidents]);

  // 거주자 선택 핸들러
  const handleResidentSelect = useCallback((resident: ResidentInstanceWithResident) => {
    setCreateFormData(prev => ({ ...prev, selectedResident: resident }));
  }, []);

  // 모달 초기화
  const resetModal = useCallback(() => {
    setCreateFormData({
      selectedInstance: null,
      selectedResident: null,
      carAlarm: false,
      isPrimary: false
    });
    setAvailableResidents([]);
  }, []);
  // #endregion

  // #region 데이터 로드
  const loadResidentData = useCallback(async () => {
    setLoading(true);
    try {
      // 차량에 연결된 거주자 목록 조회
      const result = await getCarResidents(car.id);
      if (result.success && result.data) {
        setCarResidents(result.data);
      } else {
        console.error('차량-거주자 조회 실패:', result.errorMsg);
        setCarResidents([]);
      }
    } catch (error) {
      console.error('차량-거주자 조회 중 오류:', error);
      setCarResidents([]);
    } finally {
      setLoading(false);
    }
  }, [car.id]);

  useEffect(() => {
    loadResidentData();
  }, [loadResidentData]);
  // #endregion

  // #region 이벤트 핸들러
  const handleCreate = async () => {
    if (!createFormData.selectedInstance || !createFormData.selectedResident || isSubmitting) return;

    // 해당 차량-세대 연결 찾기 (selectedInstance.id는 instanceId)
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
        resetModal();
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



  const handleDeleteConfirm = async () => {
    if (!deleteTargetId || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await deleteCarInstanceResident(deleteTargetId);

      if (result.success) {
        setModalMessage('거주자 연결이 성공적으로 삭제되었습니다.');
        setSuccessModalOpen(true);
        await loadResidentData();
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



  // 연결된 세대 테이블 컬럼 정의
  const connectedInstanceColumns: BaseTableColumn<typeof connectedInstances[0]>[] = [
    {
      key: 'instanceId',
      header: '세대 ID',
      width: '12%',
      align: 'center',
    },
    {
      key: 'address1Depth',
      header: '세대 정보',
      width: '25%',
      align: 'start',
      cell: (item: typeof connectedInstances[0]) => `${item.address1Depth} ${item.address2Depth}`,
    },
    {
      key: 'carShareOnoff',
      header: '공유 설정',
      width: '15%',
      align: 'center',
      cell: (item: typeof connectedInstances[0]) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${item.carShareOnoff
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
          }`}>
          {item.carShareOnoff ? '공유' : '전용'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: '연결일자',
      width: '20%',
      align: 'center',
      type: 'datetime',
    },
    {
      header: '선택',
      width: '15%',
      align: 'center',
      cell: (item: typeof connectedInstances[0]) => {
        const isSelected = createFormData.selectedInstance?.id === item.instanceId;

        return (
          <Button
            variant={isSelected ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleConnectedInstanceSelect(item)}
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
        <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'ACTIVE'
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
  // 차량 연결 거주자 컬럼 정의
  const carResidentColumns: BaseTableColumn<ResidentWithAddress>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '10%',
      align: 'center',
    },
    {
      key: 'name',
      header: '이름',
      width: '15%',
      align: 'start',
    },
    {
      key: 'phone',
      header: '연락처',
      width: '15%',
      align: 'start',
      cell: (item: ResidentWithAddress) => item.phone || '-',
    },
    {
      key: 'email',
      header: '이메일',
      width: '20%',
      align: 'start',
      cell: (item: ResidentWithAddress) => item.email || '-',
    },
    {
      key: 'address',
      header: '주소',
      width: '20%',
      align: 'start',
      cell: (item: ResidentWithAddress) => `${item.address1Depth} ${item.address2Depth}${item.address3Depth ? ` ${item.address3Depth}` : ''}`,
    },
    {
      key: 'createdAt',
      header: '등록일자',
      align: 'center',
      width: '15%',
      type: 'datetime',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 목록 섹션 */}
      <SectionPanel
        title="차량 연결 거주자 목록"
        subtitle="현재 차량에 연결된 거주자들을 확인합니다."
        icon={<Users size={18} />}
      >
        {carResidents.length === 0 && !loading ? (
          <div className="flex flex-col justify-center items-center py-12 text-center">
            <Users size={48} className="mb-4 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-medium text-foreground">
              연결된 거주자 없음
            </h3>
            <p className="max-w-md text-muted-foreground">
              현재 이 차량에 연결된 거주자가 없습니다.
            </p>
          </div>
        ) : (
          <PaginatedTable
            data={carResidents as unknown as Record<string, unknown>[]}
            columns={carResidentColumns as unknown as BaseTableColumn<Record<string, unknown>>[]}
            pageSize={5}
            pageSizeOptions={[5, 10, 20]}
            itemName="연결 거주자"
            isFetching={loading}
          />
        )}
      </SectionPanel>

      {/* 생성 섹션 */}
      <SectionPanel
        title="거주자 연결 추가"
        subtitle="새로운 거주자를 차량에 연결합니다."
        icon={<Plus size={18} />}
      >
        <div className="space-y-6">
          {/* 1단계: 연결된 세대 선택 */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium">1단계: 세대 선택</h4>
            <div className="p-4 rounded-lg border bg-card">
              {connectedInstances.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="text-muted-foreground">
                    이 차량에 연결된 세대가 없습니다.<br />
                    먼저 세대 연결을 추가해주세요.
                  </div>
                </div>
              ) : (
                <PaginatedTable
                  data={connectedInstances as unknown as Record<string, unknown>[]}
                  columns={connectedInstanceColumns as unknown as BaseTableColumn<Record<string, unknown>>[]}
                  pageSize={5}
                  pageSizeOptions={[5, 10]}
                  itemName="연결된 세대"
                  isFetching={false}
                />
              )}
            </div>
          </div>

          {/* 2단계: 거주자 선택 */}
          {createFormData.selectedInstance && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium">2단계: 거주자 선택</h4>
              <div className="p-4 rounded-lg border bg-card">
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
              <div className="flex p-4 w-full rounded-lg border bg-card">
                {/* 주차량 설정 */}
                <div className="flex gap-3 justify-center items-center w-[50%]">
                  <p className="text-sm font-medium text-foreground">
                    주차량 설정
                  </p>
                  <SimpleToggleSwitch
                    checked={createFormData.isPrimary}
                    onChange={(checked) => setCreateFormData(prev => ({ ...prev, isPrimary: checked }))}
                    disabled={isSubmitting}
                    size="md"
                  />
                </div>

                {/* 알람 설정 */}
                <div className="flex gap-3 justify-center items-center w-[50%]">
                  <label className="text-sm font-medium text-foreground">
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
          )}

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              variant="ghost"
              onClick={resetModal}
              disabled={isSubmitting}
            >
              초기화
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
      </SectionPanel>





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
