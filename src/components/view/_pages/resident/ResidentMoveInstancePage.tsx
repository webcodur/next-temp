/* 메뉴 설명: 거주자 호실 이동 페이지 */
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Save, Home, MapPin } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { getResidentDetail } from '@/services/residents/residents@id_GET';
import { searchInstances } from '@/services/instances/instances$_GET';
import { moveResident } from '@/services/residents/residents_move_POST';
import { ResidentDetail } from '@/types/resident';
import { Instance } from '@/types/instance';

export default function ResidentMoveInstancePage() {
  const router = useRouter();
  const params = useParams();
  const residentId = Number(params.id);
  
  // #region 상태 관리
  const [resident, setResident] = useState<ResidentDetail | null>(null);
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedInstanceId, setSelectedInstanceId] = useState<number | null>(null);
  const [memo, setMemo] = useState('');
  
  // 모달 상태
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  // #endregion

  // #region 데이터 로드
  const loadData = useCallback(async () => {
    if (!residentId || isNaN(residentId)) return;
    
    setLoading(true);
    try {
      // 거주자 정보와 호실 목록을 병렬로 로드
      const [residentResult, instancesResult] = await Promise.all([
        getResidentDetail(residentId),
        searchInstances({ page: 1, limit: 1000 })
      ]);
      
      if (residentResult.success && residentResult.data) {
        setResident(residentResult.data);
      } else {
        console.error('거주자 조회 실패:', residentResult.errorMsg);
        setModalMessage(`거주자 정보를 불러올 수 없습니다: ${residentResult.errorMsg}`);
        setErrorModalOpen(true);
        setTimeout(() => {
          router.push('/parking/occupancy/resident');
        }, 2000);
      }
      
      if (instancesResult.success && instancesResult.data) {
        setInstances(instancesResult.data.data || []);
      } else {
        console.error('호실 목록 조회 실패:', instancesResult.errorMsg);
        setInstances([]);
      }
    } catch (error) {
      console.error('데이터 로드 중 오류:', error);
      setModalMessage('데이터를 불러오는 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  }, [residentId, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  // #endregion

  // #region 현재 거주지 정보
  const currentResidence = resident?.residentInstance?.find(ri => ri.instance);
  // #endregion

  // #region 호실 옵션
  const instanceOptions = useMemo(() => {
    return instances
      .filter(instance => instance.id !== currentResidence?.instanceId) // 현재 거주지 제외
      .map(instance => ({
        value: instance.id.toString(),
        label: `${instance.address1Depth} ${instance.address2Depth} ${instance.address3Depth || ''}`.trim()
      }));
  }, [instances, currentResidence]);
  // #endregion

  // #region 선택된 호실 정보
  const selectedInstance = useMemo(() => {
    if (!selectedInstanceId) return null;
    return instances.find(instance => instance.id === selectedInstanceId);
  }, [selectedInstanceId, instances]);
  // #endregion

  // #region 검증
  const isValid = useMemo(() => {
    return selectedInstanceId !== null && selectedInstanceId !== currentResidence?.instanceId;
  }, [selectedInstanceId, currentResidence]);
  // #endregion

  // #region 핸들러
  const handleBack = () => {
    router.push(`/parking/occupancy/resident/${residentId}`);
  };

  const handleInstanceChange = (value: string) => {
    setSelectedInstanceId(value ? Number(value) : null);
  };

  const handleSubmitClick = () => {
    if (!isValid) return;
    setConfirmModalOpen(true);
  };

  const handleMoveConfirm = useCallback(async () => {
    if (!resident || !selectedInstanceId || isSubmitting) return;
    
    setIsSubmitting(true);
    setConfirmModalOpen(false);
    
    try {
      const moveData = {
        residentId: resident.id,
        instanceId: selectedInstanceId,
        memo: memo.trim() || undefined,
      };

      const result = await moveResident(moveData);

      if (result.success) {
        setModalMessage('거주자 호실 이동이 성공적으로 완료되었습니다.');
        setSuccessModalOpen(true);
      } else {
        console.error('호실 이동 실패:', result.errorMsg);
        setModalMessage(`호실 이동에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('호실 이동 중 오류:', error);
      setModalMessage('호실 이동 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [resident, selectedInstanceId, memo, isSubmitting]);

  const handleSuccessClose = () => {
    setSuccessModalOpen(false);
    router.push(`/parking/occupancy/resident/${residentId}`);
  };
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
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title="호실 이동"
        subtitle={`${resident.name} - 거주지 변경`}
        leftActions={
          <Button
            variant="secondary"
            size="default"
            onClick={handleBack}
            title="거주자 상세로"
          >
            <ArrowLeft size={16} />
            돌아가기
          </Button>
        }
      />

      {/* 현재 거주지 정보 */}
      <div className="p-6 rounded-lg border bg-card border-border">
        <div className="flex gap-2 items-center mb-4">
          <Home size={20} />
          <h2 className="text-lg font-semibold text-foreground">
            현재 거주지
          </h2>
        </div>

        {currentResidence?.instance ? (
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
            <MapPin size={20} className="text-muted-foreground" />
            <div>
              <div className="font-medium text-foreground">
                {`${currentResidence.instance.address1Depth} ${currentResidence.instance.address2Depth} ${currentResidence.instance.address3Depth || ''}`.trim()}
              </div>
              <div className="text-sm text-muted-foreground">
                인스턴스 ID: {currentResidence.instance.id} | 
                타입: {(() => {
                  const typeMap = {
                    GENERAL: '일반',
                    TEMP: '임시',
                    COMMERCIAL: '상업',
                  };
                  return typeMap[currentResidence.instance.instanceType as keyof typeof typeMap] || currentResidence.instance.instanceType;
                })()}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            현재 연결된 거주지가 없습니다.
          </div>
        )}
      </div>

      {/* 이동할 인스턴스 선택 */}
      <div className="p-6 rounded-lg border bg-card border-border">
        <div className="flex gap-2 items-center mb-4">
          <ArrowRight size={20} />
          <h2 className="text-lg font-semibold text-foreground">
            이동할 거주지 선택
          </h2>
        </div>

        {(() => {
          const fields: GridFormFieldSchema[] = [
            {
              id: 'newInstance',
              label: '새 거주지',
              required: true,
              component: (
                <SimpleDropdown
                  value={selectedInstanceId?.toString() || ''}
                  onChange={handleInstanceChange}
                  options={instanceOptions}
                  placeholder="이동할 호실을 선택하세요"
                  disabled={isSubmitting}
                  validationRule={{
                    type: 'free',
                    mode: 'create'
                  }}
                />
              )
            },
            {
              id: 'memo',
              label: '이동 사유',
              component: (
                <SimpleTextInput
                  value={memo}
                  onChange={setMemo}
                  placeholder="이동 사유나 메모를 입력하세요"
                  disabled={isSubmitting}
                  validationRule={{
                    type: 'free',
                    mode: 'create'
                  }}
                />
              )
            }
          ];

          return <GridFormAuto fields={fields} gap="20px" />;
        })()}

        {/* 선택된 호실 미리보기 */}
        {selectedInstance && (
          <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200">
            <h4 className="text-sm font-medium text-green-800 mb-2">선택된 거주지</h4>
            <div className="flex items-center gap-4">
              <MapPin size={16} className="text-green-600" />
              <div>
                <div className="font-medium text-green-800">
                  {`${selectedInstance.address1Depth} ${selectedInstance.address2Depth} ${selectedInstance.address3Depth || ''}`.trim()}
                </div>
                <div className="text-sm text-green-600">
                  호실 ID: {selectedInstance.id} | 
                  타입: {(() => {
                    const typeMap = {
                      GENERAL: '일반',
                      TEMP: '임시',
                      COMMERCIAL: '상업',
                    };
                    return typeMap[selectedInstance.instanceType as keyof typeof typeMap] || selectedInstance.instanceType;
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 이동 실행 버튼 - 우하단 고정 */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          variant="primary"
          size="lg"
          onClick={handleSubmitClick} 
          disabled={!isValid || isSubmitting}
          title={isSubmitting ? '이동 중...' : !isValid ? '호실을 선택해주세요' : '호실 이동 실행'}
          className="shadow-lg"
        >
          <Save size={20} />
          {isSubmitting ? '이동 중...' : '이동 실행'}
        </Button>
      </div>

      {/* 이동 확인 모달 */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => !isSubmitting && setConfirmModalOpen(false)}
        title="호실 이동 확인"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">다음과 같이 이동하시겠습니까?</h3>
            
            <div className="space-y-3 p-4 rounded-lg bg-muted/50">
              <div>
                <span className="text-sm font-medium text-muted-foreground">거주자:</span>
                <span className="ml-2 font-medium">{resident.name}</span>
              </div>
              
              <div>
                <span className="text-sm font-medium text-muted-foreground">현재 거주지:</span>
                <span className="ml-2">
                  {currentResidence?.instance 
                    ? `${currentResidence.instance.address1Depth} ${currentResidence.instance.address2Depth} ${currentResidence.instance.address3Depth || ''}`.trim()
                    : '없음'
                  }
                </span>
              </div>
              
              <div>
                <span className="text-sm font-medium text-muted-foreground">이동할 거주지:</span>
                <span className="ml-2 font-medium text-green-600">
                  {selectedInstance 
                    ? `${selectedInstance.address1Depth} ${selectedInstance.address2Depth} ${selectedInstance.address3Depth || ''}`.trim()
                    : ''
                  }
                </span>
              </div>
              
              {memo && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">이동 사유:</span>
                  <span className="ml-2">{memo}</span>
                </div>
              )}
            </div>

            <p className="mt-4 text-sm text-orange-600">
              주의: 이 작업은 현재 거주지를 자동으로 퇴거 처리하고 새 호실로 이동시킵니다.
            </p>
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <Button 
              variant="ghost" 
              onClick={() => setConfirmModalOpen(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button 
              variant="primary" 
              onClick={handleMoveConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? '이동 중...' : '이동 실행'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 성공 모달 */}
      <Modal
        isOpen={successModalOpen}
        onClose={handleSuccessClose}
        title="이동 완료"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-600 mb-2">성공</h3>
            <p className="text-muted-foreground">{modalMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={handleSuccessClose}>
              확인
            </Button>
          </div>
        </div>
      </Modal>

      {/* 오류 모달 */}
      <Modal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        title="오류 발생"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">오류</h3>
            <p className="text-muted-foreground">{modalMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setErrorModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
