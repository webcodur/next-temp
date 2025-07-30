/* 메뉴 설명: IP 차단 목록 조회 및 관리 */
'use client';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Unlock, Shield, AlertCircle } from 'lucide-react';

// UI 라이브러리 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/ui-layout/dialog/Dialog';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';

// Field 컴포넌트들
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';

// API 호출
import { getBlockedIpList } from '@/services/ip/block_GET';
import { deleteBlockedIp } from '@/services/ip/block@ip_DELETE';
import { deleteAllBlockedIp } from '@/services/ip/block_DELETE';

// 타입 정의
import { IpBlock } from '@/types/api';
import { Option } from '@/components/ui/ui-input/field/core/types';

// #region 검색 필터 인터페이스
interface SearchFilters {
  ip: string;
  blockType: string;
  blockReason: string;
}
// #endregion

export default function IpBlockListPage() {

  // #region 상태 관리
  const [ipBlockList, setIpBlockList] = useState<IpBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 검색 필터 상태
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    ip: '',
    blockType: '',
    blockReason: '',
  });

  // 다이얼로그 관련 상태
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteAllConfirmOpen, setDeleteAllConfirmOpen] = useState(false);
  const [deleteTargetIp, setDeleteTargetIp] = useState<string | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);  
  const [dialogMessage, setDialogMessage] = useState('');
  // #endregion

  // #region 차단 유형 옵션
  const blockTypeOptions: Option[] = useMemo(() => [
    { value: 'MANUAL', label: '수동 차단' },
    { value: 'AUTO', label: '자동 차단' },
  ], []);
  // #endregion

  // #region 필터링된 데이터
  const filteredData = useMemo(() => {
    if (!Array.isArray(ipBlockList) || !ipBlockList.length) return [];

    return ipBlockList.filter(item => {
      const ipMatch = !searchFilters.ip || 
        item.ip.toLowerCase().includes(searchFilters.ip.toLowerCase());
      
      const typeMatch = !searchFilters.blockType || 
        item.blockType === searchFilters.blockType;
      
      const reasonMatch = !searchFilters.blockReason || 
        item.blockReason.toLowerCase().includes(searchFilters.blockReason.toLowerCase());

      return ipMatch && typeMatch && reasonMatch;
    });
  }, [ipBlockList, searchFilters]);

  const hasSearchFilter = Object.values(searchFilters).some(value => value.trim() !== '');
  // #endregion

  // #region 데이터 로드
  const loadIpBlockData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await getBlockedIpList();
      
      if (result.success) {
        const data = Array.isArray(result.data?.data) ? result.data.data : [];
        setIpBlockList(data);
      } else {
        console.error('IP 차단 목록 로드 실패:', result.errorMsg);
        setError(result.errorMsg || 'IP 차단 목록을 불러오는데 실패했습니다.');
        setIpBlockList([]);
      }
    } catch (error) {
      console.error('IP 차단 목록 로드 중 오류:', error);
      setError('IP 차단 목록을 불러오는 중 오류가 발생했습니다.');
      setIpBlockList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIpBlockData();
  }, [loadIpBlockData]);
  // #endregion

  // #region 검색 관련 핸들러
  const handleSearch = useCallback(() => {
    // 검색은 클라이언트 필터링이므로 로딩 상태 불필요
  }, []);

  const handleReset = useCallback(() => {
    setSearchFilters({
      ip: '',
      blockType: '',
      blockReason: '',
    });
  }, []);

  const updateFilter = useCallback((field: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);
  // #endregion

  // #region 이벤트 핸들러
  const handleDeleteClick = useCallback((ip: string) => {
    setDeleteTargetIp(ip);
    setDeleteConfirmOpen(true);
  }, []);

  const handleDeleteAllClick = useCallback(() => {
    setDeleteAllConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTargetIp) return;

    try {
      const result = await deleteBlockedIp(deleteTargetIp);

      if (result.success) {
        setIpBlockList((prev) => Array.isArray(prev) ? prev.filter((item) => item.ip !== deleteTargetIp) : []);
        setDialogMessage('IP 차단이 성공적으로 해제되었습니다.');
        setSuccessDialogOpen(true);
      } else {
        setDialogMessage(`IP 차단 해제에 실패했습니다: ${result.errorMsg}`);
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('IP 차단 해제 중 오류:', error);
      setDialogMessage('IP 차단 해제 중 오류가 발생했습니다.');
      setErrorDialogOpen(true);
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTargetIp(null);
    }
  }, [deleteTargetIp]);

  const handleDeleteAllConfirm = useCallback(async () => {
    try {
      const result = await deleteAllBlockedIp();

      if (result.success) {
        setIpBlockList([]);
        setDialogMessage('모든 IP 차단이 성공적으로 해제되었습니다.');
        setSuccessDialogOpen(true);
      } else {
        setDialogMessage(`전체 IP 차단 해제에 실패했습니다: ${result.errorMsg}`);
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('전체 IP 차단 해제 중 오류:', error);
      setDialogMessage('전체 IP 차단 해제 중 오류가 발생했습니다.');
      setErrorDialogOpen(true);
    } finally {
      setDeleteAllConfirmOpen(false);
    }
  }, []);
  // #endregion

  // #region 검색 필드 구성
  const searchFields = useMemo(() => [
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
        />
      ),
      visible: true,
    },
    {
      key: 'blockType',
      label: '차단 유형 검색',
      element: (
        <FieldSelect
          id="search-blockType"
          label="차단 유형"
          placeholder="차단 유형을 선택하세요"
          options={blockTypeOptions}
          value={searchFilters.blockType}
          onChange={(value) => updateFilter('blockType', value)}
        />
      ),
      visible: true,
    },
    {
      key: 'blockReason',
      label: '차단 사유 검색',
      element: (
        <FieldText
          id="search-blockReason"
          label="차단 사유"
          placeholder="차단 사유를 입력하세요"
          value={searchFilters.blockReason}
          onChange={(value) => updateFilter('blockReason', value)}
          showSearchIcon={true}
        />
      ),
      visible: true,
    },
  ], [searchFilters, blockTypeOptions, updateFilter]);
  // #endregion

  // #region 컬럼 정의
  const columns: BaseTableColumn<IpBlock>[] = [
    {
      key: 'ip',
      header: 'IP 주소',
      align: 'start',
      width: '15%',
    },
    {
      key: 'blockType',
      header: '차단 유형',
      align: 'center',
      width: '10%',
      cell: (item: IpBlock) => item.blockType === 'MANUAL' ? '수동 차단' : '자동 차단',
    },
    {
      key: 'blockReason',
      header: '차단 사유',
      align: 'start',
      width: '25%',
    },
    {
      key: 'blockedAt',
      header: '차단 시간',
      align: 'center',
      width: '15%',
      cell: (item: IpBlock) => {
        const date = new Date(item.blockedAt);
        return date.toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
    {
      key: 'unblockedAt',
      header: '해제 시간',
      align: 'center',
      width: '15%',
      cell: (item: IpBlock) => {
        if (!item.unblockedAt) return '-';
        const date = new Date(item.unblockedAt);
        return date.toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
    {
      key: 'isActive',
      header: '상태',
      align: 'center',
      width: '8%',
      cell: (item: IpBlock) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${item.isActive
            ? 'bg-red-100 text-red-800'
            : 'bg-green-100 text-green-800'
          }`}>
          {item.isActive ? '차단 중' : '해제됨'}
        </span>
      ),
    },
    {
      header: '관리',
      align: 'center',
      width: '12%',
      cell: (item: IpBlock) => (
        <div className="flex gap-1 justify-center">
          {item.isActive && (
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(item.ip);
              }}
              title="IP 차단 해제"
            >
              <Unlock size={16} />
            </Button>
          )}
        </div>
      ),
    },
  ];
  // #endregion

  // #region 에러 상태 렌더링
  if (error && !isLoading) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center py-12">
        <AlertCircle className="w-16 h-16 text-destructive" />
        <div className="text-center">
          <h3 className="mb-2 text-lg font-semibold text-foreground">데이터 로드 실패</h3>
          <p className="mb-4 text-muted-foreground">{error}</p>
          <Button onClick={loadIpBlockData} variant="outline">
            다시 시도
          </Button>
        </div>
      </div>
    );
  }
  // #endregion

  // #region 렌더링
  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 영역 - 전체 해제 버튼 */}
      {!isLoading && Array.isArray(ipBlockList) && ipBlockList.some(item => item.isActive) && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteAllClick}
            title="전체 IP 차단 해제"
            className="text-orange-600 border-orange-200 hover:bg-orange-50"
          >
            <Shield size={16} className="mr-2" />
            전체 해제
          </Button>
        </div>
      )}

      {/* 고급 검색 */}
      <AdvancedSearch
        title="IP 차단 검색"
        fields={searchFields}
        onSearch={handleSearch}
        onReset={handleReset}
        searchLabel="검색"
        resetLabel="초기화"
        defaultOpen={false}
      />

      {/* 테이블 */}
      <PaginatedTable
        data={isLoading ? null : (filteredData as unknown as Record<string, unknown>[])}
        columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        itemName={hasSearchFilter ? "검색된 IP" : "차단된 IP"}
        isFetching={isLoading}
      />

      {/* 검색 결과 없음 메시지 */}
      {!isLoading && hasSearchFilter && filteredData.length === 0 && Array.isArray(ipBlockList) && ipBlockList.length > 0 && (
        <div className="flex flex-col gap-2 justify-center items-center py-8">
          <p className="text-muted-foreground">검색 조건에 맞는 IP 차단 정보가 없습니다.</p>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            검색 조건 초기화
          </Button>
        </div>
      )}

      {/* 개별 IP 차단 해제 확인 다이얼로그 */}
      <Dialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        variant="warning"
        title="IP 차단 해제 확인"
      >
        <DialogHeader>
          <DialogTitle>정말로 차단을 해제하시겠습니까?</DialogTitle>
          <DialogDescription>
            {deleteTargetIp}의 차단이 해제됩니다. 이 작업은 되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
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
            해제
          </Button>
        </DialogFooter>
      </Dialog>

      {/* 전체 IP 차단 해제 확인 다이얼로그 */}
      <Dialog
        isOpen={deleteAllConfirmOpen}
        onClose={() => setDeleteAllConfirmOpen(false)}
        variant="warning"
        title="전체 IP 차단 해제 확인"
      >
        <DialogHeader>
          <DialogTitle>정말로 모든 IP 차단을 해제하시겠습니까?</DialogTitle>
          <DialogDescription>
            현재 차단된 모든 IP의 차단이 해제됩니다. 이 작업은 되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setDeleteAllConfirmOpen(false)}
          >
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAllConfirm}
          >
            전체 해제
          </Button>
        </DialogFooter>
      </Dialog>

      {/* 성공 다이얼로그 */}
      <Dialog
        isOpen={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        variant="success"
        title="작업 완료"
      >
        <DialogHeader>
          <DialogTitle>성공</DialogTitle>
          <DialogDescription>
            {dialogMessage}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={() => setSuccessDialogOpen(false)}>
            확인
          </Button>
        </DialogFooter>
      </Dialog>

      {/* 오류 다이얼로그 */}
      <Dialog
        isOpen={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        variant="error"
        title="오류 발생"
      >
        <DialogHeader>
          <DialogTitle>오류</DialogTitle>
          <DialogDescription>
            {dialogMessage}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={() => setErrorDialogOpen(false)}>
            확인
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
  // #endregion
} 