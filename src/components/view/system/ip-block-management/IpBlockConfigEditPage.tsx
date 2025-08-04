/* 메뉴 설명: IP 차단 설정 수정 */
'use client';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ArrowLeft, Save, Lock, Unlock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';

// UI 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/ui-layout/dialog/Dialog';

// Field 컴포넌트들
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';

// API 호출
import { getConfigByKey } from '@/services/config/config@key_GET';
import { updateConfig } from '@/services/config/config@key_PUT';

// 타입 정의
import { UpdateSystemConfigRequest } from '@/types/api';

// 스토어
import { currentPageLabelAtom } from '@/store/ui';

// #region 폼 데이터 인터페이스
interface ConfigFormData {
  key: string;
  value: string;
  type: 'BOOLEAN' | 'INTEGER' | 'STRING' | 'JSON';
  description: string;
  originalValue: string | number | boolean | object;
}
// #endregion

// #region Props 인터페이스
interface IpBlockConfigEditPageProps {
  configKey: string;
}
// #endregion

export default function IpBlockConfigEditPage({ configKey }: IpBlockConfigEditPageProps) {
  const router = useRouter();
  const [, setCurrentPageLabel] = useAtom(currentPageLabelAtom);
  
  // #region 상태 관리
  const [configData, setConfigData] = useState<ConfigFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ConfigFormData>({
    key: '',
    value: '',
    type: 'STRING',
    description: '',
    originalValue: '',
  });
  const [originalData, setOriginalData] = useState<ConfigFormData>({
    key: '',
    value: '',
    type: 'STRING',
    description: '',
    originalValue: '',
  });
  
  // 알림 다이얼로그 상태
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  // #endregion

  // #region 타입 옵션
  const typeOptions = [
    { value: 'STRING', label: '문자열' },
    { value: 'INTEGER', label: '숫자' },
    { value: 'BOOLEAN', label: '불린' },
    { value: 'JSON', label: 'JSON' },
  ];
  // #endregion

  // #region 페이지 라벨 설정
  useEffect(() => {
    setCurrentPageLabel({
      label: '설정 수정',
      href: window.location.pathname,
    });
  }, [setCurrentPageLabel]);

  // 데이터 로드 후 구체적 정보로 업데이트
  useEffect(() => {
    if (configData?.key) {
      setCurrentPageLabel({
        label: `${configData.key} 설정`,
        href: window.location.pathname,
      });
    }
  }, [configData?.key, setCurrentPageLabel]);
  // #endregion

  // #region 데이터 로드
  const loadConfigData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getConfigByKey(configKey);
      
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
          type: config.type,
          description: config.description || '',
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
  }, [configKey]);

  useEffect(() => {
    loadConfigData();
  }, [loadConfigData]);
  // #endregion

  // #region 변경 감지
  const hasChanges = useMemo(() => {
    if (!isEditMode) return false;
    
    return (
      formData.value !== originalData.value ||
      formData.description !== originalData.description
    );
  }, [formData, originalData, isEditMode]);

  const isValid = useMemo(() => {
    if (!isEditMode || !hasChanges) return false;
    
    return formData.value.trim() !== '';
  }, [formData, isEditMode, hasChanges]);
  // #endregion

  // #region 네비게이션 핸들러
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleGoToList = useCallback(() => {
    router.push('/system/ip-block-management/config');
  }, [router]);
  // #endregion

  // #region 편집 모드 핸들러
  const handleLockToggle = useCallback(() => {
    if (isEditMode && hasChanges) {
      const confirmMessage = '편집 중인 내용이 있습니다. 정말로 취소하시겠습니까?';
      if (!confirm(confirmMessage)) return;
    }
    
    setIsEditMode(!isEditMode);
    
    // 편집 모드 해제 시 원래 데이터로 복원
    if (isEditMode) {
      setFormData(originalData);
    }
  }, [isEditMode, hasChanges, originalData]);
  // #endregion

  // #region 폼 핸들러
  const handleFormChange = useCallback((field: keyof ConfigFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!configData || !isValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 타입에 따라 값 변환
      let convertedValue: string | number | boolean | object = formData.value;
      
      switch (formData.type) {
        case 'INTEGER':
          convertedValue = parseFloat(formData.value);
          if (isNaN(convertedValue)) {
            throw new Error('유효한 숫자를 입력해주세요.');
          }
          break;
        case 'BOOLEAN':
          convertedValue = formData.value.toLowerCase() === 'true';
          break;
        case 'JSON':
          try {
            convertedValue = JSON.parse(formData.value);
          } catch {
            throw new Error('유효한 JSON 형식을 입력해주세요.');
          }
          break;
        default:
          convertedValue = formData.value;
      }

      const updateData: UpdateSystemConfigRequest = {
        value: convertedValue,
      };

      const result = await updateConfig(formData.key, updateData);

      if (result.success) {
        // 성공 시 원본 데이터 업데이트 및 편집 모드 해제
        const newData = { ...formData };
        setOriginalData(newData);
        setFormData(newData);
        setIsEditMode(false);
        
        // 데이터 다시 로드
        await loadConfigData();
        
        setDialogMessage('설정이 성공적으로 수정되었습니다.');
        setSuccessDialogOpen(true);
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
  }, [configData, isValid, isSubmitting, formData, loadConfigData]);
  // #endregion

  // #region 로딩 상태
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">설정 정보를 불러오고 있습니다...</div>
      </div>
    );
  }

  if (!configData) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader 
          title="IP 차단 설정 상세"
          subtitle="설정을 찾을 수 없습니다"
          leftActions={
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              title="뒤로 가기"
            >
              <ArrowLeft size={16} />
            </Button>
          }
        />
        <div className="flex justify-center items-center py-12">
          <div className="text-destructive">요청하신 설정을 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }
  // #endregion

  // #region 렌더링
  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title="IP 차단 설정 상세"
        subtitle={`${configData.key} (${configData.type})`}
        leftActions={
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            title="뒤로 가기"
          >
            <ArrowLeft size={16} />
          </Button>
        }
        rightActions={
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLockToggle}
            disabled={isSubmitting}
            title={isEditMode ? "편집 모드 해제" : "편집 모드 활성화"}
          >
            {isEditMode ? <Unlock size={16} /> : <Lock size={16} />}
          </Button>
        }
      />

      {/* 설정 상세 정보 섹션 */}
      <div className="p-6 rounded-lg border bg-card border-border">
        <GridForm labelWidth="150px" gap="24px">
          <GridForm.Row>
            <GridForm.Label>설정 키</GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={formData.key}
                onChange={() => {}}
                disabled={true}
              />
              <GridForm.Feedback type="info">
                설정 키는 수정할 수 없습니다.
              </GridForm.Feedback>
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label>데이터 타입</GridForm.Label>
            <GridForm.Content>
              <SimpleDropdown
                value={formData.type}
                onChange={() => {}}
                options={typeOptions}
                disabled={true}
              />
              <GridForm.Feedback type="info">
                데이터 타입은 수정할 수 없습니다.
              </GridForm.Feedback>
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label required>설정 값</GridForm.Label>
            <GridForm.Content>
              {formData.type === 'JSON' ? (
                <div className="space-y-2">
                  <textarea
                    value={formData.value}
                    onChange={(e) => handleFormChange('value', e.target.value)}
                    placeholder='{"key": "value", "number": 123}'
                    disabled={!isEditMode || isSubmitting}
                    rows={8}
                    className="p-3 w-full font-mono text-sm rounded-md border border-border resize-vertical focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted disabled:cursor-not-allowed"
                  />
                  <GridForm.Feedback type="warning">
                    유효한 JSON 형식으로 입력해주세요.
                  </GridForm.Feedback>
                </div>
              ) : (
                <div className="space-y-2">
                  <SimpleTextInput
                    value={formData.value}
                    onChange={(value) => handleFormChange('value', value)}
                    placeholder={
                      formData.type === 'INTEGER' ? '숫자를 입력하세요 (예: 100)' :
                      formData.type === 'BOOLEAN' ? 'true 또는 false를 입력하세요' :
                      '값을 입력하세요'
                    }
                    disabled={!isEditMode || isSubmitting}
                  />
                  {formData.type === 'BOOLEAN' && (
                    <GridForm.Feedback type="info">
                      불린 값은 &apos;true&apos; 또는 &apos;false&apos;로 입력해주세요.
                    </GridForm.Feedback>
                  )}
                  {formData.type === 'INTEGER' && (
                    <GridForm.Feedback type="info">
                      숫자 값은 정수 또는 소수점 형태로 입력 가능합니다.
                    </GridForm.Feedback>
                  )}
                </div>
              )}
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label>설명</GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={formData.description}
                onChange={(value) => handleFormChange('description', value)}
                placeholder="설정에 대한 설명을 입력하세요"
                disabled={!isEditMode || isSubmitting}
              />
              <GridForm.Feedback type="info">
                다른 관리자가 이해할 수 있도록 명확한 설명을 작성해주세요.
              </GridForm.Feedback>
            </GridForm.Content>
          </GridForm.Row>
        </GridForm>
      </div>

      {/* 저장 버튼 - 우하단 고정 */}
      {isEditMode && hasChanges && (
        <div className="fixed right-6 bottom-6 z-50">
          <Button 
            variant="primary" 
            size="lg"
            onClick={handleSave} 
            disabled={!isValid || isSubmitting}
            title={isSubmitting ? '저장 중...' : '저장'}
            className="shadow-lg"
          >
            <Save size={20} />
          </Button>
        </div>
      )}

      {/* 성공 다이얼로그 */}
      <Dialog
        isOpen={successDialogOpen}
        onClose={handleGoToList}
        variant="primary"
        title="수정 완료"
      >
        <DialogHeader>
          <DialogTitle>성공</DialogTitle>
          <DialogDescription>
            {dialogMessage}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button onClick={handleGoToList}>
            목록으로 이동
          </Button>
        </DialogFooter>
      </Dialog>

      {/* 오류 다이얼로그 */}
      <Dialog
        isOpen={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        variant="destructive"
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