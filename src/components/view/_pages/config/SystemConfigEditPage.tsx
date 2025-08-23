/* 메뉴 설명: 시스템 설정 편집 */
'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';


// UI 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/ui-layout/dialog/Dialog';

// Input 컴포넌트들
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleTextArea } from '@/components/ui/ui-input/simple-input/SimpleTextArea';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { SimpleNumberInput } from '@/components/ui/ui-input/simple-input/SimpleNumberInput';

// API 호출
import { getConfigById } from '@/services/config/config@id_GET';
import { updateConfigById } from '@/services/config/config@id_PUT';

// 타입 정의
import { UpdateSystemConfigRequest } from '@/types/api';


// #region 폼 데이터 인터페이스
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
// #endregion

export default function SystemConfigEditPage() {
  const searchParams = useSearchParams();
  const rawConfigId = searchParams.get('id');
  const configId = rawConfigId ? parseInt(rawConfigId, 10) : null;

  // #region 상태 관리
  const [configData, setConfigData] = useState<ConfigFormData | null>(null);
  const [formData, setFormData] = useState<ConfigFormData | null>(null);
  const [originalData, setOriginalData] = useState<ConfigFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 다이얼로그 상태
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  // #endregion

  // #region 데이터 로드
  const loadConfigData = useCallback(async () => {
    if (!configId || isNaN(configId)) {
      console.error('설정 ID가 없거나 유효하지 않습니다:', { rawConfigId, configId });
      setDialogMessage('설정 ID가 제공되지 않았거나 유효하지 않습니다.');
      setErrorDialogOpen(true);
      return;
    }

    setLoading(true);
    try {

      
      const result = await getConfigById(configId);

      
      if (result.success && result.data) {
        const config = result.data;
        
        // 값을 문자열로 변환하여 편집 가능하게 만듦
        let valueStr = '';
        if (config.type === 'JSON') {
          valueStr = JSON.stringify(config.value, null, 2);
        } else {
          valueStr = String(config.value);
        }
        
        const configFormData: ConfigFormData = {
          id: config.id,
          key: config.key,
          value: valueStr,
          type: config.type as 'BOOLEAN' | 'INTEGER' | 'STRING' | 'JSON',
          description: config.description || '',
          category: config.category || '',
          group: config.group || '',
          originalValue: config.value,
        };
        
        setConfigData(configFormData);
        setFormData(configFormData);
        setOriginalData(configFormData);
      } else {
        setDialogMessage(`설정을 찾을 수 없습니다: ${result.errorMsg}`);
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('설정 로드 중 오류:', error);
      setDialogMessage('설정 로드 중 오류가 발생했습니다.');
      setErrorDialogOpen(true);
    } finally {
      setLoading(false);
    }
  }, [configId, rawConfigId]);

  useEffect(() => {
    loadConfigData();
  }, [loadConfigData]);
  // #endregion

  // #region 변경 감지
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
  // #endregion

  // #region 네비게이션 핸들러

  // #endregion

  // #region 폼 핸들러
  const handleFieldChange = useCallback((field: keyof ConfigFormData, value: string) => {
    if (!formData) return;
    
    setFormData(prev => prev ? {
      ...prev,
      [field]: value,
    } : null);
  }, [formData]);

  const handleReset = useCallback(() => {
    if (!hasChanges || !originalData) return;
    
    setFormData(originalData);
  }, [hasChanges, originalData]);

  const handleSubmit = useCallback(async () => {
    if (!formData || !isValid || isSubmitting || !configId) return;
    
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

      const result = await updateConfigById(configData!.id, updateData);

      if (result.success) {
        setDialogMessage('설정이 성공적으로 수정되었습니다.');
        setSuccessDialogOpen(true);
        
        // 원본 데이터 업데이트
        const newData = { ...formData };
        setOriginalData(newData);
        
        // 데이터 다시 로드
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
  }, [formData, isValid, isSubmitting, configId, loadConfigData, configData]);
  // #endregion

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
          <SimpleNumberInput
            value={formData.value === '' ? '' : parseInt(formData.value)}
            onChange={(value) => handleFieldChange('value', value === '' ? '' : value.toString())}
            placeholder="숫자를 입력하세요"
            disabled={isSubmitting}
            validationRule={{ type: 'number', mode: 'edit' }}
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
            validationRule={{ type: 'free', mode: 'edit' }}
          />
        );
    }
  }, [formData, isSubmitting, handleFieldChange]);
  // #endregion

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!configData || !formData) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">설정 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title="시스템 설정 편집"
        subtitle={`시스템 설정값을 수정합니다`}
      />

      {/* 설정 편집 폼 */}
      <div className="p-6 rounded-lg border bg-card border-border">
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
                    validationRule={{ type: 'free', mode: 'view' }}
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
                    validationRule={{ type: 'free', mode: 'view' }}
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
                    validationRule={{ type: 'free', mode: 'view' }}
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
                    validationRule={{ type: 'free', mode: 'view' }}
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
                    validationRule={{ type: 'free', mode: 'view' }}
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
                // title="시스템 설정 편집"
                // subtitle="시스템 전체 설정 값을 수정할 수 있습니다."
                gap="20px"
                bottomRightActions={
                  <div className="flex gap-3">
                    <Button 
                      variant="secondary" 
                      size="default"
                      onClick={handleReset} 
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