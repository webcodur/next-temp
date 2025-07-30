/* 메뉴 설명: 시스템 설정값 조회 및 수정 */
'use client';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// UI 라이브러리 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/ui-layout/dialog/Dialog';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';

// Field 컴포넌트들
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';

// API 호출
import { getAllConfigs } from '@/services/config/config$_GET';
import { deleteConfig } from '@/services/config/config@key_DELETE';

// 타입 정의
import { SystemConfig } from '@/types/api';
import { Option } from '@/components/ui/ui-input/field/core/types';

// #region 검색 필터 인터페이스
interface SearchFilters {
  key: string;
  type: string;
  description: string;
}
// #endregion

// #region API 응답 타입 정의
interface ApiSystemConfigResponse {
  id: number;
  config_key: string;
  config_value: string;
  description?: string;
  config_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  updated_by?: number;
  category?: string | null;
  // camelCase 변환된 필드들 (fetchClient에서 변환되는 경우)
  configKey?: string;
  configValue?: string;
  configType?: string;
  updatedAt?: string;
  updatedBy?: number;
}
// #endregion

export default function SystemConfigPage() {
  const router = useRouter();
  
  // #region 상태 관리
  const [configList, setConfigList] = useState<SystemConfig[]>([]);
  
  // 검색 필터 상태
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    key: '',
    type: '',
    description: '',
  });
  
  // 삭제 확인 관련 상태
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SystemConfig | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 알림 다이얼로그 상태
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  // #endregion

  // #region 타입 옵션
  const typeOptions: Option[] = useMemo(() => [
    { value: 'string', label: '문자열' },
    { value: 'number', label: '숫자' },
    { value: 'boolean', label: '불린' },
    { value: 'json', label: 'JSON' },
  ], []);
  // #endregion

  // #region 데이터 로드
  const loadConfigData = useCallback(async (filters?: Partial<SearchFilters>) => {
    try {
      const result = await getAllConfigs();
      
      if (result.success) {
        // API 응답이 { data: SystemConfig[] } 구조인 경우 처리
        const rawData = result.data?.data || result.data || [];
        
        // API 응답 데이터를 SystemConfig 타입에 맞게 매핑
        const mappedData: SystemConfig[] = Array.isArray(rawData) ? rawData.map((item: ApiSystemConfigResponse) => {
          const configType = mapApiTypeToSystemType(item.configType || item.config_type || 'STRING');
          const rawValue = item.configValue || item.config_value || '';
          
          // 타입에 따라 값 파싱
          let parsedValue: string | number | boolean | object = rawValue;
          try {
            switch (configType) {
              case 'number':
                parsedValue = parseFloat(rawValue);
                if (isNaN(parsedValue)) parsedValue = rawValue;
                break;
              case 'boolean':
                parsedValue = rawValue.toLowerCase() === 'true';
                break;
              case 'json':
                parsedValue = JSON.parse(rawValue);
                break;
              default:
                parsedValue = rawValue;
            }
          } catch {
            // 파싱 실패 시 원본 문자열 사용
            parsedValue = rawValue;
          }
          
          return {
            key: item.configKey || item.config_key || '',
            value: parsedValue,
            type: configType,
            description: item.description,
            updatedAt: item.updatedAt || item.updated_at || '',
            updatedBy: item.updatedBy || item.updated_by || 0,
          };
        }) : [];
        
        let filteredData = mappedData;
        
        // 클라이언트 사이드 필터링
        if (filters?.key) {
          filteredData = filteredData.filter((item: SystemConfig) => 
            item.key.toLowerCase().includes(filters.key!.toLowerCase())
          );
        }
        if (filters?.type) {
          filteredData = filteredData.filter((item: SystemConfig) => 
            item.type === filters.type
          );
        }
        if (filters?.description) {
          filteredData = filteredData.filter((item: SystemConfig) => 
            item.description?.toLowerCase().includes(filters.description!.toLowerCase())
          );
        }
        
        setConfigList(filteredData);
      } else {
        console.error('시스템 설정 로드 실패:', result.errorMsg);
        setConfigList([]);
      }
    } catch (error) {
      console.error('시스템 설정 로드 중 오류:', error);
      setConfigList([]);
    }
  }, []);

  // API 타입을 시스템 타입으로 매핑하는 헬퍼 함수
  const mapApiTypeToSystemType = (apiType: string): 'string' | 'number' | 'boolean' | 'json' => {
    switch (apiType?.toUpperCase()) {
      case 'BOOLEAN':
        return 'boolean';
      case 'INTEGER':
      case 'NUMBER':
        return 'number';
      case 'JSON':
      case 'OBJECT':
        return 'json';
      case 'STRING':
      default:
        return 'string';
    }
  };

  useEffect(() => {
    loadConfigData();
  }, [loadConfigData]);
  // #endregion

  // #region 검색 관련 핸들러
  const handleSearch = useCallback(() => {
    const activeFilters = Object.entries(searchFilters).reduce((acc, [key, value]) => {
      if (value.trim()) {
        acc[key as keyof SearchFilters] = value.trim();
      }
      return acc;
    }, {} as Partial<SearchFilters>);

    loadConfigData(activeFilters);
  }, [searchFilters, loadConfigData]);

  const handleReset = useCallback(() => {
    setSearchFilters({
      key: '',
      type: '',
      description: '',
    });
    loadConfigData();
  }, [loadConfigData]);

  const updateFilter = useCallback((field: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);
  // #endregion

  // #region 네비게이션 핸들러
  const handleRowClick = useCallback((config: SystemConfig) => {
    router.push(`/system/config/settings/${encodeURIComponent(config.key)}`);
  }, [router]);
  // #endregion

  // #region 삭제 관련 핸들러
  const handleDeleteClick = useCallback((config: SystemConfig) => {
    setDeleteTarget(config);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await deleteConfig(deleteTarget.key);

      if (result.success) {
        // 성공 시 목록 새로고침
        await loadConfigData();
        setDialogMessage('설정이 성공적으로 삭제되었습니다.');
        setSuccessDialogOpen(true);
        setDeleteDialogOpen(false);
        setDeleteTarget(null);
      } else {
        setDialogMessage(`설정 삭제에 실패했습니다: ${result.errorMsg}`);
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('설정 삭제 중 오류:', error);
      setDialogMessage('설정 삭제 중 오류가 발생했습니다.');
      setErrorDialogOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [deleteTarget, isSubmitting, loadConfigData]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  }, []);
  // #endregion

  // #region 검색 필드 구성
  const searchFields = useMemo(() => [
    {
      key: 'key',
      label: '설정 키 검색',
      element: (
        <FieldText
          id="search-key"
          label="설정 키"
          placeholder="설정 키를 입력하세요"
          value={searchFilters.key}
          onChange={(value) => updateFilter('key', value)}
          showSearchIcon={true}
        />
      ),
      visible: true,
    },
    {
      key: 'type',
      label: '타입 검색',
      element: (
        <FieldSelect
          id="search-type"
          label="데이터 타입"
          placeholder="데이터 타입을 선택하세요"
          options={typeOptions}
          value={searchFilters.type}
          onChange={(value) => updateFilter('type', value)}
        />
      ),
      visible: true,
    },
    {
      key: 'description',
      label: '설명 검색',
      element: (
        <FieldText
          id="search-description"
          label="설명"
          placeholder="설명을 입력하세요"
          value={searchFilters.description}
          onChange={(value) => updateFilter('description', value)}
          showSearchIcon={true}
        />
      ),
      visible: true,
    },
  ], [searchFilters, typeOptions, updateFilter]);
  // #endregion

  // #region 컬럼 정의
  const columns: BaseTableColumn<SystemConfig>[] = [
    {
      key: 'key',
      header: '설정 키',
      align: 'start',
      width: '20%',
      cell: (item: SystemConfig) => (
        <span className="font-mono text-sm">{item.key}</span>
      ),
    },
    {
      key: 'value',
      header: '현재 값',
      align: 'start',
      width: '25%',
      cell: (item: SystemConfig) => {
        let displayValue = '';
        if (item.type === 'json') {
          displayValue = JSON.stringify(item.value);
        } else {
          displayValue = String(item.value);
        }
        
        return (
          <span 
            className="block max-w-xs truncate" 
            title={displayValue}
          >
            {displayValue}
          </span>
        );
      },
    },
    {
      key: 'type',
      header: '타입',
      align: 'center',
      width: '10%',
      cell: (item: SystemConfig) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          item.type === 'string' ? 'bg-blue-100 text-blue-800' :
          item.type === 'number' ? 'bg-green-100 text-green-800' :
          item.type === 'boolean' ? 'bg-purple-100 text-purple-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {item.type}
        </span>
      ),
    },
    {
      key: 'description',
      header: '설명',
      align: 'start',
      width: '25%',
      cell: (item: SystemConfig) => (
        <span className="block truncate" title={item.description || '-'}>
          {item.description || '-'}
        </span>
      ),
    },
    {
      key: 'updatedAt',
      header: '수정 시간',
      align: 'center',
      width: '12%',
      cell: (item: SystemConfig) => {
        const date = new Date(item.updatedAt);
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
      header: '관리',
      align: 'center',
      width: '8%',
      cell: (item: SystemConfig) => (
        <div className="flex gap-1 justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(item);
            }}
            title="설정 삭제"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
        title="시스템 설정 관리" 
        subtitle="시스템 설정값 조회 및 수정"
      />

      {/* 고급 검색 */}
      <AdvancedSearch
        title="시스템 설정 검색"
        fields={searchFields}
        onSearch={handleSearch}
        onReset={handleReset}
        searchLabel="검색"
        resetLabel="초기화"
        defaultOpen={false}
      />
      
      {/* 테이블 */}
      <PaginatedTable
        data={configList as unknown as Record<string, unknown>[]}
        columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        itemName="설정"
        onRowClick={(item) => handleRowClick(item as unknown as SystemConfig)}
      />

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

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        isOpen={deleteDialogOpen}
        onClose={handleDeleteCancel}
        variant="error"
        title="설정 삭제"
      >
        <DialogHeader>
          <DialogTitle>설정 삭제 확인</DialogTitle>
          <DialogDescription>
            &apos;{deleteTarget?.key}&apos; 설정을 삭제하시겠습니까?
            <br />
            <strong>이 작업은 되돌릴 수 없습니다.</strong>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button 
            variant="ghost" 
            onClick={handleDeleteCancel}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button 
            variant="accent"
            onClick={handleDeleteConfirm}
            disabled={isSubmitting}
            className="text-white bg-red-600 hover:bg-red-700"
          >
            <Trash2 size={16} />
            {isSubmitting ? '삭제 중...' : '삭제'}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
  // #endregion
} 