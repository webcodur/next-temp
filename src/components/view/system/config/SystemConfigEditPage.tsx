/* 메뉴 설명: 시스템 설정 편집 */
'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ArrowLeft, Save, RotateCcw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAtom } from 'jotai';

// UI 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/ui-layout/dialog/Dialog';

// Input 컴포넌트들
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleTextArea } from '@/components/ui/ui-input/simple-input/SimpleTextArea';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';

// API 호출
import { getConfigByKey } from '@/services/config/config@key_GET';
import { updateConfig } from '@/services/config/config@key_PUT';

// 타입 정의
import { UpdateSystemConfigRequest } from '@/types/api';
import { currentPageLabelAtom } from '@/store/ui';

// #region 폼 데이터 인터페이스
interface ConfigFormData {
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawConfigKey = searchParams.get('key');
  // URL 파라미터 디코딩
  const configKey = rawConfigKey ? decodeURIComponent(rawConfigKey) : null;
  const [, setCurrentPageLabel] = useAtom(currentPageLabelAtom);

  // #region 페이지 라벨 설정
  useEffect(() => {
    if (configKey) {
      setCurrentPageLabel({
        label: `설정 편집: ${configKey}`,
        href: window.location.pathname,
      });
    }
  }, [configKey, setCurrentPageLabel]);
  // #endregion

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
    if (!configKey || configKey.trim() === '') {
      console.error('설정 키가 없습니다:', { rawConfigKey, configKey });
      setDialogMessage('설정 키가 제공되지 않았습니다.');
      setErrorDialogOpen(true);
      return;
    }

    setLoading(true);
    try {
      console.log('설정 로드 시도:', configKey);
      const result = await getConfigByKey(configKey);
      console.log('설정 로드 결과:', result);
      
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
  }, [configKey, rawConfigKey]);

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
  const handleBack = useCallback(() => {
    if (hasChanges) {
      const confirmMessage = '수정된 내용이 있습니다. 정말로 나가시겠습니까?';
      if (!confirm(confirmMessage)) return;
    }
    router.push('/system/config/settings');
  }, [router, hasChanges]);
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
    
    const confirmMessage = '수정된 내용을 모두 되돌리시겠습니까?';
    if (!confirm(confirmMessage)) return;
    
    setFormData(originalData);
  }, [hasChanges, originalData]);

  const handleSubmit = useCallback(async () => {
    if (!formData || !isValid || isSubmitting || !configKey) return;
    
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

      const result = await updateConfig(configKey, updateData);

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
  }, [formData, isValid, isSubmitting, configKey, loadConfigData]);
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
        leftActions={
          <Button
            variant="secondary"
            size="default"
            onClick={handleBack}
            title="목록으로"
          >
            <ArrowLeft size={16} />
            목록
          </Button>
        }
      />

      {/* 설정 편집 폼 */}
      <div className="p-6 rounded-lg border bg-card border-border">
        <GridForm 
          labelWidth="140px" 
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
        >
          <GridForm.Row>
            <GridForm.Label>설정 키</GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={formData.key}
                disabled={true}
                className="font-mono"
              />
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label>그룹</GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={formData.group}
                disabled={true}
              />
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label>카테고리</GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={formData.category}
                disabled={true}
              />
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label>타입</GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={formData.type}
                disabled={true}
              />
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label>설명</GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={formData.description}
                disabled={true}
              />
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label required>현재 값</GridForm.Label>
            <GridForm.Content>
              {renderValueInput()}
              {formData.type === 'JSON' && (
                <p className="mt-1 text-sm text-muted-foreground">
                  유효한 JSON 형식으로 입력해주세요.
                </p>
              )}
            </GridForm.Content>
          </GridForm.Row>
        </GridForm>
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