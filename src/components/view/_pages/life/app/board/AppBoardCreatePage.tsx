/* 메뉴 설명: 앱 게시판 생성 페이지 */
'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Info } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import AppBoardForm, { AppBoardFormData } from './AppBoardForm';
import { getAppBoardById, getNextAppBoardId } from '@/data/mockAppBoardData';
import { ENUM_APP_BOARD_STATUS, APP_BOARD_CATEGORIES } from '@/types/appBoard';

export default function AppBoardCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const copyFromId = searchParams.get('copyFrom');

  // #region 복사 기능
  const loadAppBoardForCopy = useCallback(async (boardId: number) => {
    setCopyLoading(true);
    try {
      const board = getAppBoardById(boardId);
      
      if (board) {
        const copiedData = {
          title: `[복사] ${board.title}`,
          content: board.content,
          category: board.category,
          status: ENUM_APP_BOARD_STATUS.DRAFT, // 복사 시 임시저장으로
          isFixed: false, // 고정은 복사하지 않음
        };

        setFormData(copiedData);
        setBaselineData(copiedData); // 복사 완료 후를 새로운 기준점으로 설정
        
        setCopyInfoMessage(`"${board.title}" 게시글을 복사하여 신규 게시글을 등록합니다. 제목과 내용을 수정해주세요.`);
      } else {
        console.error('게시글 조회 실패:', '데이터 조회에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 조회 중 오류:', error);
    } finally {
      setCopyLoading(false);
    }
  }, []);

  useEffect(() => {
    if (copyFromId) {
      const boardId = Number(copyFromId);
      if (!isNaN(boardId)) {
        loadAppBoardForCopy(boardId);
      }
    }
  }, [copyFromId, loadAppBoardForCopy]);
  // #endregion

  // #region 폼 상태
  const initialFormData: AppBoardFormData = {
    title: '',
    content: '',
    category: APP_BOARD_CATEGORIES[0].value, // 첫 번째 카테고리 기본값
    status: ENUM_APP_BOARD_STATUS.DRAFT,
    isFixed: false,
  };

  const [formData, setFormData] = useState<AppBoardFormData>(initialFormData);
  const [baselineData, setBaselineData] = useState<AppBoardFormData>(initialFormData); // 비교 기준점
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  
  const [copyInfoMessage, setCopyInfoMessage] = useState('');
  // #endregion

  // #region 검증
  const isValid = useMemo(() => {
    return (
      formData.title.trim() &&
      formData.content.trim() &&
      formData.category.trim()
    );
  }, [formData]);

  // 변경사항 확인
  const hasChanges = useMemo(() => {
    return (
      formData.title !== baselineData.title ||
      formData.content !== baselineData.content ||
      formData.category !== baselineData.category ||
      formData.status !== baselineData.status ||
      formData.isFixed !== baselineData.isFixed
    );
  }, [formData, baselineData]);
  // #endregion

  // #region 이벤트 핸들러
  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // 목업 데이터 처리 - 실제로는 API 호출
      const newId = getNextAppBoardId();
      const createData = {
        id: newId,
        ...formData,
        viewCount: 0,
        authorName: '관리자', // 임시
        authorId: 1, // 임시
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('생성할 게시글 데이터:', createData);
      alert('게시글이 생성되었습니다. (목업 데이터)');
      
      // 성공 시 목록 페이지로 이동
      router.push('/life/app/board');
    } catch (error) {
      console.error('게시글 생성 중 오류:', error);
      alert('게시글 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (data: AppBoardFormData) => {
    setFormData(data);
  };

  const handleReset = () => {
    setFormData(baselineData);
    // 완전 초기화가 아닌 경우 복사 메시지 유지
    if (JSON.stringify(baselineData) === JSON.stringify(initialFormData)) {
      setCopyInfoMessage(''); // 완전 초기화인 경우만 메시지 제거
    }
  };
  // #endregion

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title="공지사항 추가"
        subtitle="새로운 앱 공지사항을 작성합니다"
      />

      {/* 메인 콘텐츠 */}
      <SectionPanel 
        title="공지사항 정보"
      >
        <div className="flex flex-col gap-4">
          {/* 복사 정보 안내 */}
          {copyInfoMessage && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex gap-2 items-center text-blue-700">
                <Info size={20} />
                <span className="font-medium">{copyInfoMessage}</span>
              </div>
            </div>
          )}

          {/* 폼 */}
          {copyLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-muted-foreground">복사할 정보를 불러오는 중...</div>
            </div>
          ) : (
            <AppBoardForm
              mode="create"
              data={formData}
              onChange={handleFormChange}
              disabled={isSubmitting || copyLoading}
              showActions={true}
              onSubmit={handleSubmit}
              onReset={handleReset}
              hasChanges={hasChanges}
              isValid={Boolean(isValid && !copyLoading)}
            />
          )}
        </div>
      </SectionPanel>
    </div>
  );
}
