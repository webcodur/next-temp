/* 메뉴 설명: 블랙리스트 차량 상세 및 수정 - 블랙리스트 항목 상세 조회 및 수정 */
'use client';
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Unlock } from 'lucide-react';
import { useBackNavigation } from '@/hooks/useBackNavigation';


// UI 라이브러리 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Modal from '@/components/ui/ui-layout/modal/Modal';

// Field 컴포넌트들
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import BlacklistForm, { BlacklistFormData } from '@/components/view/_pages/violation/blacklist/BlacklistForm';

// API 호출
import { searchBlacklists } from '@/services/blacklist/blacklists$_GET';
import { updateBlacklist } from '@/services/blacklist/blacklists@id_PUT';
import { unblockBlacklist } from '@/services/blacklist/blacklists@id_unblock_PATCH';

// 타입 정의
import { BlacklistResponse, ENUM_BlacklistRegistrationReason } from '@/types/blacklist';


// (상수 불필요 — 폼 컴포넌트 내부로 이동)

export default function BlacklistDetailPage() {
  const router = useRouter();
  const params = useParams();
  const routerRef = useRef(router);
  routerRef.current = router;

  const id = Number(params.id);
  
  // #region 상태 관리
  const [blacklistData, setBlacklistData] = useState<BlacklistResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    registrationReason: '',
    blockedUntil: null as Date | null,
    blockReason: '',
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
    if (!id || isNaN(id)) return;
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
            blockedUntil: foundItem.blockedUntil ? new Date(foundItem.blockedUntil) : null,
            blockReason: foundItem.blockReason || '',
            unblockReason: foundItem.unblockReason || '',
          });
        } else {
          setDialogMessage('해당 블랙리스트 항목을 찾을 수 없습니다.');
          setErrorDialogOpen(true);
          setTimeout(() => {
            routerRef.current.push('/parking/violation/blacklist');
          }, 2000);
        }
      } else {
        setDialogMessage('블랙리스트 데이터를 불러오는데 실패했습니다.');
        setErrorDialogOpen(true);
        setTimeout(() => {
          routerRef.current.push('/parking/violation/blacklist');
        }, 2000);
      }
    } catch (error) {
      console.error('블랙리스트 데이터 로드 중 오류:', error);
      setDialogMessage('데이터를 불러오는 중 오류가 발생했습니다.');
      setErrorDialogOpen(true);
      setTimeout(() => {
        routerRef.current.push('/parking/violation/blacklist');
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadBlacklistData();
  }, [loadBlacklistData]);
  // #endregion

  // #region 이벤트 핸들러
  const { handleBack } = useBackNavigation({
    fallbackPath: '/parking/violation/blacklist'
  });

  const handleFormChange = useCallback((field: string, value: string | Date | null) => {

    
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
  
  const handleFormChangeAll = useCallback((data: BlacklistFormData) => {
    setFormData(data);
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
        registrationReason: formData.registrationReason as ENUM_BlacklistRegistrationReason,
        blockedUntil: blockedUntilDate.toISOString(),
        ...(formData.blockReason.trim() && { 
          blockReason: formData.blockReason.trim() 
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
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!blacklistData) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">블랙리스트 데이터를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="블랙리스트 상세 정보"
        subtitle={`${blacklistData.carNumber}`}
        rightActions={
          blacklistData.isActive ? (
            <Button
              variant="primary"
              size="default"
              onClick={handleUnblockClick}
              title="블랙리스트 해제"
            >
              <Unlock size={16} />
              해제
            </Button>
          ) : null
        }
      />

      {/* 수정 폼 (GridForm 사용) */}
      <BlacklistForm
        data={formData}
        onChange={handleFormChangeAll}
        onFieldChange={handleFormChange}
        onCancel={handleBack}
        onSubmit={handleUpdate}
        isSubmitting={isUpdating}
        isValid={Boolean(isFormValid)}
        blacklist={blacklistData}
      />

      {/* 해제 확인 다이얼로그 */}
      <Modal 
        isOpen={unblockConfirmOpen} 
        onClose={() => setUnblockConfirmOpen(false)} 
        title="블랙리스트 해제" 
        size="sm"
        onConfirm={unblockReason.trim() ? handleUnblockConfirm : undefined}
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold">해제 확인</h3>
            <p className="text-muted-foreground">
              차량번호 <strong>{blacklistData.carNumber}</strong>를 블랙리스트에서 해제하시겠습니까?
            </p>
          </div>
          <FieldText
            id="unblockReasonDialog"
            label="해제 사유"
            value={unblockReason}
            onChange={setUnblockReason}
            placeholder="해제 사유를 입력하세요"
          />
          <div className="flex gap-3 justify-center pt-2">
            <Button variant="outline" onClick={() => setUnblockConfirmOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleUnblockConfirm} disabled={!unblockReason.trim()}>
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
        onConfirm={() => setSuccessDialogOpen(false)}
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-green-600">성공</h3>
            <p className="text-muted-foreground">{dialogMessage}</p>
          </div>
          <div className="flex justify-center pt-4">
            <Button onClick={() => setSuccessDialogOpen(false)}>확인</Button>
          </div>
        </div>
      </Modal>

      {/* 오류 다이얼로그 */}
      <Modal 
        isOpen={errorDialogOpen} 
        onClose={() => setErrorDialogOpen(false)} 
        title="오류 발생" 
        size="sm"
        onConfirm={() => setErrorDialogOpen(false)}
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-red-600">오류</h3>
            <p className="text-muted-foreground">{dialogMessage}</p>
          </div>
          <div className="flex justify-center pt-4">
            <Button onClick={() => setErrorDialogOpen(false)}>확인</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}