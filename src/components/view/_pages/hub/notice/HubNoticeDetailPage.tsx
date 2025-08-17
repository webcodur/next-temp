/**
 * @path src/components/view/global/hub/notice/HubNoticeDetailPage.tsx
 * @description 주차 SAAS 서버 공지사항 상세 페이지
 * @responsibility 공지사항 상세 조회 및 수정
 */

'use client';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';

import { Save, RotateCcw, Pin, AlertCircle, Paperclip, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// UI 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { Badge } from '@/components/ui/ui-effects/badge/Badge';
import { toast } from '@/components/ui/ui-effects/toast/Toast';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';

// Input 컴포넌트
// import Editor from '@/components/ui/ui-input/editor/Editor'; // TODO: TinyMCE 이슈 해결 후 다시 활성화
import { SimpleTextArea } from '@/components/ui/ui-input/simple-input/SimpleTextArea';

// 타입
import { Notice } from '@/types/notice';

// #region 카테고리 옵션
const categoryOptions = [
  { value: 'general', label: '일반' },
  { value: 'update', label: '업데이트' },
  { value: 'maintenance', label: '점검' },
  { value: 'event', label: '이벤트' },
  { value: 'emergency', label: '긴급' },
];
// #endregion

// #region 목업 데이터
const mockNotice: Notice = {
  id: 1,
  title: '[긴급] 시스템 점검 안내',
  content: `안녕하세요, 주차 SAAS 서비스 운영팀입니다.

더 나은 서비스 제공을 위해 아래와 같이 시스템 점검을 실시할 예정입니다.

■ 점검 일시
- 2025년 8월 15일(금) 새벽 2:00 ~ 4:00 (약 2시간)

■ 점검 내용
- 데이터베이스 최적화
- 서버 보안 업데이트
- 신규 기능 배포 준비

■ 점검 영향
- 점검 시간 동안 서비스 이용이 제한됩니다.
- 진행 중인 작업은 점검 전에 저장해 주시기 바랍니다.

■ 문의사항
- 이메일: support@parking-saas.com
- 전화: 1588-1234

이용에 불편을 드려 죄송합니다.
감사합니다.`,
  category: 'emergency',
  isImportant: true,
  isPinned: true,
  viewCount: 1250,
  author: '시스템 관리자',
  tags: ['점검', '긴급', '시스템'],
  startDate: '2025-08-10',
  endDate: '2025-08-15',
  attachments: [
    {
      id: 1,
      fileName: '시스템_점검_상세안내.pdf',
      fileSize: 1024000,
      fileUrl: '/attachments/system-maintenance-guide.pdf',
      uploadedAt: '2025-08-01T10:00:00',
    }
  ],
  createdAt: '2025-08-01T10:00:00',
  updatedAt: '2025-08-01T10:00:00',
};
// #endregion

export default function HubNoticeDetailPage() {
  // const router = useRouter();
  const params = useParams();
  const noticeId = params?.id as string;

  // #region 상태 관리
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<Notice | null>(null);
  const [formData, setFormData] = useState<Notice | null>(null);
  const [originalData, setOriginalData] = useState<Notice | null>(null);
  // #endregion

  // #region 데이터 로드
  useEffect(() => {
    const loadNoticeDetail = async () => {
      setLoading(true);
      try {
        // TODO: 실제 API 호출로 대체
        // const result = await getNotice(Number(noticeId));
        // if (result.success && result.data) {
        //   setData(result.data);
        //   setFormData(result.data);
        //   setOriginalData(result.data);
        // }
        
        // 목업 데이터 사용
        setData(mockNotice);
        setFormData(mockNotice);
        setOriginalData(mockNotice);
      } catch (error) {
        console.error('공지사항 상세 로드 실패:', error);
        toast.error('공지사항을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (noticeId) {
      loadNoticeDetail();
    }
  }, [noticeId]);
  // #endregion

  // #region 변경 감지
  const hasChanges = useMemo(() => {
    if (!originalData || !formData) return false;
    
    return (
      originalData.title !== formData.title ||
      originalData.content !== formData.content ||
      originalData.category !== formData.category ||
      originalData.isImportant !== formData.isImportant ||
      originalData.isPinned !== formData.isPinned ||
      JSON.stringify(originalData.tags) !== JSON.stringify(formData.tags) ||
      originalData.startDate !== formData.startDate ||
      originalData.endDate !== formData.endDate
    );
  }, [originalData, formData]);

  const isValid = useMemo(() => {
    if (!formData) return false;
    return formData.title.trim() !== '' && formData.content.trim() !== '';
  }, [formData]);
  // #endregion

  // #region 이벤트 핸들러


  const handleFieldChange = useCallback((field: keyof Notice, value: string | string[] | boolean) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  }, []);

  const handleReset = useCallback(() => {
    if (originalData) {
      setFormData(originalData);
      toast.info('원본 데이터로 복구되었습니다.');
    }
  }, [originalData]);

  const handleSubmit = useCallback(async () => {
    if (!formData || !hasChanges || !isValid) return;

    setSubmitting(true);
    try {
      // TODO: 실제 API 호출로 대체
      // const updateData: NoticeUpdateDto = {
      //   title: formData.title,
      //   content: formData.content,
      //   category: formData.category,
      //   isImportant: formData.isImportant,
      //   isPinned: formData.isPinned,
      //   tags: formData.tags,
      //   startDate: formData.startDate,
      //   endDate: formData.endDate,
      // };
      // const result = await updateNotice(Number(noticeId), updateData);
      
      // 목업: 성공 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('공지사항이 수정되었습니다.');
      setOriginalData(formData);
      setData(formData);
    } catch (error) {
      console.error('공지사항 수정 실패:', error);
      toast.error('공지사항 수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  }, [formData, hasChanges, isValid]);

  const handleTagsChange = useCallback((value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    handleFieldChange('tags', tags);
  }, [handleFieldChange]);
  // #endregion

  if (loading) {
    return <div className="flex justify-center items-center h-96">로딩 중...</div>;
  }

  if (!data || !formData) {
    return <div className="flex justify-center items-center h-96">공지사항을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="공지사항 상세"
        subtitle={`공지사항의 상세 정보를 조회하고 관리합니다. | 조회수 ${data.viewCount.toLocaleString()}회`}
        rightActions={
          <div className="flex gap-2 items-center">
            {formData.isPinned && <Pin className="w-5 h-5 text-accent" />}
            {formData.isImportant && <AlertCircle className="w-5 h-5 text-danger" />}
            <Badge variant={formData.category === 'emergency' ? 'destructive' : 'default'}>
              {categoryOptions.find(opt => opt.value === formData.category)?.label}
            </Badge>
          </div>
        }
      />

      {/* 폼 */}
      <div className="p-6 rounded-lg border bg-card border-border">
        {(() => {
          const fields: GridFormFieldSchema[] = [
            // 시스템 정보
            {
              id: 'noticeId',
              label: '공지사항 ID',
              htmlFor: 'notice-id',
              component: (
                <input
                  id="notice-id"
                  type="text"
                  value={data.id.toString()}
                  disabled
                  className="p-2 w-full rounded-md border border-border bg-muted"
                />
              )
            },
            {
              id: 'author',
              label: '작성자',
              htmlFor: 'author',
              component: (
                <input
                  id="author"
                  type="text"
                  value={data.author}
                  disabled
                  className="p-2 w-full rounded-md border border-border bg-muted"
                />
              )
            },
            {
              id: 'createdAt',
              label: '등록일',
              htmlFor: 'created-at',
              component: (
                <input
                  id="created-at"
                  type="text"
                  value={format(new Date(data.createdAt), 'yyyy-MM-dd HH:mm:ss', { locale: ko })}
                  disabled
                  className="p-2 w-full rounded-md border border-border bg-muted"
                />
              )
            },
            {
              id: 'updatedAt',
              label: '수정일',
              htmlFor: 'updated-at',
              component: (
                <input
                  id="updated-at"
                  type="text"
                  value={format(new Date(data.updatedAt), 'yyyy-MM-dd HH:mm:ss', { locale: ko })}
                  disabled
                  className="p-2 w-full rounded-md border border-border bg-muted"
                />
              )
            },
            // 편집 가능한 필드
            {
              id: 'title',
              label: '제목',
              required: true,
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
              htmlFor: 'category',
              component: (
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
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
              component: (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block mb-1 text-sm font-medium">시작일</label>
                    <input
                      type="date"
                      value={formData.startDate || ''}
                      onChange={(e) => handleFieldChange('startDate', e.target.value)}
                      className="p-2 w-full rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 text-sm font-medium">종료일</label>
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
              component: (
                <div className="space-y-3">
                  <label className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={formData.isImportant}
                      onChange={(e) => handleFieldChange('isImportant', e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span>중요 공지</span>
                  </label>
                  <label className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPinned}
                      onChange={(e) => handleFieldChange('isPinned', e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span>상단 고정</span>
                  </label>
                </div>
              )
            }
          ];

          // 첨부파일이 있는 경우 추가
          if (data.attachments && data.attachments.length > 0) {
            fields.push({
              id: 'attachments',
              label: '첨부파일',
              component: (
                <div className="space-y-2">
                  {data.attachments.map((file) => (
                    <div key={file.id} className="flex gap-2 items-center text-sm">
                      <Paperclip className="w-4 h-4" />
                      <a href={file.fileUrl} className="text-blue-600 hover:underline">
                        {file.fileName}
                      </a>
                      <span className="text-gray-500">
                        ({(file.fileSize / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  ))}
                </div>
              )
            });
          }

          return (
            <SectionPanel 
              title="공지사항 상세 정보" 
              subtitle="공지사항의 세부 내용을 확인하고 수정할 수 있습니다."
              icon={<Bell size={18} />}
            >
              <GridFormAuto fields={fields} />
            </SectionPanel>
          );
        })()}

        {/* 버튼 */}
        <div className="flex gap-2 justify-end mt-4">
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={!hasChanges || submitting}
            title="원본 데이터로 복구"
          >
            <RotateCcw className="mr-2 w-4 h-4" />
            초기화
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!hasChanges || !isValid || submitting}
            title="변경사항 저장"
          >
            <Save className="mr-2 w-4 h-4" />
            {submitting ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </div>
  );
}