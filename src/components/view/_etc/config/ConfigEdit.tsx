/* 공통 설정 편집 컴포넌트 */
'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ArrowLeft, Save, RotateCcw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

// UI 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';

import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/ui-layout/dialog/Dialog';

// Input 컴포넌트들
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleTextArea } from '@/components/ui/ui-input/simple-input/SimpleTextArea';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';

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
  title: string;
  description: string;
  category: string;
  group: string;
  originalValue: string | number | boolean | object;
}

interface ConfigEditProps {
  /** 설정 카테고리 */
  category: string;
  /** 페이지 제목 */
  title: string;
  /** 뒤로가기 경로 */
  backRoute: string;
  /** 성공 메시지 */
  successMessage: string;
  /** 카테고리 오류 메시지 */
  categoryErrorMessage: string;
}
// #endregion

export default function ConfigEdit({
  category,
  title,
  backRoute,
  successMessage,
  categoryErrorMessage,
}: ConfigEditProps) {
  const router = useRouter();
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
      console.log('설정 로드 시도:', configId);
      
      const result = await getConfigById(configId);
      console.log('설정 로드 결과:', result);
      
      if (result.success && result.data) {
        const config = result.data;
        
        // category 확인 (대소문자 무시)
        if (config.category?.toUpperCase() !== category?.toUpperCase()) {
          setDialogMessage(categoryErrorMessage);
          setErrorDialogOpen(true);
          return;
        }
        
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
          title: config.title || config.key,
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
  }, [configId, rawConfigId, category, categoryErrorMessage]);

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

  // #region 폼 핸들러
  const handleFieldChange = useCallback((field: keyof ConfigFormData, value: string) => {
    if (!formData) return;
    
    setFormData(prev => prev ? {
      ...prev,
      [field]: value
    } : null);
  }, [formData]);

  const handleReset = useCallback(() => {
    if (!hasChanges || !originalData) return;
    
    const confirmMessage = '변경사항이 모두 초기화됩니다. 계속하시겠습니까?';
    if (!confirm(confirmMessage)) return;
    
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
          break;
        case 'JSON':
          try {
            parsedValue = JSON.parse(formData.value);
          } catch {
            setDialogMessage('JSON 형식이 올바르지 않습니다.');
            setErrorDialogOpen(true);
            return;
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
        setDialogMessage(successMessage);
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
  }, [formData, isValid, isSubmitting, configId, loadConfigData, successMessage, configData]);
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

  // #region 렌더링
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full border-b-2 animate-spin border-primary"></div>
          <p className="text-muted-foreground">설정을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <p className="text-muted-foreground">설정을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 페이지 헤더 */}
      <PageHeader
        title={title}
        subtitle={`${formData.title || formData.key} 설정을 편집합니다`}
        leftActions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(backRoute)}
            className="flex gap-2 items-center"
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로
          </Button>
        }
      />

      {/* 편집 폼 */}
      <div className="max-w-2xl">
        <div className="space-y-6">
          {/* 설정 정보 (읽기 전용) */}
          <div className="p-4 space-y-4 rounded-lg bg-muted/30">
            <h3 className="text-sm font-medium text-foreground">설정 정보</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">설정 키:</span>
                <span className="ml-2 font-mono">{formData.key}</span>
              </div>
              <div>
                <span className="text-muted-foreground">타입:</span>
                <span className="px-2 py-1 ml-2 rounded bg-primary/10 text-primary">
                  {formData.type}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">설명:</span>
                <span className="ml-2">{formData.description || '-'}</span>
              </div>
            </div>
          </div>

          {/* 값 편집 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              설정값
              {hasChanges && <span className="ml-1 text-amber-500">*</span>}
            </label>
            {renderValueInput()}
            {formData.type === 'JSON' && (
              <p className="text-xs text-muted-foreground">
                올바른 JSON 형식으로 입력해주세요.
              </p>
            )}
          </div>

          {/* 버튼 그룹 */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={!hasChanges || isSubmitting}
              className="flex gap-2 items-center"
            >
              <RotateCcw className="w-4 h-4" />
              초기화
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className="flex gap-2 items-center"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>
      </div>

      {/* 성공 다이얼로그 */}
      <Dialog isOpen={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
        <DialogHeader>
          <DialogTitle>저장 완료</DialogTitle>
          <DialogDescription>{dialogMessage}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => {
            setSuccessDialogOpen(false);
            router.push(backRoute);
          }}>
            확인
          </Button>
        </DialogFooter>
      </Dialog>

      {/* 오류 다이얼로그 */}
      <Dialog isOpen={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
        <DialogHeader>
          <DialogTitle>오류</DialogTitle>
          <DialogDescription>{dialogMessage}</DialogDescription>
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
