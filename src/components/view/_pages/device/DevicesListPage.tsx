/* 메뉴 설명: 차단기 장비 관리 목록 페이지 */
'use client';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// UI 라이브러리 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import { SortableTable, SortableTableColumn } from '@/components/ui/ui-data/sortableTable/SortableTable';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';

// Field 컴포넌트들
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';

// API 호출
import { searchParkingDevices } from '@/services/devices/devices$_GET';
import { deleteParkingDevice } from '@/services/devices/devices@id_DELETE';
import { updateParkingDevice } from '@/services/devices/devices@id_PUT';

// 유틸리티
import { formatToShortDate } from '@/utils/dateFormat';

// 타입 정의
import { ParkingDevice } from '@/types/device';
import { Option } from '@/components/ui/ui-input/field/core/types';

// #region 검색 필터 인터페이스
interface SearchFilters {
  name: string;
  ip: string;
  deviceType: string;
  status: string;
  taxiPermission: string;
}
// #endregion

// #region 상수 정의
const DEVICE_TYPE_OPTIONS: Option[] = [
  { value: '1', label: '라즈베리파이' },
  { value: '2', label: '통합보드' },
];

const DEVICE_STATUS_OPTIONS: Option[] = [
  { value: '1', label: '자동운행' },
  { value: '2', label: '항시열림' },
  { value: '3', label: '바이패스' },
];

const PERMISSION_OPTIONS: Option[] = [
  { value: '1', label: '허용' },
  { value: '0', label: '거부' },
];
// #endregion

export default function DevicesListPage() {
  const router = useRouter();
  
  // #region 상태 관리
  const [deviceList, setDeviceList] = useState<ParkingDevice[]>([]);
  
  // 검색 필터 상태
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    name: '',
    ip: '',
    deviceType: '',
    status: '',
    taxiPermission: '',
  });
  
  // 다이얼로그 관련 상태
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  // #endregion

  // #region 데이터 로드
  const loadDeviceData = useCallback(async (filters?: Partial<SearchFilters>) => {
    try {
      const searchParams = {
        page: 1,
        limit: 100, // 임시로 큰 수치 설정
        ...(filters?.name && { name: filters.name }),
        ...(filters?.ip && { ip: filters.ip }),
        ...(filters?.deviceType && { deviceType: parseInt(filters.deviceType) }),
        ...(filters?.status && { status: parseInt(filters.status) }),
        ...(filters?.taxiPermission && { taxiPermission: parseInt(filters.taxiPermission) }),
      };

      const result = await searchParkingDevices(searchParams);
      
      if (result.success) {
        setDeviceList(result.data?.data || []);
      } else {
        console.error('차단기 목록 로드 실패:', result.errorMsg);
        setDeviceList([]);
        setDialogMessage(`차단기 목록을 불러올 수 없습니다: ${result.errorMsg}`);
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('차단기 목록 로드 중 오류:', error);
      setDeviceList([]);
      setDialogMessage('차단기 목록을 불러오는 중 오류가 발생했습니다.');
      setErrorDialogOpen(true);
    }
  }, []);

  useEffect(() => {
    loadDeviceData();
  }, [loadDeviceData]);
  // #endregion

  // #region 검색 관련 핸들러
  const handleSearch = useCallback(() => {
    const activeFilters = Object.entries(searchFilters).reduce((acc, [key, value]) => {
      if (value.trim()) {
        acc[key as keyof SearchFilters] = value.trim();
      }
      return acc;
    }, {} as Partial<SearchFilters>);

    loadDeviceData(activeFilters);
  }, [searchFilters, loadDeviceData]);

  const handleReset = useCallback(() => {
    const resetFilters = {
      name: '',
      ip: '',
      deviceType: '',
      status: '',
      taxiPermission: '',
    };
    setSearchFilters(resetFilters);
    loadDeviceData({}); // 빈 필터로 전체 데이터 로드
  }, [loadDeviceData]);

  const updateFilter = useCallback((field: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);
  // #endregion

  // #region 이벤트 핸들러
  const handleCreateClick = useCallback(() => {
    router.push('/parking/lot/device/create');
  }, [router]);

  const handleRowClick = useCallback((device: ParkingDevice) => {
    router.push(`/parking/lot/device/${device.id}`);
  }, [router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const handleDeleteClick = useCallback((id: number) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTargetId) return;

    try {
      const result = await deleteParkingDevice(deleteTargetId);
      
      if (result.success) {
        setDeviceList((prev) => prev.filter((device) => device.id !== deleteTargetId));
        // 성공 시 별도 모달 없이 조용히 처리
      } else {
        setDialogMessage(`차단기 삭제에 실패했습니다: ${result.errorMsg}`);
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('차단기 삭제 중 오류:', error);
      setDialogMessage('차단기 삭제 중 오류가 발생했습니다.');
      setErrorDialogOpen(true);
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    }
  }, [deleteTargetId]);

  const handleOrderChange = useCallback((newOrder: ParkingDevice[]) => {
    // 즉시 로컬 상태 업데이트 (UX 개선)
    const updatedDevices = newOrder.map((device, index) => ({
      ...device,
      sequence: index + 1,
    }));
    setDeviceList(updatedDevices);

    // 백그라운드에서 API 호출
    const updateSequences = async () => {
      try {
        const updatePromises = newOrder.map((device, index) => {
          const newSequence = index + 1;
          if (device.sequence !== newSequence) {
            return updateParkingDevice(device.id, { sequence: newSequence });
          }
          return Promise.resolve({ success: true });
        });

        const results = await Promise.all(updatePromises);
        const failures = results.filter(result => !result.success);

        if (failures.length > 0) {
          // 실패 시 에러 메시지 표시하고 원래 데이터 다시 로드
          setDialogMessage('일부 차단기 순서 변경에 실패했습니다. 원래 순서로 복원됩니다.');
          setErrorDialogOpen(true);
          loadDeviceData();
        }
        // 성공 시에는 이미 로컬 상태가 업데이트되어 있으므로 아무것도 하지 않음
      } catch (error) {
        console.error('순서 변경 중 오류:', error);
        setDialogMessage('순서 변경 중 오류가 발생했습니다. 원래 순서로 복원됩니다.');
        setErrorDialogOpen(true);
        loadDeviceData();
      }
    };

    updateSequences();
  }, [loadDeviceData]);
  // #endregion

  // #region 유틸리티 함수
  const getDeviceTypeLabel = (type: number) => {
    return DEVICE_TYPE_OPTIONS.find(opt => opt.value === type.toString())?.label || '알 수 없음';
  };

  const getStatusBadge = (status: number) => {
    const statusMap = {
      1: { label: '자동운행', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      2: { label: '항시열림', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
      3: { label: '바이패스', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { 
      label: '알 수 없음', 
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' 
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };
  // #endregion

  // #region 검색 필드 구성
  const searchFields = useMemo(() => [
    {
      key: 'name',
      label: '차단기명 검색',
      element: (
        <FieldText
          id="search-name"
          label="차단기명"
          placeholder="차단기명을 입력하세요"
          value={searchFilters.name}
          onChange={(value) => updateFilter('name', value)}
          showSearchIcon={true}
          onKeyDown={handleKeyDown}
        />
      ),
      visible: true,
    },
    {
      key: 'ip',
      label: 'IP 주소 검색',
      element: (
        <FieldText
          id="search-ip"
          label="IP 주소"
          placeholder="IP 주소를 입력하세요"
          value={searchFilters.ip}
          onChange={(value) => updateFilter('ip', value)}
          showSearchIcon={true}
          onKeyDown={handleKeyDown}
        />
      ),
      visible: true,
    },
    {
      key: 'deviceType',
      label: '디바이스 타입',
      element: (
        <FieldSelect
          id="search-device-type"
          label="디바이스 타입"
          placeholder="디바이스 타입을 선택하세요"
          options={DEVICE_TYPE_OPTIONS}
          value={searchFilters.deviceType}
          onChange={(value) => updateFilter('deviceType', value)}
        />
      ),
      visible: true,
    },
    {
      key: 'status',
      label: '운영 상태',
      element: (
        <FieldSelect
          id="search-status"
          label="운영 상태"
          placeholder="운영 상태를 선택하세요"
          options={DEVICE_STATUS_OPTIONS}
          value={searchFilters.status}
          onChange={(value) => updateFilter('status', value)}
        />
      ),
      visible: true,
    },
    {
      key: 'taxiPermission',
      label: '택시 출입 권한',
      element: (
        <FieldSelect
          id="search-taxi-permission"
          label="택시 출입 권한"
          placeholder="택시 출입 권한을 선택하세요"
          options={PERMISSION_OPTIONS}
          value={searchFilters.taxiPermission}
          onChange={(value) => updateFilter('taxiPermission', value)}
        />
      ),
      visible: true,
    },
  ], [searchFilters, updateFilter, handleKeyDown]);
  // #endregion

  // #region 컬럼 정의
  const columns: SortableTableColumn<ParkingDevice>[] = [
    {
      key: 'dragHandle',
      header: '이동',
      align: 'center',
      width: '5%',
    },
    {
      key: 'sequence',
      header: '순서',
      align: 'center',
      width: '5%',
      cell: (item: ParkingDevice) => item.sequence || '-',
    },
    {
      key: 'name',
      header: '차단기명',
      align: 'start',
      width: '11%',
    },
    {
      key: 'ip',
      header: 'IP 주소',
      align: 'center',
      width: '12%',
    },
    {
      key: 'port',
      header: '포트',
      align: 'center',
      width: '8%',
    },
    {
      key: 'deviceType',
      header: '디바이스 타입',
      align: 'center',
      width: '10%',
      cell: (item: ParkingDevice) => getDeviceTypeLabel(item.deviceType),
    },
    {
      key: 'status',
      header: '운영 상태',
      align: 'center',
      width: '10%',
      cell: (item: ParkingDevice) => getStatusBadge(item.status),
    },
    {
      key: 'representativePhone',
      header: '대표전화',
      align: 'center',
      width: '12%',
      cell: (item: ParkingDevice) => item.representativePhone || '-',
    },
    {
      key: 'createdAt',
      header: '등록일자',
      align: 'center',
      width: '10%',
      cell: (item: ParkingDevice) => formatToShortDate(item.createdAt),
    },
    {
      header: '관리',
      align: 'center',
      width: '7%',
      cell: (item: ParkingDevice) => (
        <div className="flex gap-1 justify-center">
          <Button
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(item.id);
            }}
            title="차단기 삭제"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];
  // #endregion

  // #region 렌더링
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="차단기 장비 관리" 
        subtitle="차단기 등록, 설정, 삭제 및 상태 관리"
        rightActions={
          <Button
            variant="primary"
            size="default"
            onClick={handleCreateClick}
            title="차단기 추가"
          >
            <Plus size={16} />
            차단기 추가
          </Button>
        }
      />

      {/* 고급 검색 */}
      <AdvancedSearch
        fields={searchFields}
        onSearch={handleSearch}
        onReset={handleReset}
        defaultOpen={false}
      />
      
      {/* 테이블 */}
      <SortableTable<ParkingDevice>
        data={deviceList}
        columns={columns}
        onRowClick={handleRowClick}
        onOrderChange={handleOrderChange}
        dragHandleColumn="dragHandle"
        itemName="차단기"
        minWidth="1100px"
      />

      {/* 삭제 확인 다이얼로그 */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="차단기 삭제 확인"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 삭제하시겠습니까?</h3>
            <p className="text-muted-foreground">
              이 작업은 되돌릴 수 없습니다. 차단기 정보가 영구적으로 삭제됩니다.
            </p>
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <Button 
              variant="ghost" 
              onClick={() => setDeleteConfirmOpen(false)}
            >
              취소
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
            >
              삭제
            </Button>
          </div>
        </div>
      </Modal>

      {/* 오류 다이얼로그 */}
      <Modal
        isOpen={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        title="오류 발생"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-red-600">오류</h3>
            <p className="text-muted-foreground">{dialogMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setErrorDialogOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
  // #endregion
}
