/*
  파일명: DetailPanel.tsx
  기능: 선택된 노드의 상세 정보를 표시하는 패널 컴포넌트
  책임: 각 조직도 요소의 실제 메뉴와 관련 페이지들을 표시한다.
*/

'use client';

import { Settings, Users, Car, Building2, ChevronRight } from 'lucide-react';
import { getSitemapDataByNodeId } from '../data/sitemapData';

// #region 타입
interface DetailPanelProps {
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
export function DetailPanel({ selectedNodeId }: DetailPanelProps) {
  const sitemapData = selectedNodeId ? getSitemapDataByNodeId(selectedNodeId) : null;
  const IconComponent = selectedNodeId ? getNodeIcon(selectedNodeId) : Settings;
  
  if (!sitemapData) {
    return (
      <div className="p-8 h-full bg-gradient-to-br rounded-xl border shadow-sm from-card to-card/80 border-border/50">
        <div className="pb-6 mb-8 border-b border-border/30">
          <h3 className="text-2xl font-bold text-foreground">사이트맵 정보</h3>
          <p className="mt-2 text-sm text-muted-foreground">시스템의 실제 관리 페이지와 기능을 확인할 수 있습니다.</p>
        </div>
        <div className="flex flex-col justify-center items-center py-20 text-center text-muted-foreground">
          <div className="p-8 mb-8 rounded-2xl border bg-muted/20 border-border/20">
            <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 rounded-full bg-muted/40">
              <Settings className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="mb-4 text-xl font-semibold text-foreground">항목을 선택해주세요</h4>
            <p className="max-w-xs text-sm leading-relaxed">
              왼쪽 다이어그램에서 관리하고자 하는<br />
              시스템 요소를 클릭하면 관련 페이지가 표시됩니다.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-8 h-full bg-gradient-to-br rounded-xl border shadow-sm from-card to-card/80 border-border/50">
      <div className="space-y-8">
        {/* 헤더 */}
        <div className="pb-6 border-b-2 border-primary/20">
          <div className="flex gap-4 items-center mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <IconComponent className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-foreground">{sitemapData.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">관련 관리 페이지들</p>
            </div>
          </div>
          <p className="text-base leading-relaxed text-muted-foreground">{sitemapData.description}</p>
        </div>
        
        {/* 카테고리별 그룹 */}
        <div className="space-y-8">
          {sitemapData.categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-5">
              {/* 카테고리 제목 */}
              <div className="p-6 rounded-xl border-l-4 bg-muted/15 border-primary">
                <h4 className="mb-2 text-xl font-bold text-foreground">{category.name}</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">{category.description}</p>
              </div>
              
              {/* 페이지 목록 */}
              <div className="ml-8 space-y-5">
                {category.pages.map((page, pageIndex) => (
                  <div key={pageIndex} className="space-y-4">
                    {/* 메인 페이지 */}
                    <div 
                      className="group p-6 rounded-lg border-2 bg-background/80 border-border/60 hover:border-primary hover:bg-primary/5 cursor-pointer hover:shadow-lg hover:scale-[1.02] transform"
                      onClick={() => window.open(page.href, '_self')}
                    >
                      {/* 페이지 헤더 */}
                      <div className="mb-5">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-lg font-semibold text-foreground group-hover:text-primary">{page.name}</h5>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{page.description}</p>
                      </div>
                      
                      {/* 상세 탭들 */}
                      {page.detailTabs && page.detailTabs.length > 0 && (
                        <div className="pt-5 border-t border-border/40">
                          <div className="mb-4">
                            <h6 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">상세 탭</h6>
                          </div>
                          <div className="grid gap-3 md:grid-cols-2">
                            {page.detailTabs.map((tab, tabIndex) => (
                              <div key={tabIndex} className="p-4 rounded-lg border bg-muted/20 border-border/30">
                                <h6 className="mb-2 text-sm font-medium text-foreground">{tab.name}</h6>
                                <p className="text-xs leading-relaxed text-muted-foreground">{tab.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* 클릭 힌트 */}
                      <div className="flex justify-end mt-4">
                        <span className="text-xs text-muted-foreground/60 group-hover:text-primary font-medium">
                          클릭하여 페이지 이동
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
  );
}
// #endregion