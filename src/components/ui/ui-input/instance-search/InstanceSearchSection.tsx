'use client';

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Search } from 'lucide-react';

// UI 컴포넌트
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import { BaseTable, BaseTableColumn } from '@/components/ui/ui-data/baseTable/BaseTable';
import { PaginatedTable } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';

// Field 컴포넌트
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';

// API & 타입
import { searchInstances } from '@/services/instances/instances$_GET';
import { Instance, InstanceType } from '@/types/instance';
import { Option } from '@/components/ui/ui-input/field/core/types';

// #region 인터페이스 정의
export interface InstanceSearchFilters {
  address1Depth: string;
  address2Depth: string;
  instanceType: string;
  instanceName?: string;
}

export interface InstanceSearchField {
  key: keyof InstanceSearchFilters;
  label: string;
  placeholder: string;
  type: 'text' | 'select';
  options?: Option[]; // select 타입일 때만 사용
  visible: boolean;
}

export interface InstanceSearchSectionProps {
  // 검색 관련
  searchFields: InstanceSearchField[];
  initialFilters?: Partial<InstanceSearchFilters>;
  onSearchComplete?: (instances: Instance[]) => void;
  
  // 테이블 관련
  tableType?: 'base' | 'paginated';
  columns: BaseTableColumn<Instance>[];
  onRowClick?: (instance: Instance, index: number) => void;
  getRowClassName?: (instance: Instance) => string;
  pageSize?: number;
  pageSizeOptions?: number[];
  minWidth?: string;
  
  // UI 관련
  title?: string;
  subtitle?: string;
  showSection?: boolean;
  defaultSearchOpen?: boolean;
  searchMode?: 'client' | 'server';
  itemName?: string;
  
  // 기타
  excludeInstanceIds?: number[]; // 제외할 인스턴스 ID 목록
}
// #endregion

export default function InstanceSearchSection({
  // 검색 관련
  searchFields,
  initialFilters = {},
  onSearchComplete,
  
  // 테이블 관련
  tableType = 'base',
  columns,
  onRowClick,
  getRowClassName,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  minWidth = '800px',
  
  // UI 관련
  title = '세대 검색',
  subtitle = '조건에 맞는 세대를 검색합니다.',
  showSection = true,
  defaultSearchOpen = true,
  searchMode = 'server',
  itemName = '세대',
  
  // 기타
  excludeInstanceIds = [],
}: InstanceSearchSectionProps) {
  // #region 상태 관리
  const [instances, setInstances] = useState<Instance[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFilters, setSearchFilters] = useState<InstanceSearchFilters>({
    address1Depth: initialFilters.address1Depth || '',
    address2Depth: initialFilters.address2Depth || '',
    instanceType: initialFilters.instanceType || '',
    instanceName: initialFilters.instanceName || '',
  });
  
  // props 안정화를 위한 ref
  const excludeIdsRef = useRef(excludeInstanceIds);
  const onSearchCompleteRef = useRef(onSearchComplete);
  
  // props 변경시 ref 업데이트
  useEffect(() => {
    excludeIdsRef.current = excludeInstanceIds;
  }, [excludeInstanceIds]);
  
  useEffect(() => {
    onSearchCompleteRef.current = onSearchComplete;
  }, [onSearchComplete]);
  // #endregion

  // #region 인스턴스 타입 옵션
  const instanceTypeOptions: Option[] = useMemo(() => [
    { value: 'GENERAL', label: '일반' },
    { value: 'TEMP', label: '임시' },
    { value: 'COMMERCIAL', label: '상업' },
  ], []);
  // #endregion

  // #region 검색 로직
  const executeSearch = useCallback(async (filters?: Partial<InstanceSearchFilters>) => {
    setIsSearching(true);
    try {
      const searchParams = {
        page: 1,
        limit: 100,
        ...(filters?.address1Depth && { address1Depth: filters.address1Depth }),
        ...(filters?.address2Depth && { address2Depth: filters.address2Depth }),
        ...(filters?.instanceType && { instanceType: filters.instanceType as InstanceType }),
        ...(filters?.instanceName && { instanceName: filters.instanceName }),
      };

      const result = await searchInstances(searchParams);
      
      if (result.success) {
        const instanceData = result.data?.data || [];
        const currentExcludeIds = excludeIdsRef.current;
        const filteredInstances = currentExcludeIds.length > 0 
          ? instanceData.filter(instance => !currentExcludeIds.includes(instance.id))
          : instanceData;
        
        setInstances(filteredInstances);
        onSearchCompleteRef.current?.(filteredInstances);
      } else {
        console.error('인스턴스 검색 실패:', result.errorMsg);
        setInstances([]);
        onSearchCompleteRef.current?.([]);
      }
    } catch (error) {
      console.error('인스턴스 검색 중 오류:', error);
      setInstances([]);
      onSearchCompleteRef.current?.([]);
    } finally {
      setIsSearching(false);
    }
  }, []); // 빈 의존성 배열로 안정화

  // 초기 로드 (마운트 시 한 번만)
  useEffect(() => {
    let mounted = true;
    
    const loadInitialData = async () => {
      if (!mounted) return;
      
      setIsSearching(true);
      try {
        const result = await searchInstances({ page: 1, limit: 100 });
        
        if (result.success && mounted) {
          const instanceData = result.data?.data || [];
          setInstances(instanceData);
        } else if (mounted) {
          setInstances([]);
        }
      } catch (error) {
        if (mounted) {
          console.error('초기 데이터 로드 오류:', error);
          setInstances([]);
        }
      } finally {
        if (mounted) {
          setIsSearching(false);
        }
      }
    };
    
    loadInitialData();
    return () => { mounted = false; };
  }, []); // 완전히 빈 의존성 배열
  // #endregion

  // #region 핸들러
  const handleFilterChange = useCallback((key: keyof InstanceSearchFilters, value: string) => {
    setSearchFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSearch = useCallback(() => {
    const activeFilters = Object.entries(searchFilters).reduce((acc, [key, value]) => {
      if (value && value.trim()) {
        acc[key as keyof InstanceSearchFilters] = value.trim();
      }
      return acc;
    }, {} as Partial<InstanceSearchFilters>);
    
    executeSearch(activeFilters);
  }, [searchFilters, executeSearch]);

  const handleReset = useCallback(() => {
    const resetFilters: InstanceSearchFilters = {
      address1Depth: '',
      address2Depth: '',
      instanceType: '',
      instanceName: '',
    };
    setSearchFilters(resetFilters);
    executeSearch({});
  }, [executeSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);
  // #endregion

  // #region 검색 필드 요소 생성
  const searchFieldElements = useMemo(() => 
    searchFields.filter(field => field.visible).map(field => {
      const commonProps = {
        id: `search-${field.key}`,
        label: field.label.replace(' 검색', ''),
        placeholder: field.placeholder,
        value: searchFilters[field.key] || '',
        onChange: (value: string) => handleFilterChange(field.key, value),
      };

      return {
        key: field.key,
        label: field.label,
        element: field.type === 'select' ? (
          <FieldSelect
            {...commonProps}
            options={field.key === 'instanceType' ? instanceTypeOptions : (field.options || [])}
          />
        ) : (
          <FieldText
            {...commonProps}
            showSearchIcon={true}
            onKeyDown={handleKeyDown}
          />
        ),
        visible: true,
      };
    }), [searchFields, searchFilters, instanceTypeOptions, handleFilterChange, handleKeyDown]
  );
  // #endregion

  // #region 테이블 렌더링
  const renderTable = () => {
    if (instances.length === 0) {
      return (
        <div className="py-8 text-center rounded-lg border text-muted-foreground">
          {isSearching ? '검색 중...' : '검색 결과가 없습니다.'}
        </div>
      );
    }

    const tableProps = {
      data: instances as unknown as Record<string, unknown>[],
      columns: columns as unknown as BaseTableColumn<Record<string, unknown>>[],
      onRowClick: onRowClick ? (item: Record<string, unknown>, index: number) => {
        const instance = item as unknown as Instance;
        onRowClick(instance, index);
      } : undefined,
      getRowClassName: getRowClassName ? (item: Record<string, unknown>) => {
        const instance = item as unknown as Instance;
        return getRowClassName(instance);
      } : undefined,
    };

    if (tableType === 'paginated') {
      return (
        <PaginatedTable
          {...tableProps}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          itemName={itemName}
          minWidth={minWidth}
        />
      );
    }

    return (
      <div className="rounded-lg border">
        <BaseTable
          {...tableProps}
          pageSize={pageSize}
        />
      </div>
    );
  };
  // #endregion

  // #region 컨텐츠 렌더링
  const content = (
    <div className="space-y-6">
      {/* 고급 검색 */}
      <AdvancedSearch
        title="검색 조건"
        fields={searchFieldElements}
        onSearch={handleSearch}
        onReset={handleReset}
        defaultOpen={defaultSearchOpen}
        searchMode={searchMode}
        columns={2}
        statusText={isSearching ? '검색 중...' : undefined}
      />

      {/* 검색 결과 테이블 */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{itemName} 목록</h3>
          <div className="text-sm text-muted-foreground">
            총 {instances.length}개
          </div>
        </div>
        
        {renderTable()}
      </div>
    </div>
  );
  // #endregion

  return showSection ? (
    <SectionPanel 
      title={title}
      subtitle={subtitle}
      icon={<Search size={18} />}
    >
      {content}
    </SectionPanel>
  ) : (
    content
  );
}
