/* 공통 설정 관리 컴포넌트 */
'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Save, RotateCcw } from 'lucide-react';

// UI 컴포넌트
import { BaseTable, BaseTableColumn } from '@/components/ui/ui-data/baseTable/BaseTable';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { Button } from '@/components/ui/ui-input/button/Button';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/ui-layout/dialog/Dialog';

// Field 컴포넌트들
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';

// Input 컴포넌트들
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleTextArea } from '@/components/ui/ui-input/simple-input/SimpleTextArea';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';

// API 호출
import { searchConfigs } from '@/services/config/config$_GET';
import { getConfigById } from '@/services/config/config@id_GET';
import { updateConfigById } from '@/services/config/config@id_PUT';

// 타입 정의
import { SystemConfig, UpdateSystemConfigRequest } from '@/types/api';

import { Option } from '@/components/ui/ui-input/field/core/types';

// #region 타입 정의
interface SearchFilters {
  key: string;
  type: string;
  description: string;
}

interface ConfigFormData {
  id: number;
  key: string;
  value: string;
  type: 'BOOLEAN' | 'INTEGER' | 'STRING' | 'JSON';
  description: string;
  category: string;
  group: string;
  originalValue: string | number | boolean | object;
}

interface ConfigManagementProps {
  /** 설정 카테고리 */
  category: string;
  /** 페이지 제목 */
  title: string;
  /** 페이지 설명 */
  subtitle: string;
  /** 성공 메시지 */
  successMessage: string;
  /** 카테고리 오류 메시지 */
  categoryErrorMessage: string;
}
// #endregion

export default function ConfigManagement({
  category,
  title,
  subtitle,
  successMessage,
  categoryErrorMessage,
}: ConfigManagementProps) {
  // #region 상태 관리
  const [allConfigs, setAllConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 검색 필터 상태
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    key: '',
    type: '',
    description: '',
  });

  // 편집 모달 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<SystemConfig | null>(null);
  const [formData, setFormData] = useState<ConfigFormData | null>(null);
  const [originalData, setOriginalData] = useState<ConfigFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 다이얼로그 상태
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  // #endregion

  // #region 데이터 로드
  const loadConfigData = useCallback(async () => {
    setLoading(true);
    try {
      // API에서 해당 category로 필터링하여 가져오기
      const result = await searchConfigs({ category });
      
      if (result.success && result.data) {
        setAllConfigs(result.data);
      } else {
        console.error(`${category} 설정 로드 실패:`, result.errorMsg);
        setAllConfigs([]);
      }
    } catch (error) {
      console.error(`${category} 설정 로드 중 오류:`, error);
      setAllConfigs([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadConfigData();
  }, [loadConfigData]);
  // #endregion

  // #region 현재 표시할 설정들
  const currentConfigs = useMemo(() => {
    let configs = [...allConfigs];
    
    // 검색 필터링
    if (searchFilters.key.trim()) {
      configs = configs.filter(config =>
        config.key.toLowerCase().includes(searchFilters.key.toLowerCase())
      );
    }
    
    if (searchFilters.type.trim()) {
      configs = configs.filter(config =>
        config.type === searchFilters.type
      );
    }
    
    if (searchFilters.description.trim()) {
      configs = configs.filter(config =>
        config.description?.toLowerCase().includes(searchFilters.description.toLowerCase())
      );
    }
    
    return configs;
  }, [allConfigs, searchFilters]);
  // #endregion

  // #region 편집 모달 관련 함수
  const openEditModal = useCallback(async (config: SystemConfig) => {
    setSelectedConfig(config);
    setIsEditModalOpen(true);
    
    try {
      const result = await getConfigById(config.id);
      
      if (result.success && result.data) {
        const configData = result.data;
        
        // category 확인 (대소문자 무시)
        if (configData.category?.toUpperCase() !== category?.toUpperCase()) {
          setDialogMessage(categoryErrorMessage);
          setErrorDialogOpen(true);
          setIsEditModalOpen(false);
          return;
        }
        
        // 값을 문자열로 변환하여 편집 가능하게 만듦
        let valueStr = '';
        if (configData.type === 'JSON') {
          valueStr = JSON.stringify(configData.value, null, 2);
        } else {
          valueStr = String(configData.value);
        }
        
        const configFormData: ConfigFormData = {
          id: configData.id,
          key: configData.key,
          value: valueStr,
          type: configData.type as 'BOOLEAN' | 'INTEGER' | 'STRING' | 'JSON',
          description: configData.description || '',
          category: configData.category || '',
          group: configData.group || '',
          originalValue: configData.value,
        };
        
        setFormData(configFormData);
        setOriginalData(configFormData);
      } else {
        setDialogMessage(`설정을 찾을 수 없습니다: ${result.errorMsg}`);
        setErrorDialogOpen(true);
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error('설정 로드 중 오류:', error);
      setDialogMessage('설정 로드 중 오류가 발생했습니다.');
      setErrorDialogOpen(true);
      setIsEditModalOpen(false);
    }
  }, [category, categoryErrorMessage]);

  const closeEditModal = useCallback(() => {
    const hasChanges = formData && originalData && formData.value !== originalData.value;
    
    if (hasChanges) {
      const confirmMessage = '수정된 내용이 있습니다. 정말로 닫으시겠습니까?';
      if (!confirm(confirmMessage)) return;
    }
    
    setIsEditModalOpen(false);
    setSelectedConfig(null);
    setFormData(null);
    setOriginalData(null);
  }, [formData, originalData]);

  // #region 이벤트 핸들러
  const handleRowClick = useCallback((config: SystemConfig) => {
    openEditModal(config);
  }, [openEditModal]);

  // 검색 관련 핸들러
  const handleSearchReset = useCallback(() => {
    const resetFilters = {
      key: '',
      type: '',
      description: '',
    };
    setSearchFilters(resetFilters);
  }, []);

  const updateFilter = useCallback((field: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // 편집 폼 핸들러
  const handleFieldChange = useCallback((field: keyof ConfigFormData, value: string) => {
    if (!formData) return;
    
    setFormData(prev => prev ? {
      ...prev,
      [field]: value,
    } : null);
  }, [formData]);

  const handleFormReset = useCallback(() => {
    if (!originalData) return;
    setFormData(originalData);
  }, [originalData]);

  const handleSubmit = useCallback(async () => {
    if (!formData || !selectedConfig || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // 타입에 따라 값 변환
      let parsedValue: string | number | boolean | object = formData.value;
      
      switch (formData.type) {
        case 'BOOLEAN':
          parsedValue = formData.value === 'true';
          break;
        case 'INTEGER':
          parsedValue = parseInt(formData.value, 10);
          if (isNaN(parsedValue as number)) {
            throw new Error('유효하지 않은 숫자입니다.');
          }
          break;
        case 'JSON':
          try {
            parsedValue = JSON.parse(formData.value);
          } catch {
            throw new Error('유효하지 않은 JSON 형식입니다.');
          }
          break;
        case 'STRING':
        default:
          parsedValue = formData.value;
          break;
      }

      const updateData: UpdateSystemConfigRequest = {
        value: parsedValue,
      };

      const result = await updateConfigById(selectedConfig.id, updateData);

      if (result.success) {
        setDialogMessage(successMessage);
        setSuccessDialogOpen(true);
        setIsEditModalOpen(false);
        
        // 원본 데이터 업데이트
        const newData = { ...formData };
        setOriginalData(newData);
        
        // 목록 데이터 다시 로드
        await loadConfigData();
      } else {
        setDialogMessage(`설정 수정에 실패했습니다: ${result.errorMsg}`);
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('설정 수정 중 오류:', error);
      setDialogMessage(error instanceof Error ? error.message : '설정 수정 중 오류가 발생했습니다.');
      setErrorDialogOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedConfig, isSubmitting, loadConfigData, successMessage]);

  // #region 변경 감지 및 검증
  const hasChanges = useMemo(() => {
    if (!formData || !originalData) return false;
    return formData.value !== originalData.value;
  }, [formData, originalData]);

  const isValid = useMemo(() => {
    if (!formData || !hasChanges) return false;
    
    if (formData.type === 'JSON') {
      try {
        JSON.parse(formData.value);
        return true;
      } catch {
        return false;
      }
    }
    
    return formData.value.trim() !== '';
  }, [formData, hasChanges]);

  // #region 값 입력 컴포넌트 렌더링
  const renderValueInput = useCallback(() => {
    if (!formData) return null;

    switch (formData.type) {
      case 'BOOLEAN':
        return (
          <SimpleDropdown
            value={formData.value}
            onChange={(value) => handleFieldChange('value', value)}
            options={[
              { value: 'true', label: 'True (참)' },
              { value: 'false', label: 'False (거짓)' },
            ]}
            placeholder="값을 선택하세요"
            disabled={isSubmitting}
          />
        );

      case 'INTEGER':
        return (
          <SimpleTextInput
            type="number"
            value={formData.value}
            onChange={(value) => handleFieldChange('value', value)}
            placeholder="숫자를 입력하세요"
            disabled={isSubmitting}
          />
        );

      case 'JSON':
        return (
          <SimpleTextArea
            value={formData.value}
            onChange={(value) => handleFieldChange('value', value)}
            placeholder="JSON 형식으로 입력하세요"
            disabled={isSubmitting}
            rows={8}
            className="font-mono text-sm"
          />
        );

      case 'STRING':
      default:
        return (
          <SimpleTextInput
            value={formData.value}
            onChange={(value) => handleFieldChange('value', value)}
            placeholder="값을 입력하세요"
            disabled={isSubmitting}
          />
        );
    }
  }, [formData, isSubmitting, handleFieldChange]);
  // #endregion

  // #region 테이블 컬럼 정의
  const columns: BaseTableColumn<SystemConfig>[] = [
    {
      key: 'index',
      header: '순번',
      align: 'center',
      width: '5%',
      cell: (item: SystemConfig, index: number) => (
        <span className="text-xs text-foreground">
          {index + 1}
        </span>
      ),
    },
    {
      key: 'title',
      header: '제목',
      align: 'start',
      width: '16%',
      cell: (item: SystemConfig) => (
        <span className="text-sm font-medium text-foreground">
          {item.title || item.key}
        </span>
      ),
    },
    {
      key: 'description',
      header: '설명',
      align: 'start',
      width: '28%',
      cell: (item: SystemConfig) => (
        <span className="text-sm text-muted-foreground">
          {item.description || '-'}
        </span>
      ),
    },
    {
      key: 'type',
      header: '타입',
      align: 'center',
      width: '12%',
      cell: (item: SystemConfig) => (
        <span className="px-2 py-1 text-xs rounded bg-muted text-foreground">
          {item.type}
        </span>
      ),
    },
    {
      key: 'value',
      header: '값',
      align: 'start',
      width: '10%',
      cell: (item: SystemConfig) => {
        const displayValue = typeof item.value === 'object' 
          ? JSON.stringify(item.value) 
          : String(item.value);
        
        return (
          <span className="font-mono text-sm truncate max-w-[120px]" title={displayValue}>
            {displayValue}
          </span>
        );
      },
    },
    {
      key: 'isActive',
      header: '상태',
      align: 'center',
      width: '8%',
      cell: (item: SystemConfig) => (
        <span 
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            item.isActive 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          {item.isActive ? '활성' : '비활성'}
        </span>
      ),
    },
    {
      key: 'updatedAt',
      header: '수정일시',
      align: 'center',
      width: '10%',
      cell: (item: SystemConfig) => {
        if (!item.updatedAt) return <span className="text-muted-foreground">-</span>;
        
        const date = new Date(item.updatedAt);
        const formattedDate = date.toLocaleDateString('ko-KR', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
        });
        const formattedTime = date.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        });
        
        return (
          <div className="text-xs text-muted-foreground">
            <div>{formattedDate}</div>
            <div>{formattedTime}</div>
          </div>
        );
      },
    },
  ];
  // #endregion

  // #region 타입 옵션 생성
  const typeOptions: Option[] = useMemo(() => {
    const types = [...new Set(allConfigs.map(config => config.type))];
    return types.map(type => ({
      value: type,
      label: type,
    }));
  }, [allConfigs]);
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
      label: '타입 필터',
      element: (
        <FieldSelect
          id="search-type"
          label="타입"
          placeholder="타입을 선택하세요"
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

  // Advanced Search 컴포넌트 생성
  const advancedSearchContent = useMemo(() => (
    <AdvancedSearch
      fields={searchFields}
      onReset={handleSearchReset}
      defaultOpen={false}
      searchMode="client"
    />
  ), [searchFields, handleSearchReset]);
  // #endregion

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">{title} 설정을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title={title}
        subtitle={subtitle}
      />

      {/* 고급 검색 */}
      <div className="rounded-lg border bg-background border-border">
        {advancedSearchContent}
      </div>

      {/* 설정 목록 테이블 */}
      <BaseTable
        data={currentConfigs as unknown as Record<string, unknown>[]}
        columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
        onRowClick={(item) => handleRowClick(item as unknown as SystemConfig)}
      />

      {/* 편집 모달 */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title={`설정 편집: ${selectedConfig?.key || ''}`}
        size="lg"
      >
        {formData && (
          <div className="p-6">
            {(() => {
                const fields: GridFormFieldSchema[] = [
                  {
                    id: 'key',
                    label: '설정 키',
                    rules: '시스템 자동 생성',
                    component: (
                      <SimpleTextInput
                        value={formData.key}
                        disabled={true}
                        className="font-mono"
                      />
                    )
                  },
                  {
                    id: 'group',
                    label: '그룹',
                    rules: '설정 그룹 분류',
                    component: (
                      <SimpleTextInput
                        value={formData.group}
                        disabled={true}
                      />
                    )
                  },
                  {
                    id: 'category',
                    label: '카테고리',
                    rules: '설정 카테고리 분류',
                    component: (
                      <SimpleTextInput
                        value={formData.category}
                        disabled={true}
                      />
                    )
                  },
                  {
                    id: 'type',
                    label: '타입',
                    rules: 'BOOLEAN/INTEGER/STRING/JSON',
                    component: (
                      <SimpleTextInput
                        value={formData.type}
                        disabled={true}
                      />
                    )
                  },
                  {
                    id: 'description',
                    label: '설명',
                    rules: '설정 항목 설명',
                    component: (
                      <SimpleTextInput
                        value={formData.description}
                        disabled={true}
                      />
                    )
                  },
                  {
                    id: 'currentValue',
                    label: '현재 값',
                    required: true,
                    rules: '타입에 따른 유효값',
                    component: (
                      <div>
                        {renderValueInput()}
                        {formData.type === 'JSON' && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            유효한 JSON 형식으로 입력해주세요.
                          </p>
                        )}
                      </div>
                    )
                  }
                ];

                return (
                  <GridFormAuto 
                    fields={fields}
                    gap="20px"
                    bottomRightActions={
                      <div className="flex gap-3">
                        <Button 
                          variant="secondary" 
                          size="default"
                          onClick={handleFormReset} 
                          disabled={!hasChanges || isSubmitting}
                          title={!hasChanges ? '변경사항이 없습니다' : '변경사항 되돌리기'}
                        >
                          <RotateCcw size={16} />
                          복구
                        </Button>
                        <Button 
                          variant="primary" 
                          size="default"
                          onClick={handleSubmit} 
                          disabled={!isValid || isSubmitting}
                          title={isSubmitting ? '저장 중...' : !isValid ? '올바른 값을 입력해주세요' : '변경사항 저장'}
                        >
                          <Save size={16} />
                          {isSubmitting ? '저장 중...' : '저장'}
                        </Button>
                      </div>
                    }
                  />
                );
              })()}
          </div>
        )}
      </Modal>

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
}