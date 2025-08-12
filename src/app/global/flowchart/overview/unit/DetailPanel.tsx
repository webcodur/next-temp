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
      <div className="p-4 h-full rounded-lg border shadow-sm bg-card border-border/50">
        <div className="pb-3 mb-4 border-b border-border/30">
          <h3 className="text-lg font-bold text-foreground">사이트맵 정보</h3>
          <p className="mt-1 text-sm text-muted-foreground">시스템의 실제 관리 페이지와 기능을 확인할 수 있습니다.</p>
        </div>
        <div className="flex flex-col justify-center items-center py-8 text-center text-muted-foreground">
          <div className="p-4 mb-4 rounded-lg border bg-muted/20 border-border/20">
            <div className="flex justify-center items-center mx-auto mb-3 w-12 h-12 rounded-full bg-muted/40">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </div>
            <h4 className="mb-2 text-base font-semibold text-foreground">항목을 선택해주세요</h4>
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
    <div className="p-4 h-full rounded-lg border shadow-sm bg-card border-border/50">
      <div className="space-y-4">
        {/* 헤더 */}
        <div className="pb-3 border-b border-primary/20">
          <div className="flex gap-3 items-center mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <IconComponent className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{sitemapData.title}</h3>
              <p className="text-sm text-muted-foreground">관련 관리 페이지들</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{sitemapData.description}</p>
        </div>
        
        {/* 카테고리별 그룹 */}
        <div className="space-y-4">
          {sitemapData.categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-3">
              {/* 카테고리 제목 */}
              <div className="p-3 rounded-lg border-l-4 bg-muted/15 border-primary">
                <h4 className="mb-1 text-base font-bold text-foreground">{category.name}</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">{category.description}</p>
              </div>
              
              {/* 페이지 목록 */}
              <div className="ml-4 space-y-3">
                {category.pages.map((page, pageIndex) => (
                  <div key={pageIndex} className="space-y-2">
                    {/* 메인 페이지 */}
                    <div 
                      className="group p-3 rounded-lg border bg-background/80 border-border/60 hover:border-primary hover:bg-primary/5 cursor-pointer hover:shadow-md transition-all"
                      onClick={() => window.open(page.href, '_self')}
                    >
                      {/* 페이지 헤더 */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="text-sm font-semibold text-foreground group-hover:text-primary">{page.name}</h5>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{page.description}</p>
                      </div>
                      
                      {/* 상세 탭들 */}
                      {page.detailTabs && page.detailTabs.length > 0 && (
                        <div className="pt-3 border-t border-border/40">
                          <div className="mb-2">
                            <h6 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">상세 탭</h6>
                          </div>
                          <div className="grid gap-2 md:grid-cols-2">
                            {page.detailTabs.map((tab, tabIndex) => (
                              <div key={tabIndex} className="p-2 rounded-md border bg-muted/20 border-border/30">
                                <h6 className="mb-1 text-sm font-medium text-foreground">{tab.name}</h6>
                                <p className="text-sm leading-relaxed text-muted-foreground">{tab.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* 클릭 힌트 */}
                      <div className="flex justify-end mt-2">
                        <span className="text-sm text-muted-foreground/60 group-hover:text-primary font-medium">
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