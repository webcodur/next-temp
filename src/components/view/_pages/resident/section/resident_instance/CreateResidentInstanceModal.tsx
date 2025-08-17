'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Home } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';

import { BaseTable, BaseTableColumn } from '@/components/ui/ui-data/baseTable/BaseTable';
import { searchInstances } from '@/services/instances/instances$_GET';
import { createResidentInstance } from '@/services/residents/residents_instances_POST';
import { Instance, InstanceType } from '@/types/instance';
import { CreateResidentInstanceRequest } from '@/types/resident';
import { Option } from '@/components/ui/ui-input/field/core/types';

interface CreateResidentInstanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  residentId: number;
  residentName: string;
  existingInstanceIds: number[];
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

interface SearchFilters {
  address1Depth: string;
  address2Depth: string;
  instanceType: string;
}

export default function CreateResidentInstanceModal({
  isOpen,
  onClose,
  residentId,
  residentName,
  existingInstanceIds,
  onSuccess,
  onError,
}: CreateResidentInstanceModalProps) {
  // #region 상태 관리
  const [instances, setInstances] = useState<Instance[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null);
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    address1Depth: '',
    address2Depth: '',
    instanceType: '',
  });
  // #endregion

  // #region 인스턴스 타입 옵션
  const instanceTypeOptions: Option[] = useMemo(() => [
    { value: 'GENERAL', label: '일반' },
    { value: 'TEMP', label: '임시' },
    { value: 'COMMERCIAL', label: '상업' },
  ], []);
  // #endregion

  // #region 인스턴스 검색
  const searchInstanceList = useCallback(async () => {
    setIsSearching(true);
    try {
      const searchParams = {
        page: 1,
        limit: 50,
        ...(searchFilters.address1Depth && { address1Depth: searchFilters.address1Depth }),
        ...(searchFilters.address2Depth && { address2Depth: searchFilters.address2Depth }),
        ...(searchFilters.instanceType && { instanceType: searchFilters.instanceType as InstanceType }),
      };

      const result = await searchInstances(searchParams);
      
      if (result.success) {
        setInstances(result.data?.data || []);
      } else {
        console.error('인스턴스 검색 실패:', result.errorMsg);
        setInstances([]);
      }
    } catch (error) {
      console.error('인스턴스 검색 중 오류:', error);
      setInstances([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchFilters]);

  // 초기 로드
  useEffect(() => {
    if (isOpen) {
      searchInstanceList();
    }
  }, [isOpen, searchInstanceList]);
  // #endregion

  // #region 핸들러
  const handleFilterChange = useCallback((key: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSearch = useCallback(() => {
    searchInstanceList();
  }, [searchInstanceList]);

  const handleReset = useCallback(() => {
    const resetFilters = {
      address1Depth: '',
      address2Depth: '',
      instanceType: '',
    };
    setSearchFilters(resetFilters);
    // 리셋만 하고 자동 검색하지 않음
  }, []);

  const handleClose = useCallback(() => {
    setSelectedInstance(null);
    setMemo('');
    setSearchFilters({
      address1Depth: '',
      address2Depth: '',
      instanceType: '',
    });
    onClose();
  }, [onClose]);

  const handleInstanceSelect = useCallback((instance: Instance) => {
    // 이미 연결된 세대은 선택할 수 없음
    if (existingInstanceIds.includes(instance.id)) {
      return;
    }
    setSelectedInstance(instance);
  }, [existingInstanceIds]);

  // 이미 연결된 세대인지 확인
  const isInstanceAlreadyConnected = useCallback((instanceId: number) => {
    return existingInstanceIds.includes(instanceId);
  }, [existingInstanceIds]);

  const handleSubmit = useCallback(async () => {
    if (!selectedInstance) {
      onError('세대을 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData: CreateResidentInstanceRequest = {
        residentId,
        instanceId: selectedInstance.id,
        memo: memo.trim() || undefined,
      };

      const result = await createResidentInstance(requestData);
      
      if (result.success) {
        const address = `${selectedInstance.address1Depth} ${selectedInstance.address2Depth} ${selectedInstance.address3Depth || ''}`.trim();
        onSuccess(`${residentName}님과 ${address} 세대의 관계가 성공적으로 생성되었습니다.`);
        handleClose();
      } else {
        onError(`관계 생성에 실패했습니다: ${result.errorMsg}`);
      }
    } catch (error) {
      console.error('관계 생성 중 오류:', error);
      onError('관계 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedInstance, residentId, residentName, memo, onSuccess, onError, handleClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Enter 키로는 검색하지 않고, 검색 버튼만으로 검색
      e.preventDefault();
    }
  }, []);
  // #endregion

  // #region 검색 필드 구성
  const searchFields = useMemo(() => [
    {
      key: 'address1Depth',
      label: '동 정보 검색',
      element: (
        <FieldText
          id="search-address1"
          label="동 정보"
          placeholder="동 정보 입력"
          value={searchFilters.address1Depth}
          onChange={(value) => handleFilterChange('address1Depth', value)}
          showSearchIcon={true}
          onKeyDown={handleKeyDown}
        />
      ),
      visible: true,
    },
    {
      key: 'address2Depth',
      label: '호수 정보 검색',
      element: (
        <FieldText
          id="search-address2"
          label="호수 정보"
          placeholder="호수 정보 입력"
          value={searchFilters.address2Depth}
          onChange={(value) => handleFilterChange('address2Depth', value)}
          showSearchIcon={true}
          onKeyDown={handleKeyDown}
        />
      ),
      visible: true,
    },
    {
      key: 'instanceType',
      label: '세대 타입 검색',
      element: (
        <FieldSelect
          id="search-type"
          label="세대 타입"
          placeholder="타입 선택"
          options={instanceTypeOptions}
          value={searchFilters.instanceType}
          onChange={(value) => handleFilterChange('instanceType', value)}
        />
      ),
      visible: true,
    },
  ], [searchFilters, instanceTypeOptions, handleFilterChange, handleKeyDown]);
  // #endregion

  // #region 테이블 컬럼 정의
  const columns: BaseTableColumn<Instance>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '8%',
      align: 'center',
    },
    {
      key: 'address',
      header: '주소',
      width: '35%',
      align: 'start',
      cell: (item: Instance) => {
        const address = `${item.address1Depth} ${item.address2Depth} ${item.address3Depth || ''}`.trim();
        return address;
      },
    },
    {
      key: 'instanceType',
      header: '타입',
      width: '12%',
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
    {
      key: 'memo',
      header: '메모',
      width: '25%',
      align: 'start',
      cell: (item: Instance) => item.memo || '-',
    },
    {
      header: '선택',
      width: '12%',
      align: 'center',
      cell: (item: Instance) => {
        const isAlreadyConnected = isInstanceAlreadyConnected(item.id);
        const isSelected = selectedInstance?.id === item.id;
        
        if (isAlreadyConnected) {
          return (
            <div className="flex flex-col gap-1 items-center">
              <Button
                variant="secondary"
                size="sm"
                disabled={true}
                className="opacity-60 cursor-not-allowed"
              >
                이미 연결됨
              </Button>
            </div>
          );
        }
        
        return (
          <Button
            variant={isSelected ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleInstanceSelect(item)}
          >
            {isSelected ? '선택됨' : '선택'}
          </Button>
        );
      },
    },
  ];
  // #endregion

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`입주민(${residentName}) 세대 연결`}
      size="xl"
    >
      <div className="space-y-6">
        {/* 고급 검색 */}
        <AdvancedSearch
          title="세대 검색"
          fields={searchFields}
          onSearch={handleSearch}
          onReset={handleReset}
          defaultOpen={true}
          searchMode="server"
          columns={3}
          statusText={isSearching ? '검색 중...' : undefined}
        />

        {/* 세대 목록 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">세대 목록</h3>
          </div>
          
          {instances.length > 0 ? (
            <div className="rounded-lg border">
              <BaseTable
                data={instances as unknown as Record<string, unknown>[]}
                columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
                pageSize={10}
                getRowClassName={(item: Record<string, unknown>) => {
                  const instance = item as unknown as Instance;
                  const isAlreadyConnected = isInstanceAlreadyConnected(instance.id);
                  return isAlreadyConnected ? 'bg-muted/30 opacity-75' : '';
                }}
              />
            </div>
          ) : (
            <div className="py-8 text-center rounded-lg border text-muted-foreground">
              {isSearching ? '검색 중...' : '검색 결과가 없습니다.'}
            </div>
          )}
        </div>

        {/* 선택된 세대 정보 */}
        <div className={`p-4 rounded-lg border transition-all duration-200 ${
          selectedInstance 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-muted/30 border-muted-foreground/20'
        }`}>
          <div className="flex gap-2 items-center mb-2">
            <Home size={16} className={selectedInstance ? 'text-blue-600' : 'text-muted-foreground'} />
            <span className={`font-medium ${selectedInstance ? 'text-blue-800' : 'text-muted-foreground'}`}>
              선택된 세대
            </span>
          </div>
          {selectedInstance ? (
            <p className="text-sm text-blue-700">
              {selectedInstance.address1Depth} {selectedInstance.address2Depth} {selectedInstance.address3Depth || ''}
              <span className="px-2 py-1 ml-2 text-xs bg-blue-100 rounded">
                {instanceTypeOptions.find(opt => opt.value === selectedInstance.instanceType)?.label}
              </span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              위 목록에서 세대을 선택해주세요
            </p>
          )}
        </div>

        {/* 메모 입력 */}
        <div className="space-y-2">
          <label htmlFor="memo" className="block text-sm font-medium text-foreground">
            메모 (선택사항)
          </label>
          <textarea
            id="memo"
            placeholder="관계에 대한 추가 정보를 입력하세요"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={3}
            className="px-3 py-2 w-full text-sm rounded-md border resize-none border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedInstance || isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? '생성 중...' : '관계 생성'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
