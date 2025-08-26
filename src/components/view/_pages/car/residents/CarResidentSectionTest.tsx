'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Users, Link } from 'lucide-react';

import Modal from '@/components/ui/ui-layout/modal/Modal';
import { Button } from '@/components/ui/ui-input/button/Button';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { SimpleToggleSwitch } from '@/components/ui/ui-input/simple-input/SimpleToggleSwitch';

import { createCarInstanceResident } from '@/services/cars/cars_residents_POST';
import { deleteCarInstanceResident } from '@/services/cars/cars_residents@id_DELETE';
import { getCarInstanceResidentDetail } from '@/services/cars/cars_residents@id_GET';
import { updateCarInstanceResident } from '@/services/cars/cars_residents@id_PATCH';

import { getInstanceDetail } from '@/services/instances/instances@id_GET';
import { getCarResidents } from '@/services/cars/cars@carId_residents_GET';
import { Instance, ResidentInstanceWithResident } from '@/types/instance';
import { CarWithInstance, CarInstanceResidentDetail, UpdateCarInstanceResidentRequest, CarResidentWithDetails } from '@/types/car';

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

interface DetailFormData {
  carAlarm: boolean;
  isPrimary: boolean;
}

export default function CarResidentSection({
  car,
  onDataChange
}: CarResidentSectionProps) {
  // 데이터 상태
  const [carResidents, setCarResidents] = useState<CarResidentWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableResidents, setAvailableResidents] = useState<ResidentInstanceWithResident[]>([]);
  const [loadingResidents, setLoadingResidents] = useState(false);
  const [connectedInstances, setConnectedInstances] = useState<Array<{
    id: number;
    instanceId: number;
    carShareOnoff: boolean;
    createdAt: string;
    address1Depth: string;
    address2Depth: string;
    ownerName: string;
    instanceType: 'GENERAL' | 'TEMP' | 'COMMERCIAL';
  }>>([]);
  const [loadingInstances, setLoadingInstances] = useState(false);

  // 모달 상태
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState<CarInstanceResidentDetail | null>(null);
  const [selectedResidentInfo, setSelectedResidentInfo] = useState<CarResidentWithDetails | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  
  // 차량 소유자 해제 확인 Modal 상태
  const [primaryCarReleaseModal, setPrimaryCarReleaseModal] = useState<{
    isOpen: boolean;
    otherPrimaryResidents: CarResidentWithDetails[];
  }>({
    isOpen: false,
    otherPrimaryResidents: []
  });

  // 폼 상태
  const [createFormData, setCreateFormData] = useState<CreateResidentFormData>({
    selectedInstance: null,
    selectedResident: null,
    carAlarm: false,
    isPrimary: false,
  });
  const [detailFormData, setDetailFormData] = useState<DetailFormData>({
    carAlarm: false,
    isPrimary: false,
  });
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 연결된 세대 상세 정보 로드
  const loadConnectedInstances = useCallback(async () => {
    if (!car.carInstance || car.carInstance.length === 0) {
      setConnectedInstances([]);
      return;
    }

    setLoadingInstances(true);
    try {
      const instancePromises = car.carInstance.map(async (carInstance) => {
        try {
          const result = await getInstanceDetail(carInstance.instanceId);
          if (result.success && result.data) {
            return {
              id: carInstance.id,
              instanceId: carInstance.instanceId,
              carShareOnoff: carInstance.carShareOnoff,
              createdAt: carInstance.createdAt,
              address1Depth: result.data.address1Depth,
              address2Depth: result.data.address2Depth,
              ownerName: result.data.ownerName || '-',
              instanceType: result.data.instanceType,
            };
          } else {
            // API 실패 시 기본값 사용
            return {
              id: carInstance.id,
              instanceId: carInstance.instanceId,
              carShareOnoff: carInstance.carShareOnoff,
              createdAt: carInstance.createdAt,
              address1Depth: `세대 ID: ${carInstance.instanceId}`,
              address2Depth: carInstance.carShareOnoff ? '(공유)' : '(전용)',
              ownerName: '-',
              instanceType: 'GENERAL' as const,
            };
          }
        } catch (error) {
          console.error(`세대 ${carInstance.instanceId} 상세 조회 중 오류:`, error);
          // 오류 시 기본값 사용
          return {
            id: carInstance.id,
            instanceId: carInstance.instanceId,
            carShareOnoff: carInstance.carShareOnoff,
            createdAt: carInstance.createdAt,
            address1Depth: `세대 ID: ${carInstance.instanceId}`,
            address2Depth: carInstance.carShareOnoff ? '(공유)' : '(전용)',
            ownerName: '-',
            instanceType: 'GENERAL' as const,
          };
        }
      });

      const instances = await Promise.all(instancePromises);
      setConnectedInstances(instances);
    } catch (error) {
      console.error('연결된 세대 목록 조회 중 오류:', error);
      setConnectedInstances([]);
    } finally {
      setLoadingInstances(false);
    }
  }, [car.carInstance]);

  // 세대 주민 목록 로드
  const loadInstanceResidents = useCallback(async (instanceId: number) => {
    setLoadingResidents(true);
    try {
      const result = await getInstanceDetail(instanceId);
      if (result.success && result.data) {
        setAvailableResidents(result.data.residentInstance || []);
      } else {
        console.error('세대 주민 조회 실패:', '데이터 조회에 실패했습니다.');
        setAvailableResidents([]);
      }
    } catch (error) {
      console.error('세대 주민 조회 중 오류:', error);
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
      selectedResident: null // 세대가 바뀌면 주민 선택 초기화
    }));

    // 선택된 세대의 주민 목록 로드
    await loadInstanceResidents(connectedInstance.instanceId);
  }, [loadInstanceResidents]);

  // 주민 선택 핸들러
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

  // 상세 모달 초기화
  const resetDetailModal = useCallback(() => {
    setDetailData(null);
    setSelectedResidentInfo(null);
    setDetailFormData({
      carAlarm: false,
      isPrimary: false
    });
  }, []);

  // 상세 조회 핸들러
  const handleDetailView = useCallback(async (carResidentConnectionId: number, residentInfo: CarResidentWithDetails) => {
    setDetailLoading(true);
    setDetailModalOpen(true);
    setSelectedResidentInfo(residentInfo);
    
    try {
      const result = await getCarInstanceResidentDetail(carResidentConnectionId);
      if (result.success && result.data) {
        setDetailData(result.data);
        setDetailFormData({
          carAlarm: result.data.carAlarm,
          isPrimary: result.data.isPrimary
        });
      } else {
        console.error('상세 조회 실패:', '대상 작업에 실패했습니다.');
        setModalMessage('상세 조회에 실패했습니다.');
        setDetailModalOpen(false);
      }
    } catch (error) {
      console.error('상세 조회 중 오류:', error);
      setModalMessage('상세 조회 중 오류가 발생했습니다.');
      setDetailModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  }, []);
  // #endregion

  // 차량-주민 데이터 로딩 (실제 설정값 포함)
  const loadCarResidentsWithDetails = useCallback(async () => {
    try {
      // 1단계: 기본 주민 목록 조회
      const basicResult = await getCarResidents(car.id, car.carInstance[0]?.instanceId || 0);
      if (!basicResult.success || !basicResult.data) {
        return [];
      }

      // 2단계: 각 주민의 실제 설정값 조회
      const detailedResidents = await Promise.all(
        basicResult.data.map(async (resident) => {
          try {
            const detailResult = await getCarInstanceResidentDetail(resident.carInstanceResidentId);
            if (detailResult.success && detailResult.data) {
              return {
                ...resident,
                isPrimary: detailResult.data.isPrimary,
                carAlarm: detailResult.data.carAlarm
              };
            }
          } catch (error) {
            console.error(`주민 ${resident.name} 상세 정보 조회 중 오류:`, error);
          }
          return resident; // 실패시 기본값 유지
        })
      );

      return detailedResidents;
    } catch (error) {
      console.error('차량-주민 데이터 로딩 중 오류:', error);
      return [];
    }
  }, [car.id, car.carInstance]);

  // #region 데이터 로드
  const loadResidentData = useCallback(async () => {
    setLoading(true);
    try {
      const detailedResidents = await loadCarResidentsWithDetails();
      setCarResidents(detailedResidents);
    } catch (error) {
      console.error('차량-주민 조회 중 오류:', error);
      setCarResidents([]);
    } finally {
      setLoading(false);
    }
  }, [loadCarResidentsWithDetails]);

  useEffect(() => {
    loadResidentData();
    loadConnectedInstances();
  }, [loadResidentData, loadConnectedInstances]);
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
        setModalMessage(`${instanceAddr} 세대의 ${residentName} 주민이 성공적으로 연결되었습니다.`);
        setSuccessModalOpen(true);
        resetModal();
        setCreateModalOpen(false);
        await loadResidentData();
        onDataChange();
      } else {
        setModalMessage('주민 연결 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('주민 연결 생성 중 오류:', error);
      setModalMessage('주민 연결 생성 중 오류가 발생했습니다.');
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
        setModalMessage('주민 연결이 성공적으로 삭제되었습니다.');
        setSuccessModalOpen(true);
        await loadResidentData();
        onDataChange();
      } else {
        setModalMessage('주민 연결 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('주민 연결 삭제 중 오류:', error);
      setModalMessage('주민 연결 삭제 중 오류가 발생했습니다.');
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
      setIsSubmitting(false);
    }
  };

  // 실제 상세 정보 업데이트를 수행하는 함수
  const performDetailUpdate = useCallback(async () => {
    if (!detailData || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const updateData: UpdateCarInstanceResidentRequest = {
        carAlarm: detailFormData.carAlarm,
        isPrimary: detailFormData.isPrimary,
      };

      const result = await updateCarInstanceResident(detailData.id, updateData);

      if (result.success) {
        setModalMessage('주민 연결 정보가 성공적으로 수정되었습니다.');
        setSuccessModalOpen(true);
        setDetailModalOpen(false);
        resetDetailModal();
        await loadResidentData();
        onDataChange();
      } else {
        setModalMessage('주민 연결 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('주민 연결 수정 중 오류:', error);
      setModalMessage('주민 연결 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }, [detailData, detailFormData, isSubmitting, resetDetailModal, loadResidentData, onDataChange]);

  // 수정 핸들러
  const handleDetailUpdate = useCallback(async () => {
    if (!detailData || isSubmitting) return;

    // 차량 소유자 해제를 시도하는 경우 확인
    const isReleasingPrimary = detailData.isPrimary && !detailFormData.isPrimary;
    
    if (isReleasingPrimary) {
      // 다른 주민들 중 차량 소유자이 활성화된 사람이 있는지 확인
      const otherPrimaryResidents = carResidents.filter(resident => 
        resident.carInstanceResidentId !== detailData.id && Boolean(resident.isPrimary)
      );
      
      if (otherPrimaryResidents.length > 0) {
        // 다른 차량 소유자가 있으면 경고 모달 표시
        setPrimaryCarReleaseModal({
          isOpen: true,
          otherPrimaryResidents
        });
        return;
      }
    }

    // 직접 업데이트 실행
    await performDetailUpdate();
  }, [detailData, detailFormData, isSubmitting, carResidents, performDetailUpdate]);

  // 차량 소유자 해제 확인 처리
  const handleConfirmPrimaryCarRelease = useCallback(async () => {
    setPrimaryCarReleaseModal({
      isOpen: false,
      otherPrimaryResidents: []
    });
    await performDetailUpdate();
  }, [performDetailUpdate]);

  // 차량 소유자 해제 취소
  const handleCancelPrimaryCarRelease = useCallback(() => {
    setPrimaryCarReleaseModal({
      isOpen: false,
      otherPrimaryResidents: []
    });
  }, []);



  // 연결된 세대 테이블 컬럼 정의
  const connectedInstanceColumns: BaseTableColumn<typeof connectedInstances[0]>[] = [
    {
      key: 'instanceId',
      header: '세대 ID',
      minWidth: '140px',
      align: 'center',
    },
    {
      key: 'address1Depth',
      header: '동호수',
      minWidth: '300px',
      align: 'start',
      cell: (item: typeof connectedInstances[0]) => `${item.address1Depth} ${item.address2Depth}`,
    },
    {
      key: 'carShareOnoff',
      header: '공유 여부',
      minWidth: '180px',
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
      minWidth: '240px',
      align: 'center',
      type: 'datetime',
    },
    {
      header: '선택',
      minWidth: '180px',
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

  // 주민 선택 테이블 컬럼 정의
  const residentColumns: BaseTableColumn<ResidentInstanceWithResident>[] = [
    {
      key: 'id',
      header: 'ID',
      minWidth: '120px',
      align: 'center',
      cell: (item: ResidentInstanceWithResident) => item.resident.id,
    },
    {
      key: 'name',
      header: '이름',
      minWidth: '180px',
      align: 'start',
      cell: (item: ResidentInstanceWithResident) => item.resident.name,
    },
    {
      key: 'phone',
      header: '연락처',
      minWidth: '240px',
      align: 'start',
      cell: (item: ResidentInstanceWithResident) => item.resident.phone,
    },
    {
      key: 'email',
      header: '이메일',
      minWidth: '300px',
      align: 'start',
      cell: (item: ResidentInstanceWithResident) => item.resident.email,
    },
    {
      key: 'status',
      header: '상태',
      minWidth: '120px',
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
      minWidth: '120px',
      align: 'center',
      cell: (item: ResidentInstanceWithResident) => {
        const isSelected = createFormData.selectedResident?.id === item.id;
        // 현재 선택된 세대 + 주민 조합이 이미 연결되어 있는지 확인 (세대 ID로 비교)
        const isAlreadyConnected = createFormData.selectedInstance && carResidents.some(carResident => 
          carResident.id === item.resident.id && 
          carResident.instanceId === createFormData.selectedInstance!.id
        );

        if (isAlreadyConnected) {
          return (
            <Button
              variant="secondary"
              size="sm"
              disabled={true}
            >
              이 세대에서 이미 연결됨
            </Button>
          );
        }

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
  // 차량 연결 주민 컬럼 정의
  const carResidentColumns: BaseTableColumn<CarResidentWithDetails>[] = [
    {
      key: 'carInstanceResidentId',
      header: '연결 ID',
      minWidth: '80px',
      align: 'center',
      cell: (item: CarResidentWithDetails) => item.carInstanceResidentId,
    },
    {
      key: 'residentId',
      header: '주민 ID',
      minWidth: '80px',
      align: 'center',
      cell: (item: CarResidentWithDetails) => item.id,
    },
    {
      key: 'name',
      header: '이름',
      minWidth: '120px',
      align: 'center',
      cell: (item: CarResidentWithDetails) => item.name,
    },
    {
      key: 'phone',
      header: '연락처',
      minWidth: '160px',
      align: 'center',
      cell: (item: CarResidentWithDetails) => item.phone || '-',
    },
    {
      key: 'email',
      header: '이메일',
      minWidth: '220px',
      align: 'center',
      cell: (item: CarResidentWithDetails) => item.email || '-',
    },
    {
      key: 'address',
      header: '주소',
      minWidth: '140px',
      align: 'center',
      cell: (item: CarResidentWithDetails) => `${item.address1Depth} ${item.address2Depth}${item.address3Depth ? ` ${item.address3Depth}` : ''}`,
    },
    {
      key: 'createdAt',
      header: '등록일자',
      align: 'center',
      minWidth: '160px',
      type: 'datetime',
    },
    {
      header: '작업',
      minWidth: '240px',
      align: 'center',
      cell: (item: CarResidentWithDetails) => (
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDetailView(item.carInstanceResidentId, item)}
            disabled={detailLoading || isSubmitting}
          >
            상세보기
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setDeleteTargetId(item.carInstanceResidentId);
              setDeleteConfirmOpen(true);
            }}
            disabled={isSubmitting}
          >
            연결해제
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 목록 섹션 */}
      <SectionPanel
        title="[ 차량 - 주민 ] 연결 목록"
        subtitle="현재 차량에 연결된 주민들을 확인합니다."
        icon={<Users size={18} />}
        headerActions={
          <Button
            variant="outline"
            size="default"
            onClick={() => setCreateModalOpen(true)}
            className="gap-1"
          >
            <Link size={14} />
            주민 연결 추가
          </Button>
        }
      >
        {carResidents.length === 0 && !loading ? (
          <div className="flex flex-col justify-center items-center py-12 text-center">
            <Users size={48} className="mb-4 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-medium text-foreground">
              연결된 주민 없음
            </h3>
            <p className="max-w-md text-muted-foreground">
              현재 이 차량에 연결된 주민이 없습니다.
            </p>
          </div>
        ) : (
          <PaginatedTable
            data={carResidents as unknown as Record<string, unknown>[]}
            columns={carResidentColumns as unknown as BaseTableColumn<Record<string, unknown>>[]}
            pageSize={5}
            pageSizeOptions={[5, 10, 20]}
            itemName="연결 주민"
            isFetching={loading}
          />
        )}
      </SectionPanel>



      {/* 주민 연결 추가 모달 */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          resetModal();
        }}
        title="주민 연결 추가"
        size="xl"
      >
        <div className="space-y-6">
          {/* 1단계: 연결된 세대 선택 */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium">1단계: 세대 선택</h4>
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
                  isFetching={loadingInstances}
                />
              )}
          </div>

          {/* 2단계: 주민 선택 */}
          {createFormData.selectedInstance && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium">2단계: 주민 선택</h4>
              <div className="p-4 rounded-lg border bg-card">
                {loadingResidents ? (
                  <div className="py-8 text-center">
                    <div className="text-muted-foreground">주민 목록을 불러오는 중...</div>
                  </div>
                ) : availableResidents.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="text-muted-foreground">해당 세대에 등록된 활성 주민이 없습니다.</div>
                  </div>
                ) : (
                  <PaginatedTable
                    data={availableResidents as unknown as Record<string, unknown>[]}
                    columns={residentColumns as unknown as BaseTableColumn<Record<string, unknown>>[]}
                    pageSize={5}
                    pageSizeOptions={[5, 10]}
                    itemName="주민"
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
                {/* 차량 소유자 설정 */}
                <div className="flex gap-3 justify-center items-center w-[50%]">
                  <p className="text-sm font-medium text-foreground">
                    차량 소유자 설정
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
              onClick={() => {
                setCreateModalOpen(false);
                resetModal();
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
              {isSubmitting ? '연결 생성 중...' : '주민 연결 생성'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="주민 연결 삭제 확인"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 삭제하시겠습니까?</h3>
            <p className="text-muted-foreground">
              이 작업은 되돌릴 수 없습니다. 주민 연결이 영구적으로 삭제됩니다.
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

      {/* 차량 소유자 해제 확인 Modal */}
      <Modal
        isOpen={primaryCarReleaseModal.isOpen}
        onClose={handleCancelPrimaryCarRelease}
        title="차량 소유자 해제 확인"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-orange-600">차량 소유자 해제</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">{selectedResidentInfo?.name}님</strong>의 차량 소유자 설정을 해제하시겠습니까?</p>
              {primaryCarReleaseModal.otherPrimaryResidents.length > 0 && (
                <div className="p-3 mt-3 text-sm text-amber-800 bg-amber-50 rounded-md border border-amber-200">
                  <p className="mb-2 font-medium">⚠️ 다른 차량 소유자가 있습니다:</p>
                  <ul className="space-y-1">
                    {primaryCarReleaseModal.otherPrimaryResidents.map((resident) => (
                      <li key={resident.carInstanceResidentId}>
                        • {resident.name} ({resident.address1Depth} {resident.address2Depth})
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs text-amber-700">
                    해제 후에도 위 주민들은 차량 소유자으로 유지됩니다.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 justify-center pt-4">
            <Button 
              variant="outline" 
              onClick={handleCancelPrimaryCarRelease}
              className="border-gray-300"
            >
              취소
            </Button>
            <Button 
              onClick={handleConfirmPrimaryCarRelease}
              className="bg-orange-600 hover:bg-orange-700"
            >
              해제하기
            </Button>
          </div>
        </div>
      </Modal>

      {/* 상세 조회/수정 모달 */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          resetDetailModal();
        }}
        title="차량 - 주민 연결 상세 정보"
        size="md"
      >
        <div className="space-y-6">
          {detailLoading ? (
            <div className="py-12 text-center">
              <div className="text-muted-foreground">상세 정보를 불러오는 중...</div>
            </div>
          ) : detailData ? (
            <>
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium">기본 정보</h4>
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border bg-card">
                  {/* 차량 정보 */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">차량 번호</label>
                    <p className="text-foreground">{car.carNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">차량 모델</label>
                    <p className="text-foreground">{car.brand && car.model ? `${car.brand} ${car.model}` : car.brand || car.model || '-'}</p>
                  </div>
                  
                  {/* 주민 정보 */}
                  {selectedResidentInfo && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground">주민 이름</label>
                        <p className="text-foreground">{selectedResidentInfo.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground">연락처</label>
                        <p className="text-foreground">{selectedResidentInfo.phone || '-'}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-muted-foreground">이메일</label>
                        <p className="text-foreground">{selectedResidentInfo.email || '-'}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-muted-foreground">주소</label>
                        <p className="text-foreground">{`${selectedResidentInfo.address1Depth} ${selectedResidentInfo.address2Depth}${selectedResidentInfo.address3Depth ? ` ${selectedResidentInfo.address3Depth}` : ''}`}</p>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">연결 등록일</label>
                    <p className="text-foreground">{new Date(detailData.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* 설정 수정 */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium">설정 수정</h4>
                <div className="flex p-4 w-full rounded-lg border bg-card">
                  {/* 차량 소유자 설정 */}
                  <div className="flex gap-3 justify-center items-center w-[50%]">
                    <p className="text-sm font-medium text-foreground">
                      차량 소유자 설정
                    </p>
                    <SimpleToggleSwitch
                      checked={detailFormData.isPrimary}
                      onChange={(checked) => setDetailFormData(prev => ({ ...prev, isPrimary: checked }))}
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
                      checked={detailFormData.carAlarm}
                      onChange={(checked) => setDetailFormData(prev => ({ ...prev, carAlarm: checked }))}
                      disabled={isSubmitting}
                      size="md"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <div className="text-muted-foreground">상세 정보를 불러올 수 없습니다.</div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => {
                setDetailModalOpen(false);
                resetDetailModal();
              }}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              variant="primary"
              onClick={handleDetailUpdate}
              disabled={!detailData || isSubmitting}
            >
              {isSubmitting ? '수정 중...' : '수정 저장'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
