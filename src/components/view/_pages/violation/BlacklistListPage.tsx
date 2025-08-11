/* 메뉴 설명: 블랙리스트 차량 - 블랙리스트에 등록된 차량 목록 조회 및 관리 */
'use client';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Unlock } from 'lucide-react'; // Plus 아이콘은 CrudButton에서 처리


// UI 라이브러리 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import { CrudButton } from '@/components/ui/ui-input/crud-button/CrudButton';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/ui-effects/tooltip/Tooltip';

// Field 컴포넌트들
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';

// API 호출
import { searchBlacklists } from '@/services/blacklist/blacklists$_GET';
import { unblockBlacklist } from '@/services/blacklist/blacklists@id_unblock_PATCH';
import { createManualBlacklist } from '@/services/blacklist/blacklists_manual_POST';

// 타입 정의
import { BlacklistResponse, BlacklistType, BlacklistRegistrationReason } from '@/types/blacklist';
import { Option } from '@/components/ui/ui-input/field/core/types';

// #region 검색 필터 인터페이스
interface SearchFilters {
  carNumber: string;
  blacklistType: string;
  registrationReason: string;
  isActive: string;
}
// #endregion

// #region 상수 정의
const BLACKLIST_TYPE_OPTIONS: Option[] = [
  { value: 'AUTO', label: '자동' },
  { value: 'MANUAL', label: '수동' },
];

const REGISTRATION_REASON_OPTIONS: Option[] = [
  { value: 'VIOLATION_ACCUMULATION', label: '위반 누적' },
  { value: 'SERIOUS_VIOLATION', label: '심각한 위반' },
  { value: 'REPEATED_OFFENDER', label: '상습 위반자' },
  { value: 'SECURITY_THREAT', label: '보안 위협' },
  { value: 'CIVIL_COMPLAINT', label: '민원' },
  { value: 'COURT_ORDER', label: '법원 명령' },
  { value: 'ADMIN_DISCRETION', label: '관리자 판단' },
  { value: 'OTHER', label: '기타' },
];

const ACTIVE_STATUS_OPTIONS: Option[] = [
  { value: 'true', label: '활성' },
  { value: 'false', label: '비활성' },
];
// #endregion

export default function BlacklistListPage() {
  const router = useRouter();
  
  // #region 상태 관리
  const [blacklistList, setBlacklistList] = useState<BlacklistResponse[]>([]);
  
  // 검색 필터 상태
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    carNumber: '',
    blacklistType: '',
    registrationReason: '',
    isActive: '',
  });
  
  // 다이얼로그 관련 상태
  const [unblockConfirmOpen, setUnblockConfirmOpen] = useState(false);
  const [unblockTargetId, setUnblockTargetId] = useState<number | null>(null);
  const [unblockReason, setUnblockReason] = useState('');
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  

  
  // 등록 모달 관련 상태
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    carNumber: '',
    registrationReason: '',
    blockDays: '',
    blockReason: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  

  // #endregion

  // #region 데이터 로드
  const loadBlacklistData = useCallback(async (filters?: Partial<SearchFilters>) => {
    try {
      const searchParams = {
        page: 1,
        limit: 100, // 임시로 큰 수치 설정
        ...(filters?.carNumber && { carNumber: filters.carNumber }),
        ...(filters?.blacklistType && { blacklistType: filters.blacklistType as BlacklistType }),
        ...(filters?.registrationReason && { registrationReason: filters.registrationReason as BlacklistRegistrationReason }),
        ...(filters?.isActive && { isActive: filters.isActive === 'true' }),
      };

      const result = await searchBlacklists(searchParams);
      
      if (result.success) {
        setBlacklistList(result.data?.data || []);
      } else {
        console.error('블랙리스트 목록 로드 실패:', result.errorMsg);
        setBlacklistList([]);
      }
    } catch (error) {
      console.error('블랙리스트 목록 로드 중 오류:', error);
      setBlacklistList([]);
    }
  }, []);

  useEffect(() => {
    loadBlacklistData();
  }, [loadBlacklistData]);
  // #endregion

  // #region 검색 관련 핸들러
  const handleSearch = useCallback(() => {
    const activeFilters = Object.entries(searchFilters).reduce((acc, [key, value]) => {
      if (value.trim()) {
        acc[key as keyof SearchFilters] = value.trim();
      }
      return acc;
    }, {} as Partial<SearchFilters>);

    loadBlacklistData(activeFilters);
  }, [searchFilters, loadBlacklistData]);

  const handleReset = useCallback(() => {
    const resetFilters = {
      carNumber: '',
      blacklistType: '',
      registrationReason: '',
      isActive: '',
    };
    setSearchFilters(resetFilters);
    loadBlacklistData({}); // 빈 필터로 전체 데이터 로드
  }, [loadBlacklistData]);

  const updateFilter = useCallback((field: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);
  // #endregion

  // #region 이벤트 핸들러
  const handleCreateClick = useCallback(() => {
    setCreateFormData({
      carNumber: '',
      registrationReason: '',
      blockDays: '',
      blockReason: '',
    });
    setCreateModalOpen(true);
  }, []);

  const handleRowClick = useCallback((blacklist: BlacklistResponse, _index: number) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    router.push(`/parking/violation/blacklist/${blacklist.id}`);
  }, [router]);

  const handleUnblockClick = useCallback((id: number) => {
    setUnblockTargetId(id);
    setUnblockReason('관리자에 의한 해제');
    setUnblockConfirmOpen(true);
  }, []);

  const handleUnblockConfirm = useCallback(async () => {
    if (!unblockTargetId || !unblockReason.trim()) return;

    try {
      const result = await unblockBlacklist(unblockTargetId, { unblockReason });
      
      if (result.success) {
        setBlacklistList((prev) => 
          prev.map((item) => 
            item.id === unblockTargetId 
              ? { ...item, isActive: false, unblockReason, unblockedAt: new Date().toISOString() }
              : item
          )
        );
        setDialogMessage('블랙리스트가 성공적으로 해제되었습니다.');
        setSuccessDialogOpen(true);
      } else {
        setDialogMessage(`블랙리스트 해제에 실패했습니다: ${result.errorMsg}`);
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('블랙리스트 해제 중 오류:', error);
      setDialogMessage('블랙리스트 해제 중 오류가 발생했습니다.');
      setErrorDialogOpen(true);
    } finally {
      setUnblockConfirmOpen(false);
      setUnblockTargetId(null);
      setUnblockReason('');
    }
  }, [unblockTargetId, unblockReason]);

  const handleCreateSubmit = useCallback(async () => {
    if (!createFormData.carNumber.trim() || !createFormData.registrationReason.trim() || !createFormData.blockReason.trim() || isCreating) {
      return;
    }
    
    setIsCreating(true);
    
    try {
      const createData = {
        carNumber: createFormData.carNumber.trim(),
        registrationReason: createFormData.registrationReason as BlacklistRegistrationReason,
        blockDays: parseInt(createFormData.blockDays.trim()) || 30,
        blockReason: createFormData.blockReason.trim(),
      };

      const result = await createManualBlacklist(createData);

      if (result.success) {
        setDialogMessage('블랙리스트가 성공적으로 등록되었습니다.');
        setSuccessDialogOpen(true);
        setCreateModalOpen(false);
        loadBlacklistData(); // 목록 새로고침
      } else {
        setDialogMessage(`블랙리스트 등록에 실패했습니다: ${result.errorMsg}`);
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('블랙리스트 등록 중 오류:', error);
      setDialogMessage('블랙리스트 등록 중 오류가 발생했습니다.');
      setErrorDialogOpen(true);
    } finally {
      setIsCreating(false);
    }
  }, [createFormData, isCreating, loadBlacklistData]);

  const handleCreateFormChange = useCallback((field: string, value: string) => {
    setCreateFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const isCreateFormValid = useMemo(() => {
    return createFormData.carNumber.trim() && createFormData.registrationReason.trim();
  }, [createFormData]);
  // #endregion

  // #region 검색 필드 구성
  const searchFields = useMemo(() => [
    {
      key: 'carNumber',
      label: '차량번호 검색',
      element: (
        <FieldText
          id="search-carNumber"
          label="차량번호"
          placeholder="차량번호를 입력하세요"
          value={searchFilters.carNumber}
          onChange={(value) => updateFilter('carNumber', value)}
          showSearchIcon={true}
        />
      ),
      visible: true,
    },
    {
      key: 'blacklistType',
      label: '블랙리스트 유형',
      element: (
        <FieldSelect
          id="search-blacklistType"
          label="유형"
          placeholder="유형을 선택하세요"
          options={BLACKLIST_TYPE_OPTIONS}
          value={searchFilters.blacklistType}
          onChange={(value) => updateFilter('blacklistType', value)}
        />
      ),
      visible: true,
    },
    {
      key: 'registrationReason',
      label: '등록 사유',
      element: (
        <FieldSelect
          id="search-registrationReason"
          label="등록 사유"
          placeholder="등록 사유를 선택하세요"
          options={REGISTRATION_REASON_OPTIONS}
          value={searchFilters.registrationReason}
          onChange={(value) => updateFilter('registrationReason', value)}
        />
      ),
      visible: true,
    },
    {
      key: 'isActive',
      label: '활성 상태',
      element: (
        <FieldSelect
          id="search-isActive"
          label="활성 상태"
          placeholder="활성 상태를 선택하세요"
          options={ACTIVE_STATUS_OPTIONS}
          value={searchFilters.isActive}
          onChange={(value) => updateFilter('isActive', value)}
        />
      ),
      visible: true,
    },
  ], [searchFilters, updateFilter]);
  // #endregion

  // #region 컬럼 정의
  const columns: BaseTableColumn<Record<string, unknown>>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '6%',
      align: 'center',
    },
    {
      key: 'carNumber',
      header: '차량번호',
      align: 'center',
      width: '10%',
    },
    {
      key: 'blacklistType',
      header: '유형',
      align: 'center',
      width: '8%',
      cell: (item: Record<string, unknown>) => (item as unknown as BlacklistResponse).blacklistType === 'AUTO' ? '자동' : '수동',
    },
    {
      key: 'registrationReason',
      header: '등록 사유',
      align: 'start',
      width: '15%',
      cell: (item: Record<string, unknown>) => {
        const blacklist = item as unknown as BlacklistResponse;
        const reason = REGISTRATION_REASON_OPTIONS.find(opt => opt.value === blacklist.registrationReason);
        return reason ? reason.label : blacklist.registrationReason;
      },
    },
    {
      key: 'blockedUntil',
      header: '차단 만료일',
      align: 'center',
      width: '10%',
      type: 'datetime',
      cell: (item: Record<string, unknown>) => {
        const blacklist = item as unknown as BlacklistResponse;
        if (!blacklist.blockedUntil) return '무기한';
        return ''; // type: 'date'가 자동으로 포맷팅
      },
    },
    {
      key: 'isActive',
      header: '상태',
      align: 'center',
      width: '8%',
      cell: (item: Record<string, unknown>) => {
        const blacklist = item as unknown as BlacklistResponse;
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={`px-2 py-1 rounded text-xs font-medium cursor-help ${
                blacklist.isActive 
                  ? 'bg-destructive/10 text-destructive' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {blacklist.isActive ? '활성' : '해제됨'}
              </span>
            </TooltipTrigger>
            <TooltipContent variant="default" className="max-w-md">
              <div className="text-center">
                수동 해제 및 만료일시 경과에 따른 해제는 &apos;해제&apos; 로 표기
              </div>
            </TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      key: 'blockedAt',
      header: '차단일시',
      align: 'center',
      width: '12%',
      type: 'datetime',
    },
    {
      key: 'totalViolations',
      header: '총 위반 수',
      align: 'center',
      width: '8%',
      cell: (item: Record<string, unknown>) => {
        const blacklist = item as unknown as BlacklistResponse;
        return blacklist.totalViolations.toString();
      },
    },
    {
      header: '관리',
      align: 'center',
      width: '8%',
      cell: (item: Record<string, unknown>) => {
        const blacklist = item as unknown as BlacklistResponse;
        return (
          <div className="flex gap-1 justify-center">
            {blacklist.isActive && (
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnblockClick(blacklist.id);
                }}
                title="블랙리스트 해제"
              >
                <Unlock size={16} />
                해제
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  // #endregion

  // #region 렌더링
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="블랙리스트 차량" 
        subtitle="블랙리스트에 등록된 차량 목록 조회, 등록, 해제 관리"
        rightActions={
          <div className="flex gap-3">
            <CrudButton
              action="create"
              size="default"
              onClick={handleCreateClick}
              title="수동 블랙리스트 등록"
            />
          </div>
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
      <PaginatedTable
        data={blacklistList as unknown as Record<string, unknown>[]}
        columns={columns}
        onRowClick={(item, index) => handleRowClick(item as unknown as BlacklistResponse, index)}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        itemName="블랙리스트"
        minWidth="1100px"
      />

      {/* 해제 확인 다이얼로그 */}
      <Modal
        isOpen={unblockConfirmOpen}
        onClose={() => setUnblockConfirmOpen(false)}
        title="블랙리스트 해제 확인"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 해제하시겠습니까?</h3>
            <p className="text-muted-foreground">
              이 작업은 되돌릴 수 없습니다. 블랙리스트가 해제됩니다.
            </p>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">해제 사유</label>
            <input
              type="text"
              value={unblockReason}
              onChange={(e) => setUnblockReason(e.target.value)}
              placeholder="해제 사유를 입력해주세요"
              className="px-3 py-2 w-full rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <Button 
              variant="ghost" 
              onClick={() => setUnblockConfirmOpen(false)}
            >
              취소
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleUnblockConfirm}
              disabled={!unblockReason.trim()}
            >
              해제
            </Button>
          </div>
        </div>
      </Modal>

      {/* 성공 다이얼로그 */}
      <Modal
        isOpen={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        title="작업 완료"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-green-600">성공</h3>
            <p className="text-muted-foreground">{dialogMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setSuccessDialogOpen(false)}>
              확인
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



      {/* 등록 모달 */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="블랙리스트 등록"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">수동 블랙리스트 등록</h3>
            <p className="text-muted-foreground">차량을 블랙리스트에 수동으로 등록합니다</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  차량번호 <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={createFormData.carNumber}
                  onChange={(e) => handleCreateFormChange('carNumber', e.target.value)}
                  placeholder="차량번호를 입력해주세요"
                  className="px-3 py-2 w-full rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isCreating}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">
                  등록 사유 <span className="text-destructive">*</span>
                </label>
                <select
                  value={createFormData.registrationReason}
                  onChange={(e) => handleCreateFormChange('registrationReason', e.target.value)}
                  className="px-3 py-2 w-full rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isCreating}
                >
                  <option value="">등록 사유를 선택하세요</option>
                  {REGISTRATION_REASON_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">차단 기간 (일)</label>
                <input
                  type="number"
                  value={createFormData.blockDays}
                  onChange={(e) => handleCreateFormChange('blockDays', e.target.value)}
                  placeholder="차단 기간을 입력해주세요 (기본: 30일)"
                  className="px-3 py-2 w-full rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isCreating}
                  min="1"
                  max="999"
                />
                <div className="mt-1 text-xs text-muted-foreground">
                  미입력 시 30일로 설정됩니다.
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">차단 사유</label>
                <textarea
                  value={createFormData.blockReason}
                  onChange={(e) => handleCreateFormChange('blockReason', e.target.value)}
                  placeholder="차단 사유를 상세히 입력해주세요"
                  rows={3}
                  className="px-3 py-2 w-full rounded-md border resize-none border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isCreating}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button 
              variant="ghost" 
              onClick={() => setCreateModalOpen(false)}
              disabled={isCreating}
            >
              취소
            </Button>
            <CrudButton 
              action="save"
              onClick={handleCreateSubmit}
              disabled={!isCreateFormValid || isCreating}
            >
              {isCreating ? '등록 중...' : '등록'}
            </CrudButton>
          </div>
        </div>
      </Modal>


    </div>
  );
  // #endregion
}