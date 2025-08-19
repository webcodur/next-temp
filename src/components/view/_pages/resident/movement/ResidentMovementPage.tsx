/* 메뉴 설명: 입주자 세대 이전 페이지 */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';

import DetailPageLayout from '@/components/ui/ui-layout/detail-page-layout/DetailPageLayout';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { Button } from '@/components/ui/ui-input/button/Button';
import ResidentMovement from './ResidentMovement';
import { createResidentTabs } from '../_shared/residentTabs';
import { getResidentDetail } from '@/services/residents/residents@id_GET';
import { ResidentDetail } from '@/types/resident';

export default function ResidentMovementPage() {
  const params = useParams();
  const residentId = Number(params.id);
  
  // #region 상태 관리
  const [resident, setResident] = useState<ResidentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [operationModalOpen, setOperationModalOpen] = useState(false);
  const [operationModalSuccess, setOperationModalSuccess] = useState(false);
  const [operationModalMessage, setOperationModalMessage] = useState('');
  // #endregion

  // #region 데이터 로드
  const loadResidentData = useCallback(async () => {
    if (!residentId || isNaN(residentId)) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await getResidentDetail(residentId);
      
      if (result.success && result.data) {
        setResident(result.data);
      } else {
        console.error('거주자 조회 실패:', result.errorMsg);
      }
    } catch (error) {
      console.error('거주자 조회 중 오류:', error);
    } finally {
      setLoading(false);
    }
  }, [residentId]);

  useEffect(() => {
    loadResidentData();
  }, [loadResidentData]);
  // #endregion

  // #region 핸들러
  const handleOperationComplete = useCallback((success: boolean, message: string) => {
    setOperationModalMessage(message);
    setOperationModalSuccess(success);
    setOperationModalOpen(true);
  }, []);
  // #endregion

  // #region 탭 설정
  const tabs = createResidentTabs(residentId);
  // #endregion

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!resident) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">거주자 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <DetailPageLayout
      title="거주자 상세 정보"
      subtitle={`${resident.name} - ${resident.phone || '전화번호 없음'}`}
      tabs={tabs}
      activeTabId="movement"
      fallbackPath="/parking/occupancy/resident"
    >
      <ResidentMovement 
        resident={resident}
        onDataChange={loadResidentData}
        onOperationComplete={handleOperationComplete}
      />

      {/* 작업 완료 모달 */}
      <Modal
        isOpen={operationModalOpen}
        onClose={() => setOperationModalOpen(false)}
        title="작업 완료"
        size="sm"
        onConfirm={() => setOperationModalOpen(false)}
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className={`mb-2 text-lg font-semibold ${
              operationModalSuccess ? 'text-green-600' : 'text-red-600'
            }`}>
              {operationModalSuccess ? '성공' : '실패'}
            </h3>
            <p className="text-muted-foreground">{operationModalMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setOperationModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>
    </DetailPageLayout>
  );
}
