/* 
  파일명: /components/view/menu-search/SelectedMenuCard/SelectedMenuCard.tsx
  기능: 선택된 메뉴 표시 카드
  책임: 현재 선택된 메뉴 정보를 시각적으로 표시
*/

'use client';

import { Search, ArrowRight, Check } from 'lucide-react';
import type { SelectedMenuCardProps } from './menu-search.type';

export function SelectedMenuCard({ selectedResult }: SelectedMenuCardProps) {
  // #region 렌더링
  return (
    <div className="mb-6">
      <div className={`p-5 border rounded-lg transition-all ${
        selectedResult 
          ? 'border-primary bg-primary-0' 
          : 'border-border bg-counter-2'
      }`}>
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            {selectedResult ? (
              <div className="space-y-2">
                                {/* 선택된 메뉴 경로 */}
                <div className="flex gap-2 items-center">
                  <h3 className="text-lg font-semibold text-foreground">
                    {selectedResult.botLabel}
                  </h3>
                </div>
                
                {/* 전체 경로 표시 */}
                <div className="flex gap-2 items-center text-sm text-muted-foreground">
                  <div className="flex gap-1 items-center">
                    <span>
                      {selectedResult.topLabel}
                    </span>
                    <ArrowRight size={14} />
                    <span>
                      {selectedResult.midLabel}
                    </span>
                    <ArrowRight size={14} />
                    <span>
                      {selectedResult.botLabel}
                    </span>
                  </div>
                </div>
                
                {/* 경로 정보 */}
                <div className="text-xs text-muted-foreground">
                  페이지: {selectedResult.href}
                </div>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <Search className="w-5 h-5 text-muted-foreground" />
                <div>
                  <span className="text-lg font-semibold text-foreground">메뉴를 검색해주세요</span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    메뉴명을 입력하여 원하는 페이지를 빠르게 찾아보세요
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* 상태 아이콘 */}
          <div className="relative">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
              selectedResult 
                ? 'bg-primary-1 text-primary' 
                : 'bg-counter-3 text-muted-foreground'
            }`}>
              {selectedResult ? (
                <Check className="w-6 h-6" />
              ) : (
                <Search className="w-6 h-6" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // #endregion
}
