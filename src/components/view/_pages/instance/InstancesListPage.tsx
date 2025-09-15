/* 메뉴 설명: 인스턴스 관리 목록 페이지 */
'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

// UI 라이브러리 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import { CrudButton } from '@/components/ui/ui-input/crud-button/CrudButton';
import { BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import InstanceSearchSection, { InstanceSearchField } from '@/components/ui/ui-input/instance-search/InstanceSearchSection';

// API 호출
import { deleteInstance } from '@/services/instances/instances@id_DELETE';

// 타입 정의
import { Instance } from '@/types/instance';

export default function InstancesListPage() {
  const router = useRouter();
  
  // 안정한 빈 배열
  const excludeInstanceIds = useMemo(() => [], []);
  
  // #region 상태 관리
  // 다이얼로그 관련 상태
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  // #endregion

  // #region 이벤트 핸들러
  const handleCreateClick = useCallback(() => {
    router.push('/parking/occupancy/instance/create');
  }, [router]);

  const handleRowClick = useCallback((instance: Instance, _index: number) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    router.push(`/parking/occupancy/instance/${instance.id}`);
  }, [router]);

  const handleDeleteClick = useCallback((id: number) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTargetId) return;

    try {
      const result = await deleteInstance(deleteTargetId);
      
      if (result.success) {
        // 삭제 성공 시 검색 결과를 새로고침하기 위해 페이지 새로고침이나 
        // 상위 컴포넌트에서 다시 검색을 실행하도록 함
        setDialogMessage('세대가 성공적으로 삭제되었습니다.');
        setSuccessDialogOpen(true);
      } else {
        setDialogMessage('세대 삭제에 실패했습니다.');
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('인스턴스 삭제 중 오류:', error);
      setDialogMessage('세대 삭제 중 오류가 발생했습니다.');
      setErrorDialogOpen(true);
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    }
  }, [deleteTargetId]);
  // #endregion

  // #region 검색 필드 구성
  const searchFields: InstanceSearchField[] = useMemo(() => [
    {
      key: 'address1Depth',
      label: '동 정보 검색',
      placeholder: '동 정보를 입력하세요',
      type: 'text',
      visible: true,
    },
    {
      key: 'address2Depth',
      label: '호수 정보 검색',
      placeholder: '호수 정보를 입력하세요',
      type: 'text',
      visible: true,
    },
    {
      key: 'instanceType',
      label: '세대 타입 검색',
      placeholder: '타입을 선택하세요',
      type: 'select',
      visible: true,
    },
    {
      key: 'instanceName',
      label: '세대명 검색',
      placeholder: '세대명을 입력하세요',
      type: 'text',
      visible: true,
    },
  ], []);
  // #endregion

  // #region 컬럼 정의
  const columns: BaseTableColumn<Instance>[] = useMemo(() => [
    {
      key: 'id',
      header: 'ID',
      minWidth: '60px',
      align: 'center',
    },
    {
      key: 'dongHosu',
      header: '동호수',
      align: 'start',
      minWidth: '100px',
      cell: (item: Instance) => `${item.address1Depth} ${item.address2Depth}`,
    },
    {
      key: 'name',
      header: '세대명',
      align: 'start',
      minWidth: '120px',
      cell: (item: Instance) => item.name || '-',
    },
    {
      key: 'ownerName',
      header: '소유자',
      align: 'start',
      minWidth: '100px',
      cell: (item: Instance) => item.ownerName || '-',
    },

    {
      key: 'instanceType',
      header: '타입',
      align: 'center',
      minWidth: '80px',
      cell: (item: Instance) => {
        const typeMap = {
          GENERAL: '일반',
          TEMP: '임시',
          COMMERCIAL: '상업',
        };
        return typeMap[item.instanceType] || item.instanceType;
      },
    },
    {
      key: 'userCount',
      header: '주민',
      align: 'center',
      minWidth: '90px',
      cell: (item: Instance) => `${item.userCount ?? 0}명`,
    },
    {
      key: 'carCount',
      header: '차량',
      align: 'center',
      minWidth: '90px',
      cell: (item: Instance) => `${item.carCount ?? 0}대`,
    },
    {
      key: 'address3Depth',
      header: '기타주소',
      align: 'start',
      minWidth: '100px',
      cell: (item: Instance) => item.address3Depth || '-',
    },
    {
      key: 'memo',
      header: '메모',
      align: 'start',
      minWidth: '120px',
      cell: (item: Instance) => item.memo || '-',
    },
    {
      key: 'updatedAt',
      header: '수정일',
      align: 'center',
      minWidth: '100px',
      type: 'datetime',
    },
    {
      key: 'createdAt',
      header: '등록일',
      align: 'center',
      minWidth: '100px',
      type: 'datetime',
    },
    {
      header: '관리',
      align: 'center',
      minWidth: '80px',
      cell: (item: Instance) => (
        <div className="flex gap-1 justify-center">
          <CrudButton
            action="delete"
            iconOnly
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(item.id);
            }}
            title="세대 삭제"
          />
        </div>
      ),
    },
  ], [handleDeleteClick]);
  // #endregion

  // #region 렌더링
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="세대 관리" 
        subtitle="세대 등록, 수정, 삭제 및 설정 관리"
        rightActions={
          <CrudButton
            action="create"
            size="default"
            onClick={handleCreateClick}
            title="세대 추가"
          >
            추가
          </CrudButton>
        }
      />

      {/* 세대 검색 및 목록 */}
      <InstanceSearchSection
        searchFields={searchFields}
        tableType="paginated"
        columns={columns}
        onRowClick={handleRowClick}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        itemName="세대"
        showSection={false}
        excludeInstanceIds={excludeInstanceIds}
      />

      {/* 삭제 확인 다이얼로그 */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="세대 삭제 확인"
        size="md"
        onConfirm={handleDeleteConfirm}
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 삭제하시겠습니까?</h3>
            <p className="text-muted-foreground">
              이 작업은 되돌릴 수 없습니다. 세대 정보가 영구적으로 삭제됩니다.
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
            <Button onClick={() => setSuccessDialogOpen(false)}>
              확인
            </Button>
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
            <Button onClick={() => setErrorDialogOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
  // #endregion
}
