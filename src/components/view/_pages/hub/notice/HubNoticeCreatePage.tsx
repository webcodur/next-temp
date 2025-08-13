/**
 * @path src/components/view/global/hub/notice/HubNoticeCreatePage.tsx
 * @description 주차 SAAS 서버 공지사항 생성 페이지
 * @responsibility 새로운 공지사항 작성 및 등록
 */

'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

// UI 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import { toast } from '@/components/ui/ui-effects/toast/Toast';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';

// Input 컴포넌트
// import Editor from '@/components/ui/ui-input/editor/Editor'; // TODO: TinyMCE 이슈 해결 후 다시 활성화
import { SimpleTextArea } from '@/components/ui/ui-input/simple-input/SimpleTextArea';

// 타입
import { NoticeCreateDto, NoticeCategory } from '@/types/notice';

// #region 카테고리 옵션
const categoryOptions = [
  { value: 'general', label: '일반' },
  { value: 'update', label: '업데이트' },
  { value: 'maintenance', label: '점검' },
  { value: 'event', label: '이벤트' },
  { value: 'emergency', label: '긴급' },
];
// #endregion

export default function HubNoticeCreatePage() {
  const router = useRouter();

  // #region 상태 관리
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<NoticeCreateDto>({
    title: '',
    content: '',
    category: 'general',
    isImportant: false,
    isPinned: false,
    tags: [],
    startDate: '',
    endDate: '',
  });
  // #endregion

  // #region 유효성 검사
  const isValid = useMemo(() => {
    return formData.title.trim() !== '' && formData.content.trim() !== '';
  }, [formData]);
  // #endregion

  // #region 이벤트 핸들러
  const handleCancel = useCallback(() => {
    router.push('/global/hub/notice');
  }, [router]);

  const handleFieldChange = useCallback((field: keyof NoticeCreateDto, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleTagsChange = useCallback((value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    handleFieldChange('tags', tags);
  }, [handleFieldChange]);

  const handleSubmit = useCallback(async () => {
    if (!isValid) return;

    setSubmitting(true);
    try {
      // TODO: 실제 API 호출로 대체
      // const result = await createNotice(formData);
      // if (result.success) {
      //   toast.success('공지사항이 등록되었습니다.');
      //   router.push('/global/hub/notice');
      // }
      
      // 목업: 성공 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('공지사항이 등록되었습니다.');
      router.push('/global/hub/notice');
    } catch (error) {
      console.error('공지사항 등록 실패:', error);
      toast.error('공지사항 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  }, [isValid, router]);
  // #endregion

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="공지사항 등록"
        subtitle="새로운 공지사항을 등록합니다."
        leftActions={
          <Button
            variant="ghost"
            onClick={handleCancel}
            title="취소하고 뒤로가기"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        }
      />

      {/* 폼 */}
      <div className="bg-card rounded-lg border border-border p-6">
        {(() => {
          const fields: GridFormFieldSchema[] = [
            {
              id: 'title',
              label: '제목',
              required: true,
              rules: '공지사항 제목 (2-200자)',
              htmlFor: 'title',
              component: (
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="공지사항 제목을 입력하세요"
                  className="p-2 w-full rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              )
            },
            {
              id: 'category',
              label: '카테고리',
              rules: '일반/업데이트/점검/이벤트/긴급 선택',
              htmlFor: 'category',
              component: (
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleFieldChange('category', e.target.value as NoticeCategory)}
                  className="p-2 w-full rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )
            },
            {
              id: 'content',
              label: '내용',
              required: true,
              rules: '공지사항 내용 (템스트/마크다운)',
              align: 'start',
              component: (
                <div>
                  {/* TODO: 에디터 TinyMCE 이슈 해결 후 다시 활성화 */}
                  <SimpleTextArea
                    value={formData.content}
                    onChange={(value) => handleFieldChange('content', value)}
                    placeholder="공지사항 내용을 입력하세요"
                    rows={12}
                    className="min-h-[300px]"
                  />
                </div>
              )
            },
            {
              id: 'tags',
              label: '태그',
              rules: '콤마(,)로 구분하여 입력',
              htmlFor: 'tags',
              component: (
                <input
                  id="tags"
                  type="text"
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="쉼표로 구분하여 입력 (예: 공지, 중요, 시스템)"
                  className="p-2 w-full rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )
            },
            {
              id: 'period',
              label: '게시 기간',
              rules: '시작일/종료일 설정',
              component: (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">시작일</label>
                    <input
                      type="date"
                      value={formData.startDate || ''}
                      onChange={(e) => handleFieldChange('startDate', e.target.value)}
                      className="p-2 w-full rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">종료일</label>
                    <input
                      type="date"
                      value={formData.endDate || ''}
                      onChange={(e) => handleFieldChange('endDate', e.target.value)}
                      className="p-2 w-full rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              )
            },
            {
              id: 'options',
              label: '옵션',
              rules: '중요/고정 공지 옵션',
              component: (
                <div className="space-y-3">
                  <label className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={formData.isImportant || false}
                      onChange={(e) => handleFieldChange('isImportant', e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span>중요 공지</span>
                  </label>
                  <label className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPinned || false}
                      onChange={(e) => handleFieldChange('isPinned', e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span>상단 고정</span>
                  </label>
                </div>
              )
            }
          ];

          return <GridFormAuto fields={fields} />;
        })()}

        {/* 버튼 */}
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="ghost"
            onClick={handleCancel}
            disabled={submitting}
            title="취소"
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            title="공지사항 등록"
          >
            <Save className="w-4 h-4 mr-2" />
            {submitting ? '등록 중...' : '등록'}
          </Button>
        </div>
      </div>
    </div>
  );
}