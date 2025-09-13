/*
  파일명: DetailModal.tsx
  기능: 선택된 노드의 상세 정보를 Modal로 표시하는 컴포넌트
  책임: 각 조직도 요소의 실제 메뉴와 관련 페이지들을 Modal 형태로 표시한다.
*/

'use client';

import { useTranslations, useLocale } from '@/hooks/ui-hooks/useI18n';
import { Settings, Users, Car, Building2, ChevronRight, ChevronLeft } from 'lucide-react';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { getSitemapDataByNodeId } from '../data/sitemapData';

// #region 타입
interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNodeId?: string;
}
// #endregion

// #region 헬퍼 함수
const getNodeIcon = (nodeId: string) => {
  switch (nodeId) {
    case 'parking':
      return Car;
    case 'room':
      return Building2;
    case 'person':
      return Users;
    case 'vehicle':
      return Car;
    default:
      return Settings;
  }
};
// #endregion

// #region 렌더링
export function DetailModal({ isOpen, onClose, selectedNodeId }: DetailModalProps) {
  const t = useTranslations();
  const { isRTL } = useLocale();
  const sitemapData = selectedNodeId ? getSitemapDataByNodeId(selectedNodeId) : null;
  const IconComponent = selectedNodeId ? getNodeIcon(selectedNodeId) : Settings;
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;
  
  if (!sitemapData) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={t('모달_사이트맵정보')}
        size="lg"
        className="max-h-[80vh] overflow-hidden"
      >
        <div className="flex flex-col justify-center items-center py-8 text-center text-muted-foreground">
          <div className="p-4 mb-4 rounded-lg border bg-muted/20 border-border/20">
            <div className="flex justify-center items-center mx-auto mb-3 w-12 h-12 rounded-full bg-muted/40">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </div>
            <h4 className="mb-2 text-base font-semibold text-foreground">{t('모달_선택요청제목')}</h4>
            <p className="max-w-xs text-sm leading-relaxed">
              {t('모달_선택요청설명')}
            </p>
          </div>
        </div>
      </Modal>
    );
  }
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      className="max-h-[80vh] overflow-hidden"
    >
      <div className="max-h-[70vh] overflow-y-auto">
        <div className="space-y-4">
          {/* 헤더 */}
          <div className="pb-3 border-b border-primary/20">
            <div className={`flex gap-3 items-center mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="p-2 rounded-lg bg-primary/10">
                <IconComponent className="w-4 h-4 text-primary" />
              </div>
              <div className={isRTL ? 'text-end' : 'text-start'}>
                <h3 className="text-xl font-bold text-foreground">{sitemapData.title}</h3>
                <p className="text-sm text-muted-foreground">{t('모달_관련페이지')}</p>
              </div>
            </div>
            <p className={`text-sm leading-relaxed text-muted-foreground ${isRTL ? 'text-end' : 'text-start'}`}>{sitemapData.description}</p>
          </div>
          
          {/* 카테고리별 그룹 */}
          <div className="space-y-4">
            {sitemapData.categories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-3">
                {/* 카테고리 제목 */}
                <div className={`p-3 rounded-lg bg-muted/15 border-primary ${isRTL ? 'border-r-4' : 'border-l-4'}`}>
                  <h4 className={`mb-1 text-base font-bold text-foreground ${isRTL ? 'text-end' : 'text-start'}`}>{category.name}</h4>
                  <p className={`text-sm leading-relaxed text-muted-foreground ${isRTL ? 'text-end' : 'text-start'}`}>{category.description}</p>
                </div>
                
                {/* 페이지 목록 */}
                <div className={`space-y-3 ${isRTL ? 'mr-4' : 'ml-4'}`}>
                  {category.pages.map((page, pageIndex) => (
                    <div key={pageIndex} className="space-y-2">
                      {/* 메인 페이지 */}
                      <div 
                        className="p-3 rounded-lg border cursor-pointer group bg-background/80 border-border/60 hover:border-primary hover:bg-primary/5 hover:shadow-md"
                        onClick={() => window.open(page.href, '_self')}
                      >
                        {/* 페이지 헤더 */}
                        <div className="mb-3">
                          <div className={`flex justify-between items-center mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <h5 className={`text-sm font-semibold text-foreground group-hover:text-primary ${isRTL ? 'text-end' : 'text-start'}`}>{page.name}</h5>
                            <ChevronIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                          </div>
                          <p className={`text-sm leading-relaxed text-muted-foreground ${isRTL ? 'text-end' : 'text-start'}`}>{page.description}</p>
                        </div>
                        
                        {/* 상세 탭들 */}
                        {page.detailTabs && page.detailTabs.length > 0 && (
                          <div className="pt-3 border-t border-border/40">
                            <div className="mb-2">
                              <h6 className={`text-sm font-semibold tracking-wide uppercase text-muted-foreground ${isRTL ? 'text-end' : 'text-start'}`}>{t('모달_상세탭')}</h6>
                            </div>
                            <div className="grid gap-2 md:grid-cols-2">
                              {page.detailTabs.map((tab, tabIndex) => (
                                <div key={tabIndex} className="p-2 rounded-md border bg-muted/20 border-border/30">
                                  <h6 className={`mb-1 text-sm font-medium text-foreground ${isRTL ? 'text-end' : 'text-start'}`}>{tab.name}</h6>
                                  <p className={`text-sm leading-relaxed text-muted-foreground ${isRTL ? 'text-end' : 'text-start'}`}>{tab.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* 클릭 힌트 */}
                        <div className={`flex mt-2 ${isRTL ? 'justify-start' : 'justify-end'}`}>
                          <span className="text-sm font-medium text-muted-foreground/60 group-hover:text-primary">
                            {t('모달_페이지이동')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
// #endregion
