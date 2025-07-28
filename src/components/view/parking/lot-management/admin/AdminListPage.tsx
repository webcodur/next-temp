/* 메뉴 설명: 페이지 기능 설명 */
'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';


// UI 라이브러리 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/ui-layout/dialog/Dialog';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';

// API 호출
import { searchAdmin } from '@/services/admin/admin$_GET';
import { deleteAdmin } from '@/services/admin/admin@id_DELETE';

// 타입 정의
import { Admin } from '@/types/admin';

export default function AdminListPage() {
  const router = useRouter();
  
  
  // #region 상태 관리
  const [adminList, setAdminList] = useState<Admin[]>([]);
  
  // 다이얼로그 관련 상태
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  // #endregion

  // #region 데이터 로드
  const loadAdminData = useCallback(async () => {
    try {
      const result = await searchAdmin({
        page: 1,
        limit: 100 // 임시로 큰 수치 설정
      });
      
      if (result.success) {
        console.log('result.data.data', result.data.data)
        setAdminList(result.data.data || result.data || []);
      } else {
        console.error('관리자 목록 로드 실패:', result.errorMsg);
        setAdminList([]);
      }
    } catch (error) {
      console.error('관리자 목록 로드 중 오류:', error);
      setAdminList([]);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);
  // #endregion

  // #region 이벤트 핸들러
  const handleCreateClick = useCallback(() => {
    router.push('/parking/lot-management/admin/create');
  }, [router]);

  const handleRowClick = useCallback((admin: Admin, _index: number) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    console.log('handleRowClick 호출, admin:', admin, 'adminId:', admin.id);
    console.log('이동할 경로:', `/parking/lot-management/admin/${admin.id}`);
    router.push(`/parking/lot-management/admin/${admin.id}`);
  }, [router]);

  const handleDeleteClick = useCallback((id: number) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTargetId) return;

    try {
      const result = await deleteAdmin({ id: deleteTargetId });
      
      if (result.success) {
        setAdminList((prev) => prev.filter((admin) => admin.id !== deleteTargetId));
        setDialogMessage('관리자가 성공적으로 삭제되었습니다.');
        setSuccessDialogOpen(true);
      } else {
        setDialogMessage(`관리자 삭제에 실패했습니다: ${result.errorMsg}`);
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('관리자 삭제 중 오류:', error);
      setDialogMessage('관리자 삭제 중 오류가 발생했습니다.');
      setErrorDialogOpen(true);
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    }
  }, [deleteTargetId]);
  // #endregion

  // #region 컬럼 정의
  const columns: BaseTableColumn<Admin>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '6%',
      align: 'center',
    },
    {
      key: 'account',
      header: '계정명',
      align: 'start',
      width: '10%',
    },
    {
      key: 'name',
      header: '이름',
      align: 'start',
      width: '12%',
    },
    {
      key: 'email',
      header: '이메일',
      align: 'start',
      width: '17%',
    },
    {
      key: 'phone',
      header: '연락처',
      align: 'center',
      width: '13%',
    },
    {
      key: 'role',
      header: '권한',
      align: 'center',
      width: '8%',
      cell: (item: Admin) => item.role?.name || '-',
    },
    {
      key: 'parkinglot',
      header: '주차장',
      align: 'start',
      width: '13%',
      cell: (item: Admin) => item.parkinglot?.name || '-',
    },
    {
      key: 'createdAt',
      header: '등록일자',
      align: 'center',
      width: '14%',
      cell: (item: Admin) => {
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
      width: '9%',
      sortable: false,
      cell: (item: Admin) => (
        <div className="flex gap-1 justify-center">
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(item.id);
            }}
            title="관리자 삭제"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];
  // #endregion

  // #region 렌더링
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="관리자 계정 관리" 
        subtitle="시스템 관리자 계정 등록, 수정, 삭제 및 권한 관리"
      >
        <Button
          variant="accent"
          size="sm"
          className="flex gap-1 items-center bg-primary-4"
          onClick={handleCreateClick}
        >
          <Plus size={16} />
          관리자 추가
        </Button>
      </PageHeader>
      
      {/* 테이블 */}
      <PaginatedTable
        data={adminList}
        columns={columns}
        onRowClick={handleRowClick}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        itemName="관리자"
      />

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        variant="warning"
        title="관리자 삭제 확인"
      >
        <DialogHeader>
          <DialogTitle>정말로 삭제하시겠습니까?</DialogTitle>
          <DialogDescription>
            이 작업은 되돌릴 수 없습니다. 관리자 정보가 영구적으로 삭제됩니다.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
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
        </DialogFooter>
      </Dialog>

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
  // #endregion
} 