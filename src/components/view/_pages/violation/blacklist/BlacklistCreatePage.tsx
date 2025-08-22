/* 메뉴 설명: 블랙리스트 차량 등록 - 새로운 차량을 블랙리스트에 등록 */
'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

// UI 라이브러리 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import { CrudButton } from '@/components/ui/ui-input/crud-button/CrudButton';
import { FlatContainer } from '@/components/ui/ui-layout/neumorphicContainer/Container-Flat';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Modal from '@/components/ui/ui-layout/modal/Modal';

// Simple Input 컴포넌트들
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleTextArea } from '@/components/ui/ui-input/simple-input/SimpleTextArea';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { SimpleNumberInput } from '@/components/ui/ui-input/simple-input/SimpleNumberInput';

// API 호출
import { createManualBlacklist } from '@/services/blacklist/blacklists_manual_POST';

// 타입 정의
import { BlacklistRegistrationReason } from '@/types/blacklist';

// #region 상수 정의
const REGISTRATION_REASON_OPTIONS = [
  { value: 'VIOLATION_ACCUMULATION', label: '위반 누적' },
  { value: 'SERIOUS_VIOLATION', label: '심각한 위반' },
  { value: 'REPEATED_OFFENDER', label: '상습 위반자' },
  { value: 'SECURITY_THREAT', label: '보안 위협' },
  { value: 'CIVIL_COMPLAINT', label: '민원' },
  { value: 'COURT_ORDER', label: '법원 명령' },
  { value: 'ADMIN_DISCRETION', label: '관리자 판단' },
  { value: 'OTHER', label: '기타' },
];
// #endregion

export default function BlacklistCreatePage() {
  const router = useRouter();
  
  // #region 상태 관리
  const [formData, setFormData] = useState({
    carNumber: '',
    registrationReason: '',
    blockDays: '',
    blockReason: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  
  // 다이얼로그 관련 상태
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  // #endregion

  // #region 이벤트 핸들러
  const handleGoBack = useCallback(() => {
    router.push('/parking/violation/blacklist');
  }, [router]);

  const handleFormChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.carNumber.trim() || !formData.registrationReason.trim() || !formData.blockReason.trim() || isCreating) {
      return;
    }
    
    setIsCreating(true);
    
    try {
      const createData = {
        carNumber: formData.carNumber.trim(),
        registrationReason: formData.registrationReason as BlacklistRegistrationReason,
        blockDays: parseInt(formData.blockDays.trim()) || 30,
        blockReason: formData.blockReason.trim(),
      };

      const result = await createManualBlacklist(createData);

      if (result.success) {
        setDialogMessage('블랙리스트가 성공적으로 등록되었습니다.');
        setSuccessDialogOpen(true);
      } else {
        setDialogMessage(`블랙리스트 등록에 실패했습니다: ${result.errorMsg}`);
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('블랙리스트 등록 중 오류:', error);
      setDialogMessage('블랙리스트 등록 중 오류가 발생했습니다.');
      setErrorDialogOpen(true);
    } finally {
      setIsCreating(false);
    }
  }, [formData, isCreating]);

  const handleSuccessConfirm = useCallback(() => {
    setSuccessDialogOpen(false);
    router.push('/parking/violation/blacklist');
  }, [router]);

  const isFormValid = useMemo(() => {
    return formData.carNumber.trim() && formData.registrationReason.trim();
  }, [formData]);
  // #endregion

  return (
    <FlatContainer>
      <PageHeader 
        title="블랙리스트 등록" 
        subtitle="새로운 차량을 블랙리스트에 등록합니다"
      />
      
      {/* 뒤로가기 버튼 */}
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleGoBack}
          icon={ArrowLeft}
        >
          목록으로 돌아가기
        </Button>
      </div>

      {/* 등록 폼 */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SimpleTextInput
            label="차량번호"
            value={formData.carNumber}
            onChange={(value) => handleFormChange('carNumber', value)}
            placeholder="차량번호를 입력하세요"
            validationRule={{ type: 'free', mode: 'create' }}
          />
          
          <SimpleDropdown
            label="등록 사유"
            value={formData.registrationReason}
            onChange={(value) => handleFormChange('registrationReason', value)}
            options={REGISTRATION_REASON_OPTIONS}
            placeholder="등록 사유를 선택하세요"
            validationRule={{ type: 'free', mode: 'create' }}
          />
          
          <SimpleNumberInput
            label="차단 기간 (일)"
            value={formData.blockDays === '' ? '' : parseInt(formData.blockDays)}
            onChange={(value) => handleFormChange('blockDays', value === '' ? '' : value.toString())}
            placeholder="차단 기간을 입력하세요 (기본: 30일)"
            min={1}
            validationRule={{ type: 'free', mode: 'create' }}
          />
        </div>
        
        <SimpleTextArea
          label="차단 사유 *"
          value={formData.blockReason}
          onChange={(value) => handleFormChange('blockReason', value)}
          placeholder="차단 사유를 상세히 입력하세요 (필수)"
          rows={4}
          validationRule={{ type: 'free', mode: 'create' }}
        />

        {/* 등록 버튼 */}
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={handleGoBack}
            disabled={isCreating}
          >
            취소
          </Button>
          <CrudButton
            action="save"
            onClick={handleSubmit}
            disabled={!isFormValid || isCreating}
            loading={isCreating}
          >
            등록
          </CrudButton>
        </div>
      </div>

      {/* 성공 다이얼로그 */}
      <Modal
        isOpen={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        title="등록 완료"
        size="sm"
        onConfirm={handleSuccessConfirm}
      >
        <div className="space-y-4">
          <p className="text-gray-700">{dialogMessage}</p>
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleSuccessConfirm}
            >
              확인
            </Button>
          </div>
        </div>
      </Modal>

      {/* 오류 다이얼로그 */}
      <Modal
        isOpen={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        title="오류"
        size="sm"
        onConfirm={() => setErrorDialogOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-red-600">{dialogMessage}</p>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setErrorDialogOpen(false)}
            >
              확인
            </Button>
          </div>
        </div>
      </Modal>
    </FlatContainer>
  );
}