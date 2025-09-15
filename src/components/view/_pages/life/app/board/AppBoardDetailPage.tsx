/* 메뉴 설명: 앱 게시판 상세 페이지 */
'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import AppBoardForm, { AppBoardFormData } from './AppBoardForm';
import { getAppBoardById } from '@/data/mockAppBoardData';
import { AppBoard, ENUM_APP_BOARD_STATUS } from '@/types/appBoard';

interface Props {
  boardId: number;
}

export default function AppBoardDetailPage({ boardId }: Props) {  
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  // #region 상태 관리
  const [appBoard, setAppBoard] = useState<AppBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AppBoardFormData>({
    title: '',
    content: '',
    category: '',
    status: ENUM_APP_BOARD_STATUS.DRAFT,
    isFixed: false,
  });
  const [originalData, setOriginalData] = useState<AppBoardFormData>({
    title: '',
    content: '',
    category: '',
    status: ENUM_APP_BOARD_STATUS.DRAFT,
    isFixed: false,
  });
  
  // 모달 상태
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  // #endregion

  // #region 데이터 로드
  const loadAppBoardData = useCallback(async () => {
    if (!boardId || isNaN(boardId)) {
      return;
    }
    
    setLoading(true);
    try {
      const board = getAppBoardById(boardId);
      
      if (board) {
        setAppBoard(board);
        
        const initialData = {
          title: board.title,
          content: board.content,
          category: board.category,
          status: board.status,
          isFixed: board.isFixed,
        };
        setFormData(initialData);
        setOriginalData(initialData);
      } else {
        console.error('게시글 조회 실패:', '데이터 조회에 실패했습니다.');
        setModalMessage('게시글 정보를 불러올 수 없습니다.');
        setInfoModalOpen(true);
        setTimeout(() => {
          routerRef.current.push('/life/app/board');
        }, 2000);
      }
    } catch (error) {
      console.error('게시글 조회 중 오류:', error);
      setModalMessage('게시글 정보를 불러오는 중 오류가 발생했습니다.');
      setInfoModalOpen(true);
      setTimeout(() => {
        routerRef.current.push('/life/app/board');
      }, 2000);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    loadAppBoardData();
  }, [loadAppBoardData]);
  // #endregion

  // #region 변경 감지
  const hasChanges = useMemo(() => {
    return (
      formData.title !== originalData.title ||
      formData.content !== originalData.content ||
      formData.category !== originalData.category ||
      formData.status !== originalData.status ||
      formData.isFixed !== originalData.isFixed
    );
  }, [formData, originalData]);

  const isValid = useMemo(() => {
    if (!hasChanges) return false;
    
    return Boolean(formData.title.trim() && formData.content.trim() && formData.category.trim());
  }, [formData, hasChanges]);
  // #endregion

  // #region 핸들러
  const handleFormChange = useCallback((data: AppBoardFormData) => {
    setFormData(data);
  }, []);

  const handleReset = useCallback(() => {
    if (!hasChanges) return;
    
    setFormData(originalData);
  }, [hasChanges, originalData]);

  const handleSubmit = useCallback(async () => {
    if (!appBoard || !isValid || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // 목업 데이터 처리 - 실제로는 API 호출
      const updateData = {
        ...appBoard,
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      console.log('수정할 게시글 데이터:', updateData);
      alert('게시글이 수정되었습니다. (목업 데이터)');
      
      // 성공 시 원본 데이터 업데이트
      const newData = {
        ...formData,
      };
      setOriginalData(newData);
      setFormData(newData);
      
      // 데이터 다시 로드
      await loadAppBoardData();
      
      setModalMessage('게시글이 성공적으로 수정되었습니다.');
      setSuccessModalOpen(true);
    } catch (error) {
      console.error('게시글 수정 중 오류:', error);
      setModalMessage('게시글 수정 중 오류가 발생했습니다.');
      setInfoModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [appBoard, isValid, isSubmitting, formData, loadAppBoardData]);

  const handleDelete = useCallback(() => {
    if (!appBoard) return;
    
    const confirmMessage = `정말로 게시글 '${appBoard.title}'을(를) 삭제하시겠습니까?`;
    if (!confirm(confirmMessage)) return;
    
    try {
      alert('게시글이 삭제되었습니다. (목업 데이터)');
      setModalMessage('게시글이 삭제되었습니다.');
      setSuccessModalOpen(true);
      setTimeout(() => {
        router.push('/life/app/board');
      }, 2000);
    } catch (error) {
      console.error('게시글 삭제 중 오류:', error);
      setModalMessage('게시글 삭제 중 오류가 발생했습니다.');
      setInfoModalOpen(true);
    }
  }, [appBoard, router]);
  // #endregion

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!appBoard) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">게시글 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title="게시글 상세 정보"
        subtitle={`${appBoard.title}`}
      />

      {/* 게시글 상세 정보 섹션 */}
      <SectionPanel 
        title="게시글 상세 정보"
        subtitle="게시글의 기본 정보를 관리합니다"
        icon={<FileText size={18} />}
      >
          <AppBoardForm
            mode="edit"
            appBoard={appBoard}
            data={formData}
            onChange={handleFormChange}
            disabled={isSubmitting}
            showActions={true}
            onReset={handleReset}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            hasChanges={hasChanges}
            isValid={isValid}
          />
      </SectionPanel>

      {/* 성공 모달 */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="작업 완료"
        size="sm"
        onConfirm={() => setSuccessModalOpen(false)}
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

      {/* 정보 모달 */}
      <Modal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        title="알림"
        size="sm"
        onConfirm={() => setInfoModalOpen(false)}
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-blue-600">알림</h3>
            <p className="text-muted-foreground">{modalMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setInfoModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
