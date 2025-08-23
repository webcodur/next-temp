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
import { Button } from '@/components/ui/ui-input/button/Button';

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

export interface DisabledInstance {
  instanceId: number;
  disabledText: string; // "현재 거주지", "이미 연결됨" 등
  disabledClassName?: string; // 추가 스타일링
}

export interface ColumnConfiguration {
  preset?: 'basic' | 'detailed' | 'compact';
  includeColumns?: ('id' | 'dongHosu' | 'name' | 'ownerName' | 'instanceType' | 'residentCount' | 'carCount' | 'memo')[];
  excludeColumns?: ('id' | 'dongHosu' | 'name' | 'ownerName' | 'instanceType' | 'residentCount' | 'carCount' | 'memo')[];
  customColumns?: BaseTableColumn<Instance>[];
  selectColumnConfig?: {
    disabled?: boolean;
    selectedState?: (instance: Instance) => boolean;
    onSelect?: (instance: Instance) => void;
    buttonText?: (instance: Instance) => string;
    isLoading?: boolean;
  };
}

export interface InstanceSearchSectionProps {
  // 검색 관련
  searchFields: InstanceSearchField[];
  initialFilters?: Partial<InstanceSearchFilters>;
  onSearchComplete?: (instances: Instance[]) => void;
  
  // 테이블 관련
  tableType?: 'base' | 'paginated';
  columns?: BaseTableColumn<Instance>[]; // 선택사항으로 변경
  columnConfig?: ColumnConfiguration; // 새로운 컬럼 설정
  onRowClick?: (instance: Instance, index: number) => void;
  getRowClassName?: (instance: Instance) => string;
  pageSize?: number;
  pageSizeOptions?: number[];
  minWidth?: string;
  
  // UI 관련
  title?: string;
  subtitle?: string;
  showSection?: boolean;
  searchMode?: 'client' | 'server';
  itemName?: string;
  
  // 기타
  excludeInstanceIds?: number[]; // 제외할 인스턴스 ID 목록
  disabledInstances?: DisabledInstance[]; // 비활성화할 인스턴스 목록
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
  columnConfig,
  onRowClick,
  getRowClassName,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  minWidth = '800px',
  
  // UI 관련
  title = '세대 검색',
  subtitle = '조건에 맞는 세대를 검색합니다.',
  showSection = true,
  searchMode = 'server',
  itemName = '세대',
  
  // 기타
  excludeInstanceIds = [],
  disabledInstances = [],
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
  const disabledInstancesRef = useRef(disabledInstances);
  const onSearchCompleteRef = useRef(onSearchComplete);
  
  // props 변경시 ref 업데이트
  useEffect(() => {
    excludeIdsRef.current = excludeInstanceIds;
  }, [excludeInstanceIds]);
  
  useEffect(() => {
    disabledInstancesRef.current = disabledInstances;
  }, [disabledInstances]);
  
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

  // #region 비활성화 인스턴스 처리
  const getDisabledInstance = useCallback((instanceId: number): DisabledInstance | undefined => {
    return disabledInstancesRef.current.find(disabled => disabled.instanceId === instanceId);
  }, []);

  const isInstanceDisabled = useCallback((instanceId: number): boolean => {
    return disabledInstancesRef.current.some(disabled => disabled.instanceId === instanceId);
  }, []);
  // #endregion

  // #region 기본 컬럼 생성
  const generateDefaultColumns = useCallback((): BaseTableColumn<Instance>[] => {
    const allColumns: Record<string, BaseTableColumn<Instance>> = {
      id: {
        key: 'id',
        header: 'ID',
        width: '8%',
        align: 'center',
      },
      dongHosu: {
        key: 'dongHosu',
        header: '동호수',
        width: '12%',
        align: 'start',
        cell: (item: Instance) => `${item.address1Depth} ${item.address2Depth}`,
      },
      name: {
        key: 'name',
        header: '세대명',
        width: '12%',
        align: 'start',
        cell: (item: Instance) => item.name || '-',
      },
      ownerName: {
        key: 'ownerName',
        header: '소유자',
        width: '10%',
        align: 'start',
        cell: (item: Instance) => item.ownerName || '-',
      },

      instanceType: {
        key: 'instanceType',
        header: '타입',
        width: '8%',
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
      residentCount: {
        key: 'residentCount',
        header: '주민',
        width: '8%',
        align: 'center',
        cell: (item: Instance) => `${item.residentCount ?? 0}명`,
      },
      carCount: {
        key: 'carCount',
        header: '차량',
        width: '8%',
        align: 'center',
        cell: (item: Instance) => `${item.carCount ?? 0}대`,
      },
      memo: {
        key: 'memo',
        header: '메모',
        width: '15%',
        align: 'start',
        cell: (item: Instance) => item.memo || '-',
      },
    };

    const config = columnConfig || { preset: 'basic' };
    let selectedColumns: BaseTableColumn<Instance>[] = [];

    // 프리셋에 따른 기본 컬럼 선택
    if (config.preset === 'compact') {
      selectedColumns = [allColumns.id, allColumns.dongHosu, allColumns.instanceType];
    } else if (config.preset === 'detailed') {
      selectedColumns = Object.values(allColumns);
    } else { // basic (default)
      selectedColumns = [
        allColumns.id, 
        allColumns.dongHosu, 
        allColumns.name, 
        allColumns.ownerName, 
        allColumns.instanceType
      ];
    }

    // includeColumns/excludeColumns 처리
    if (config.includeColumns) {
      selectedColumns = config.includeColumns.map(key => allColumns[key]).filter(Boolean);
    }

    if (config.excludeColumns) {
      const excludeKeys = config.excludeColumns;
      selectedColumns = selectedColumns.filter(col => {
        const key = col.key;
        return !excludeKeys.some(excludeKey => excludeKey === key);
      });
    }

    // 커스텀 컬럼 추가
    if (config.customColumns) {
      selectedColumns = [...selectedColumns, ...config.customColumns];
    }

    // 선택 컬럼 추가 (설정된 경우)
    if (config.selectColumnConfig && !config.selectColumnConfig.disabled) {
      const selectColumn: BaseTableColumn<Instance> = {
        header: '선택',
        width: '12%',
        align: 'center',
        cell: (item: Instance) => {
          const disabledInstance = getDisabledInstance(item.id);
          const isSelected = config.selectColumnConfig!.selectedState?.(item) || false;
          
          if (disabledInstance) {
            return (
              <div className="flex flex-col gap-1 items-center">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={true}
                  className="opacity-60 cursor-not-allowed"
                >
                  {disabledInstance.disabledText}
                </Button>
              </div>
            );
          }
          
          return (
            <Button
              variant={isSelected ? 'primary' : 'outline'}
              size="sm"
              onClick={() => config.selectColumnConfig!.onSelect?.(item)}
              disabled={config.selectColumnConfig!.isLoading}
            >
              {config.selectColumnConfig!.buttonText?.(item) || (isSelected ? '선택됨' : '선택')}
            </Button>
          );
        },
      };
      selectedColumns.push(selectColumn);
    }

    return selectedColumns;
  }, [columnConfig, getDisabledInstance]);

  const finalColumns = useMemo(() => {
    return columns || generateDefaultColumns();
  }, [columns, generateDefaultColumns]);
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
      columns: finalColumns as unknown as BaseTableColumn<Record<string, unknown>>[],
      onRowClick: onRowClick ? (item: Record<string, unknown>, index: number) => {
        const instance = item as unknown as Instance;
        // 비활성화된 인스턴스는 클릭할 수 없음
        if (isInstanceDisabled(instance.id)) {
          return;
        }
        onRowClick(instance, index);
      } : undefined,
      getRowClassName: (item: Record<string, unknown>) => {
        const instance = item as unknown as Instance;
        const disabledInstance = getDisabledInstance(instance.id);
        let className = '';
        
        if (disabledInstance) {
          // 비활성화된 항목 기본 스타일
          className += 'bg-muted/30 opacity-75';
          // 커스텀 클래스명이 있으면 추가
          if (disabledInstance.disabledClassName) {
            className += ` ${disabledInstance.disabledClassName}`;
          }
        } else if (getRowClassName) {
          // 사용자 정의 스타일 적용
          className = getRowClassName(instance);
        }
        
        return className;
      },
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
        defaultOpen={false}
        searchMode={searchMode}
        columns={2}
        statusText={isSearching ? '검색 중...' : undefined}
      />

      {/* 검색 결과 테이블 */}
      <div className="space-y-3">
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
