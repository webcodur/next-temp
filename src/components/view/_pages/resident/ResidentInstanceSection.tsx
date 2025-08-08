'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Home, Plus, Trash2, Edit, MapPin, Save } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import { BaseTable, BaseTableColumn } from '@/components/ui/ui-data/baseTable/BaseTable';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import TitleRow from '@/components/ui/ui-layout/title-row/TitleRow';
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { searchInstances } from '@/services/instances/instances$_GET';
import { moveResident } from '@/services/residents/residents_move_POST';
import { deleteResidentInstance } from '@/services/residents/residents_instances@id_DELETE';
import { ResidentDetail, ResidentInstanceWithInstance } from '@/types/resident';
import { Instance } from '@/types/instance';

interface ResidentInstanceSectionProps {
  resident: ResidentDetail;
  onDataChange: () => void;
}

export default function ResidentInstanceSection({ 
  resident, 
  onDataChange 
}: ResidentInstanceSectionProps) {
  // #region 상태 관리
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  // 이동 섹션 상태
  const [showMoveSection, setShowMoveSection] = useState(false);
  const [instances, setInstances] = useState<Instance[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedInstanceId, setSelectedInstanceId] = useState<number | null>(null);
  const [moveMemo, setMoveMemo] = useState('');
  const [isMoving, setIsMoving] = useState(false);
  const [moveError, setMoveError] = useState<string | null>(null);
  const [moveSuccess, setMoveSuccess] = useState<string | null>(null);
  // #endregion

  // #region 핸들러
  const handleToggleMoveSection = useCallback(() => {
    setShowMoveSection((prev) => !prev);
  }, []);

  const handleCreateInstanceRelation = useCallback(() => {
    // TODO: 호실 관계 생성 모달 또는 페이지로 이동
    console.log('호실 관계 생성');
  }, []);

  const handleDeleteInstanceRelation = useCallback((relationId: number) => {
    setDeleteTargetId(relationId);
    setDeleteConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTargetId) return;

    try {
      const result = await deleteResidentInstance(deleteTargetId);
      
      if (result.success) {
        setModalMessage('거주자-호실 관계가 성공적으로 삭제되었습니다.');
        setSuccessModalOpen(true);
        // 상위 컴포넌트에 데이터 변경 알림
        onDataChange();
      } else {
        setModalMessage(`관계 삭제에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('관계 삭제 중 오류:', error);
      setModalMessage('관계 삭제 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    }
  }, [deleteTargetId, onDataChange]);
  // #endregion

  // #region 현재 거주지 정보
  const currentResidence = resident.residentInstance?.find(ri => ri.instance);
  // #endregion

  // #region 이동 섹션 데이터 로드/계산
  const loadInstances = useCallback(async () => {
    setIsSearching(true);
    setMoveError(null);
    try {
      const result = await searchInstances({ page: 1, limit: 1000 });
      if (result.success && result.data) {
        setInstances(result.data.data || []);
      } else {
        setInstances([]);
        setMoveError(`호실 목록을 불러올 수 없습니다${result.errorMsg ? `: ${result.errorMsg}` : ''}`);
      }
    } catch (error) {
      console.error('호실 목록 조회 중 오류:', error);
      setMoveError('호실 목록을 불러오는 중 오류가 발생했습니다.');
      setInstances([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (showMoveSection) {
      loadInstances();
    }
  }, [showMoveSection, loadInstances]);

  const instanceOptions = useMemo(() => {
    return instances
      .filter(instance => instance.id !== currentResidence?.instanceId)
      .map(instance => ({
        value: instance.id.toString(),
        label: `${instance.address1Depth} ${instance.address2Depth} ${instance.address3Depth || ''}`.trim(),
      }));
  }, [instances, currentResidence?.instanceId]);

  const selectedInstance = useMemo(() => {
    if (!selectedInstanceId) return null;
    return instances.find(instance => instance.id === selectedInstanceId) || null;
  }, [selectedInstanceId, instances]);

  const isMoveValid = useMemo(() => {
    return selectedInstanceId !== null && selectedInstanceId !== currentResidence?.instanceId;
  }, [selectedInstanceId, currentResidence?.instanceId]);

  const handleInstanceChange = useCallback((value: string) => {
    setSelectedInstanceId(value ? Number(value) : null);
  }, []);

  const handleExecuteMove = useCallback(async () => {
    if (!resident || !isMoveValid || isMoving) return;
    setIsMoving(true);
    setMoveError(null);
    setMoveSuccess(null);
    try {
      const result = await moveResident({
        residentId: resident.id,
        instanceId: selectedInstanceId as number,
        memo: moveMemo.trim() || undefined,
      });

      if (result.success) {
        setMoveSuccess('거주자 호실 이동이 성공적으로 완료되었습니다.');
        setSelectedInstanceId(null);
        setMoveMemo('');
        // 상위 데이터 재조회
        onDataChange();
      } else {
        setMoveError(`호실 이동에 실패했습니다: ${result.errorMsg}`);
      }
    } catch (error) {
      console.error('호실 이동 중 오류:', error);
      setMoveError('호실 이동 중 오류가 발생했습니다.');
    } finally {
      setIsMoving(false);
    }
  }, [resident, isMoveValid, isMoving, selectedInstanceId, moveMemo, onDataChange]);
  // #endregion

  // #region 컬럼 정의
  const columns: BaseTableColumn<ResidentInstanceWithInstance>[] = [
    {
      key: 'id',
      header: '관계 ID',
      width: '10%',
      align: 'center',
    },
    {
      key: 'instanceId',
      header: '호실 ID',
      width: '10%',
      align: 'center',
    },
    {
      key: 'address',
      header: '주소',
      width: '25%',
      align: 'start',
      cell: (item: ResidentInstanceWithInstance) => {
        if (item.instance) {
          const { address1Depth, address2Depth, address3Depth } = item.instance;
          return `${address1Depth} ${address2Depth} ${address3Depth || ''}`.trim();
        }
        return '정보 없음';
      },
    },
    {
      key: 'instanceType',
      header: '호실 타입',
      width: '12%',
      align: 'center',
      cell: (item: ResidentInstanceWithInstance) => {
        if (item.instance) {
          const typeMap = {
            GENERAL: '일반',
            TEMP: '임시',
            COMMERCIAL: '상업',
          };
          return typeMap[item.instance.instanceType as keyof typeof typeMap] || item.instance.instanceType;
        }
        return '-';
      },
    },
    {
      key: 'memo',
      header: '메모',
      width: '20%',
      align: 'start',
      cell: (item: ResidentInstanceWithInstance) => item.memo || '-',
    },
    {
      key: 'createdAt',
      header: '관계 생성일',
      width: '13%',
      align: 'center',
      cell: (item: ResidentInstanceWithInstance) => {
        const date = new Date(item.createdAt);
        return date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
      },
    },
    {
      header: '관리',
      align: 'center',
      width: '10%',
      cell: (item: ResidentInstanceWithInstance) => (
        <div className="flex gap-1 justify-center">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteInstanceRelation(item.id)}
            title="관계 삭제"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];
  // #endregion

  return (
    <div className="space-y-6">
      <TitleRow title="거주 정보 관리" subtitle="거주자의 호실 관계를 관리합니다." />
      {/* 현재 거주지 정보 */}
      <div className="p-6 rounded-lg border bg-card border-border">
        <div className="flex gap-2 items-center mb-4">
          <Home size={20} />
          <h2 className="text-lg font-semibold text-foreground">
            현재 거주지 정보
          </h2>
        </div>

        {currentResidence?.instance ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">주소</label>
                <div className="flex gap-2 items-center mt-1">
                  <MapPin size={16} className="text-muted-foreground" />
                  <span className="text-foreground">
                    {`${currentResidence.instance.address1Depth} ${currentResidence.instance.address2Depth} ${currentResidence.instance.address3Depth || ''}`.trim()}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">호실 타입</label>
                <div className="mt-1 text-foreground">
                  {(() => {
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
            
            {currentResidence.memo && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">메모</label>
                <div className="mt-1 text-foreground">{currentResidence.memo}</div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button 
                variant="primary" 
                size="default"
                onClick={handleToggleMoveSection}
                title={showMoveSection ? '이동 섹션 닫기' : '다른 호실로 이동'}
              >
                <Edit size={16} />
                {showMoveSection ? '이동 섹션 닫기' : '호실 이동'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="mb-4 text-muted-foreground">현재 연결된 거주지가 없습니다.</p>
            <Button 
              variant="primary" 
              size="default"
              onClick={handleCreateInstanceRelation}
              title="호실 관계 생성"
            >
              <Plus size={16} />
              거주지 연결
            </Button>
          </div>
        )}
      </div>

      {/* 호실 이동 섹션 (인라인) */}
      {showMoveSection && (
        <div className="p-6 rounded-lg border bg-card border-border">
          <div className="flex gap-2 items-center mb-4">
            <Save size={20} />
            <h2 className="text-lg font-semibold text-foreground">호실 이동</h2>
            <div className="ml-2 text-sm text-muted-foreground">현재 거주지를 퇴거 처리하고 선택한 호실로 이동합니다.</div>
          </div>

          {moveError && (
            <div className="mb-4 p-3 rounded-md border border-red-200 bg-red-50 text-sm text-red-700">
              {moveError}
            </div>
          )}
          {moveSuccess && (
            <div className="mb-4 p-3 rounded-md border border-green-200 bg-green-50 text-sm text-green-700">
              {moveSuccess}
            </div>
          )}

          <GridForm 
            labelWidth="120px" 
            gap="20px"
            bottomRightActions={(
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={handleToggleMoveSection}
                  disabled={isMoving}
                >
                  닫기
                </Button>
                <Button
                  variant="primary"
                  onClick={handleExecuteMove}
                  disabled={!isMoveValid || isMoving || isSearching}
                  title={isMoving ? '이동 중...' : !isMoveValid ? '호실을 선택해주세요' : '호실 이동 실행'}
                  icon={Save}
                >
                  {isMoving ? '이동 중...' : '이동 실행'}
                </Button>
              </div>
            )}
          >
            <GridForm.Row>
              <GridForm.Label required>
                새 거주지
              </GridForm.Label>
              <GridForm.Content>
                <SimpleDropdown
                  value={selectedInstanceId?.toString() || ''}
                  onChange={handleInstanceChange}
                  options={instanceOptions}
                  placeholder={isSearching ? '호실 목록을 불러오는 중...' : '이동할 호실을 선택하세요'}
                  disabled={isSearching || isMoving}
                  validationRule={{ type: 'free', mode: 'create' }}
                />
              </GridForm.Content>
            </GridForm.Row>

            <GridForm.Row>
              <GridForm.Label>
                이동 사유
              </GridForm.Label>
              <GridForm.Content>
                <SimpleTextInput
                  value={moveMemo}
                  onChange={setMoveMemo}
                  placeholder="이동 사유나 메모를 입력하세요"
                  disabled={isMoving}
                  validationRule={{ type: 'free', mode: 'create' }}
                />
              </GridForm.Content>
            </GridForm.Row>

            {/* 선택된 호실 미리보기 */}
            {selectedInstance && (
              <GridForm.Row>
                <GridForm.Label>
                  선택된 호실
                </GridForm.Label>
                <GridForm.Content>
                  <div className="flex items-center gap-2 text-foreground">
                    <MapPin size={16} className="text-muted-foreground" />
                    <span>
                      {`${selectedInstance.address1Depth} ${selectedInstance.address2Depth} ${selectedInstance.address3Depth || ''}`.trim()} (ID: {selectedInstance.id})
                    </span>
                  </div>
                </GridForm.Content>
              </GridForm.Row>
            )}

            
          </GridForm>
        </div>
      )}

      {/* 전체 호실 관계 목록 */}
      <div className="p-6 rounded-lg border bg-card border-border">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2 items-center">
            <Home size={20} />
            <h2 className="text-lg font-semibold text-foreground">
              호실 관계 목록
            </h2>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCreateInstanceRelation}
            title="새 호실 관계 추가"
          >
            <Plus size={16} />
            관계 추가
          </Button>
        </div>

        {resident.residentInstance && resident.residentInstance.length > 0 ? (
          <BaseTable
            data={resident.residentInstance as unknown as Record<string, unknown>[]}
            columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
            pageSize={10}
          />
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            연결된 호실이 없습니다.
          </div>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="관계 삭제 확인"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 삭제하시겠습니까?</h3>
            <p className="text-muted-foreground">
              이 작업은 되돌릴 수 없습니다. 거주자-호실 관계가 영구적으로 삭제됩니다.
              <br />
              <span className="font-medium text-orange-600">
                주의: 이사의 경우 삭제보다는 &ldquo;호실 이동&rdquo; 기능을 사용하시기 바랍니다.
              </span>
            </p>
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <Button 
              variant="ghost" 
              onClick={() => setDeleteConfirmOpen(false)}
            >
              취소
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
            >
              삭제
            </Button>
          </div>
        </div>
      </Modal>

      {/* 성공 모달 */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="작업 완료"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-green-600">성공</h3>
            <p className="text-muted-foreground">{modalMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setSuccessModalOpen(false)}>
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
            <h3 className="mb-2 text-lg font-semibold text-red-600">오류</h3>
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
