/* 메뉴 설명: 블랙리스트 차량 상세 및 수정 - 블랙리스트 항목 상세 조회 및 수정 */
'use client';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Unlock } from 'lucide-react';

// UI 라이브러리 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import { FlatContainer } from '@/components/ui/ui-layout/neumorphicContainer/FlatContainer';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Modal from '@/components/ui/ui-layout/modal/Modal';

// Field 컴포넌트들
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';
import FieldDatePicker from '@/components/ui/ui-input/field/datepicker/FieldDatePicker';

// API 호출
import { searchBlacklists } from '@/services/blacklist/blacklists$_GET';
import { updateBlacklist } from '@/services/blacklist/blacklists@id_PUT';
import { unblockBlacklist } from '@/services/blacklist/blacklists@id_unblock_PATCH';

// 타입 정의
import { BlacklistResponse, BlacklistRegistrationReason } from '@/types/blacklist';
import { Option } from '@/components/ui/ui-input/field/core/types';

// #region 상수 정의
const REGISTRATION_REASON_OPTIONS: Option[] = [
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

interface Props {
  id: number;
}

export default function BlacklistDetailPage({ id }: Props) {
  const router = useRouter();
  
  // #region 상태 관리
  const [blacklistData, setBlacklistData] = useState<BlacklistResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    registrationReason: '',
    blockedUntil: null as Date | null,
    description: '',
    unblockReason: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  
  // 다이얼로그 관련 상태
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [unblockConfirmOpen, setUnblockConfirmOpen] = useState(false);
  const [unblockReason, setUnblockReason] = useState('');
  // #endregion

  // #region 데이터 로드
  const loadBlacklistData = useCallback(async () => {
    setIsLoading(true);
    try {
      // ID로 특정 블랙리스트 항목을 검색
      const result = await searchBlacklists({ page: 1, limit: 100 });
      
      if (result.success && result.data) {
        const foundItem = result.data.data.find(item => item.id === id);
        if (foundItem) {
          setBlacklistData(foundItem);
          setFormData({
            registrationReason: foundItem.registrationReason,
            blockedUntil: foundItem.expiresAt ? new Date(foundItem.expiresAt) : null,
            description: foundItem.description || '',
            unblockReason: foundItem.unblockReason || '',
          });
        } else {
          setDialogMessage('해당 블랙리스트 항목을 찾을 수 없습니다.');
          setErrorDialogOpen(true);
        }
      } else {
        setDialogMessage('블랙리스트 데이터를 불러오는데 실패했습니다.');
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('블랙리스트 데이터 로드 중 오류:', error);
      setDialogMessage('데이터를 불러오는 중 오류가 발생했습니다.');
      setErrorDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadBlacklistData();
  }, [loadBlacklistData]);
  // #endregion

  // #region 이벤트 핸들러
  const handleGoBack = useCallback(() => {
    router.push('/parking/violation/blacklist');
  }, [router]);

  const handleFormChange = useCallback((field: string, value: string | Date | null) => {
    console.log(`Field: ${field}, Value:`, value, `Type:`, typeof value);
    
    // blockedUntil 필드인 경우 Date 객체 변환 시도
    if (field === 'blockedUntil' && value && !(value instanceof Date)) {
      const dateValue = new Date(value as string | number);
      if (!isNaN(dateValue.getTime())) {
        value = dateValue;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleUpdate = useCallback(async () => {
    if (!blacklistData || !formData.registrationReason.trim() || !formData.blockedUntil || isUpdating) {
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // Date 객체 유효성 검증 및 변환
      let blockedUntilDate: Date;
      if (formData.blockedUntil instanceof Date) {
        blockedUntilDate = formData.blockedUntil;
      } else {
        blockedUntilDate = new Date(formData.blockedUntil as string | number);
      }
      
      // Date 객체가 유효한지 확인
      if (isNaN(blockedUntilDate.getTime())) {
        setDialogMessage('차단 종료 시각이 올바르지 않습니다.');
        setErrorDialogOpen(true);
        setIsUpdating(false);
        return;
      }

      const updateData = {
        registrationReason: formData.registrationReason as BlacklistRegistrationReason,
        blockedUntil: blockedUntilDate.toISOString(),
        ...(formData.description.trim() && { 
          description: formData.description.trim() 
        }),
        ...(formData.unblockReason.trim() && { 
          unblockReason: formData.unblockReason.trim() 
        }),
      };

      const result = await updateBlacklist(blacklistData.id, updateData);

      if (result.success) {
        setDialogMessage('블랙리스트가 성공적으로 수정되었습니다.');
        setSuccessDialogOpen(true);
        loadBlacklistData(); // 데이터 새로고침
      } else {
        setDialogMessage(`블랙리스트 수정에 실패했습니다: ${result.errorMsg}`);
        setErrorDialogOpen(true);
      } 
    } catch (error) {
      console.error('블랙리스트 수정 중 오류:', error);
      setDialogMessage('블랙리스트 수정 중 오류가 발생했습니다.');
      setErrorDialogOpen(true);
    } finally {
      setIsUpdating(false);
    }
  }, [blacklistData, formData, isUpdating, loadBlacklistData]);

  const handleUnblockClick = useCallback(() => {
    setUnblockReason('관리자에 의한 해제');
    setUnblockConfirmOpen(true);
  }, []);

  const handleUnblockConfirm = useCallback(async () => {
    if (!blacklistData || !unblockReason.trim()) return;

    try {
      const result = await unblockBlacklist(blacklistData.id, { unblockReason });
      
      if (result.success) {
        setDialogMessage('블랙리스트가 성공적으로 해제되었습니다.');
        setSuccessDialogOpen(true);
        loadBlacklistData(); // 데이터 새로고침
      } else {
        setDialogMessage(`블랙리스트 해제에 실패했습니다: ${result.errorMsg}`);
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('블랙리스트 해제 중 오류:', error);
      setDialogMessage('블랙리스트 해제 중 오류가 발생했습니다.');
      setErrorDialogOpen(true);
    } finally {
      setUnblockConfirmOpen(false);
      setUnblockReason('');
    }
  }, [blacklistData, unblockReason, loadBlacklistData]);

  const isFormValid = useMemo(() => {
    return formData.registrationReason.trim() && formData.blockedUntil !== null;
  }, [formData]);
  // #endregion

  if (isLoading) {
    return (
      <FlatContainer>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">데이터를 불러오는 중...</div>
        </div>
      </FlatContainer>
    );
  }

  if (!blacklistData) {
    return (
      <FlatContainer>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">블랙리스트 데이터를 찾을 수 없습니다.</div>
        </div>
      </FlatContainer>
    );
  }

  return (
    <FlatContainer>
      <PageHeader 
        title="블랙리스트 상세 및 수정" 
        subtitle={`차량번호: ${blacklistData.carNumber}`}
      />
      
      {/* 뒤로가기 버튼 */}
      <div className="flex justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleGoBack}
          icon={ArrowLeft}
        >
          목록으로 돌아가기
        </Button>
        
        {blacklistData.isActive && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleUnblockClick}
            icon={Unlock}
          >
            블랙리스트 해제
          </Button>
        )}
      </div>

      {/* 기본 정보 */}
      <div className="p-4 mb-8 bg-gray-50 rounded-lg">
        <h3 className="mb-4 text-lg font-semibold">기본 정보</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <span className="text-sm text-gray-500">등록 유형</span>
            <p className="font-medium">{blacklistData.blacklistType === 'AUTO' ? '자동' : '수동'}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">상태</span>
            <p className="font-medium">
              <span className={blacklistData.isActive ? 'text-red-600' : 'text-gray-500'}>
                {blacklistData.isActive ? '활성' : '비활성'}
              </span>
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-500">등록일시</span>
            <p className="font-medium">{new Date(blacklistData.registeredAt).toLocaleString()}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">만료일시</span>
            <p className="font-medium">
              {blacklistData.expiresAt 
                ? new Date(blacklistData.expiresAt).toLocaleString() 
                : '무기한'
              }
            </p>
          </div>
        </div>
      </div>

      {/* 수정 폼 */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FieldSelect
            id="registrationReason"
            label="등록 사유"
            value={formData.registrationReason}
            onChange={(value) => handleFormChange('registrationReason', value)}
            options={REGISTRATION_REASON_OPTIONS}
            placeholder="등록 사유를 선택하세요"
          />
          
          <FieldDatePicker
            id="blockedUntil"
            label="차단 종료 시각"
            datePickerType="datetime"
            value={formData.blockedUntil}
            onChange={(value) => handleFormChange('blockedUntil', value)}
            placeholder="날짜와 시간을 선택하세요"
            dateFormat="yyyy-MM-dd HH:mm"
          />
        </div>
        
        <FieldText
          id="description"
          label="설명"
          value={formData.description}
          onChange={(value) => handleFormChange('description', value)}
          placeholder="추가 설명을 입력하세요"
        />
        
        <FieldText
          id="unblockReason"
          label="해제 사유"
          value={formData.unblockReason}
          onChange={(value) => handleFormChange('unblockReason', value)}
          placeholder="해제 사유를 입력하세요"
        />

        {/* 수정 버튼 */}
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={handleGoBack}
            disabled={isUpdating}
          >
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdate}
            disabled={!isFormValid || isUpdating}
            loading={isUpdating}
            icon={Save}
          >
            수정
          </Button>
        </div>
      </div>

      {/* 해제 확인 다이얼로그 */}
      <Modal
        isOpen={unblockConfirmOpen}
        onClose={() => setUnblockConfirmOpen(false)}
        title="블랙리스트 해제"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            차량번호 <strong>{blacklistData.carNumber}</strong>를 블랙리스트에서 해제하시겠습니까?
          </p>
          <FieldText
            id="unblockReasonDialog"
            label="해제 사유"
            value={unblockReason}
            onChange={setUnblockReason}
            placeholder="해제 사유를 입력하세요"
          />
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setUnblockConfirmOpen(false)}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleUnblockConfirm}
              disabled={!unblockReason.trim()}
            >
              해제
            </Button>
          </div>
        </div>
      </Modal>

      {/* 성공 다이얼로그 */}
      <Modal
        isOpen={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        title="작업 완료"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">{dialogMessage}</p>
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={() => setSuccessDialogOpen(false)}
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