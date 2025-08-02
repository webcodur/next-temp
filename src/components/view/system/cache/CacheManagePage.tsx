/* 메뉴 설명: 네임스페이스별 캐시 관리 */
'use client';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Trash2, Database, RefreshCw, Search } from 'lucide-react';

// UI 라이브러리 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/ui-layout/dialog/Dialog';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';

// Field 컴포넌트들
import FieldText from '@/components/ui/ui-input/field/text/FieldText';

// API 호출
import { getCacheStats } from '@/services/cache/cache_stats_GET';
import { getCacheStatsByNamespace } from '@/services/cache/cache_namespace@namespace_stats_GET';
import { deleteCacheNamespace } from '@/services/cache/cache_namespace@namespace_DELETE';

// 타입 정의
import { CacheNamespaceStats } from '@/types/api';

// #region 네임스페이스 데이터 인터페이스
interface NamespaceData {
  namespace: string;
  keys: number;
  memory: number;
  keyList?: string[];
}
// #endregion

// #region 검색 필터 인터페이스
interface SearchFilters {
  namespace: string;
}
// #endregion

export default function CacheManagePage() {
  
  // #region 상태 관리
  const [namespaceList, setNamespaceList] = useState<NamespaceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // 검색 필터 상태
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    namespace: '',
  });
  
  // 상세 정보 관련 상태
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedNamespace, setSelectedNamespace] = useState<CacheNamespaceStats | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  
  // 삭제 관련 상태
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetNamespace, setDeleteTargetNamespace] = useState<string | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  // #endregion

  // #region 유틸리티 함수
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };
  // #endregion

  // #region 데이터 로드
  const loadCacheData = useCallback(async (filters?: Partial<SearchFilters>) => {
    setLoading(true);
    try {
      const result = await getCacheStats();
      
      if (result.success) {
        console.log('캐시 관리 API 응답:', result.data); // 디버깅용
        const namespaces = result.data?.namespaces ?? {};
        let filteredData = Object.entries(namespaces).map(([namespace, stats]) => ({
          namespace,
          keys: (stats as { keys?: number; memory?: number })?.keys ?? 0,
          memory: (stats as { keys?: number; memory?: number })?.memory ?? 0,
        }));
        
        // 클라이언트 사이드 필터링
        if (filters?.namespace) {
          filteredData = filteredData.filter((item) => 
            item.namespace.toLowerCase().includes(filters.namespace!.toLowerCase())
          );
        }
        
        setNamespaceList(filteredData);
        setLastUpdated(new Date());
      } else {
        console.error('캐시 데이터 로드 실패:', result.errorMsg);
        setNamespaceList([]);
      }
    } catch (error) {
      console.error('캐시 데이터 로드 중 오류:', error);
      setNamespaceList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCacheData();
  }, [loadCacheData]);
  // #endregion

  // #region 검색 관련 핸들러
  const handleSearch = useCallback(() => {
    const activeFilters = Object.entries(searchFilters).reduce((acc, [key, value]) => {
      if (value.trim()) {
        acc[key as keyof SearchFilters] = value.trim();
      }
      return acc;
    }, {} as Partial<SearchFilters>);

    loadCacheData(activeFilters);
  }, [searchFilters, loadCacheData]);

  const handleReset = useCallback(() => {
    setSearchFilters({
      namespace: '',
    });
    loadCacheData();
  }, [loadCacheData]);

  const updateFilter = useCallback((field: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);
  // #endregion

  // #region 상세 정보 관련 핸들러
  const handleDetailClick = useCallback(async (namespace: string) => {
    setDetailLoading(true);
    setDetailDialogOpen(true);
    
    try {
      const result = await getCacheStatsByNamespace(namespace);
      
      if (result.success) {
        setSelectedNamespace(result.data || null);
      } else {
        console.error('네임스페이스 상세 정보 로드 실패:', result.errorMsg);
        setSelectedNamespace(null);
      }
    } catch (error) {
      console.error('네임스페이스 상세 정보 로드 중 오류:', error);
      setSelectedNamespace(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);
  // #endregion

  // #region 삭제 관련 핸들러
  const handleDeleteClick = useCallback((namespace: string) => {
    setDeleteTargetNamespace(namespace);
    setDeleteConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTargetNamespace) return;

    try {
      const result = await deleteCacheNamespace(deleteTargetNamespace);
      
      if (result.success) {
        setNamespaceList((prev) => prev.filter((item) => item.namespace !== deleteTargetNamespace));
        setDialogMessage('네임스페이스 캐시가 성공적으로 삭제되었습니다.');
        setSuccessDialogOpen(true);
      } else {
        setDialogMessage(`네임스페이스 캐시 삭제에 실패했습니다: ${result.errorMsg}`);
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('네임스페이스 캐시 삭제 중 오류:', error);
      setDialogMessage('네임스페이스 캐시 삭제 중 오류가 발생했습니다.');
      setErrorDialogOpen(true);
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTargetNamespace(null);
    }
  }, [deleteTargetNamespace]);
  // #endregion

  // #region 검색 필드 구성
  const searchFields = useMemo(() => [
    {
      key: 'namespace',
      label: '네임스페이스 검색',
      element: (
        <FieldText
          id="search-namespace"
          label="네임스페이스"
          placeholder="네임스페이스를 입력하세요"
          value={searchFilters.namespace}
          onChange={(value) => updateFilter('namespace', value)}
          showSearchIcon={true}
        />
      ),
      visible: true,
    },
  ], [searchFilters, updateFilter]);
  // #endregion

  // #region 컬럼 정의
  const columns: BaseTableColumn<NamespaceData>[] = [
    {
      key: 'namespace',
      header: '네임스페이스',
      align: 'start',
      width: '30%',
      cell: (item: NamespaceData) => (
        <span className="font-mono text-sm">{item.namespace}</span>
      ),
    },
    {
      key: 'keys',
      header: '키 개수',
      align: 'end',
      width: '20%',
      cell: (item: NamespaceData) => (
        <span className="text-sm">{(item.keys ?? 0).toLocaleString()}</span>
      ),
    },
    {
      key: 'memory',
      header: '메모리 사용량',
      align: 'end',
      width: '20%',
      cell: (item: NamespaceData) => (
        <span className="text-sm">{formatBytes(item.memory ?? 0)}</span>
      ),
    },
    {
      key: 'actions',
      header: '관리',
      align: 'center',
      width: '30%',
      cell: (item: NamespaceData) => (
        <div className="flex gap-2 justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDetailClick(item.namespace);
            }}
            title="상세 정보"
          >
            <Search size={16} />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(item.namespace);
            }}
            title="캐시 삭제"
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
        title="캐시 관리" 
        subtitle="네임스페이스별 캐시 관리 및 삭제"
        rightActions={
          <div className="flex gap-2 items-center">
            {lastUpdated && (
              <span className="text-sm text-muted-foreground">
                마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadCacheData()}
              disabled={loading}
              title="새로고침"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </Button>
          </div>
        }
      />

      {/* 고급 검색 */}
      <AdvancedSearch
        title="네임스페이스 검색"
        fields={searchFields}
        onSearch={handleSearch}
        onReset={handleReset}
        searchLabel="검색"
        resetLabel="초기화"
        defaultOpen={false}
      />
      
      {/* 테이블 */}
      <PaginatedTable
        data={namespaceList as unknown as Record<string, unknown>[]}
        columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        itemName="네임스페이스"
      />

      {/* 상세 정보 다이얼로그 */}
      <Dialog
        isOpen={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        variant="default"
        title="네임스페이스 상세 정보"
      >
        <DialogHeader>
          <DialogTitle>
            {selectedNamespace?.namespace || '로딩 중...'}
          </DialogTitle>
          <DialogDescription>
            네임스페이스별 상세 캐시 정보
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {detailLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="text-muted-foreground">로딩 중...</div>
            </div>
          )}
          
          {!detailLoading && selectedNamespace && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm font-medium text-muted-foreground">키 개수</p>
                  <p className="text-xl font-bold">{(selectedNamespace.keys ?? 0).toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm font-medium text-muted-foreground">메모리 사용량</p>
                  <p className="text-xl font-bold">{formatBytes(selectedNamespace.memory ?? 0)}</p>
                </div>
              </div>
              
              {selectedNamespace.keyList && selectedNamespace.keyList.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">
                    키 목록 (최대 10개)
                  </p>
                  <div className="overflow-y-auto p-4 max-h-48 rounded-lg bg-muted">
                    {selectedNamespace.keyList.slice(0, 10).map((key, index) => (
                      <div key={index} className="py-1 font-mono text-xs border-b border-border last:border-b-0">
                        {key}
                      </div>
                    ))}
                    {selectedNamespace.keyList.length > 10 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        ... 외 {selectedNamespace.keyList.length - 10}개
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {!detailLoading && !selectedNamespace && (
            <div className="flex justify-center items-center py-8">
              <div className="text-muted-foreground">상세 정보를 불러올 수 없습니다.</div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => setDetailDialogOpen(false)}>
            닫기
          </Button>
        </DialogFooter>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        variant="warning"
        title="네임스페이스 캐시 삭제 확인"
      >
        <DialogHeader>
          <DialogTitle>정말로 삭제하시겠습니까?</DialogTitle>
          <DialogDescription>
            &quot;{deleteTargetNamespace}&quot; 네임스페이스의 모든 캐시가 영구적으로 삭제됩니다. 
            이 작업은 되돌릴 수 없습니다.
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
            삭제
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

      {/* 빈 상태 */}
      {!loading && namespaceList.length === 0 && (
        <div className="p-12 rounded-lg border bg-card border-border">
          <div className="text-center text-muted-foreground">
            <Database size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">네임스페이스가 없습니다</p>
            <p className="mt-2 text-sm">아직 등록된 캐시 네임스페이스가 없습니다.</p>
          </div>
        </div>
      )}
    </div>
  );
  // #endregion
} 