'use client';

import React from 'react';
import { MessageSquare, Eye, Unplug, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/ui-input/button/Button';

// 필드 정보 타입
export interface InstanceItemCardField {
  icon: React.ReactElement<{ size?: number; className?: string }>;
  value: string;
  show?: boolean;
}

// 배지 정보 타입
export interface InstanceItemCardBadge {
  text: string;
  variant?: 'default' | 'success' | 'info' | 'warning' | 'danger';
}

// 커스텀 액션 버튼 타입
export interface CustomAction {
  icon: React.ReactElement<{ size?: number; className?: string }>;
  onClick: () => void;
  title: string;
  hoverClass: string;
}

// InstanceItemCard Props 타입
export interface InstanceItemCardProps {
  // 헤더
  headerIcon: React.ReactElement<{ size?: number; className?: string }>;
  title: string;
  customTitle?: React.ReactElement; // 커스텀 제목 컴포넌트 (번호판 등)
  badges?: InstanceItemCardBadge[];
  
  // 바디 (2열 구조)
  leftColumn: InstanceItemCardField[];
  rightColumn: InstanceItemCardField[];
  
  // 푸터
  memo?: string;
  
  // 인터랙션 (레거시 - 사용하지 않음)
  onClick?: () => void;
  clickable?: boolean;
  
  // 액션 버튼들
  onDetail?: () => void;
  onExclude?: () => void;
  onDelete?: () => void;
  customActions?: CustomAction[];
  
  // 스타일링
  className?: string;
}

export default function InstanceItemCard({
  headerIcon,
  title,
  customTitle,
  badges = [],
  leftColumn,
  rightColumn,
  memo,
  onDetail,
  onExclude,
  onDelete,
  customActions = [],
  className = ''
}: InstanceItemCardProps) {
  const getBadgeVariantClass = (variant: InstanceItemCardBadge['variant'] = 'default') => {
    const variants = {
      default: 'bg-gray-100 text-gray-600',
      success: 'bg-green-100 text-green-700',
      info: 'bg-blue-100 text-blue-700',
      warning: 'bg-yellow-100 text-yellow-700',
      danger: 'bg-red-100 text-red-700',
    };
    return variants[variant];
  };

  return (
    <div
      className={`relative p-4 rounded-lg border transition-all duration-200  border-border neu-elevated group hover:shadow-md ${className}`}
    >
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-1 gap-3 items-center min-w-0">
          <div className="flex flex-shrink-0 justify-center items-center w-10 h-10 rounded-full transition-colors bg-primary/10 group-hover:bg-primary/20">
            {React.cloneElement(headerIcon, { 
              size: 18, 
              className: 'text-primary' 
            })}
          </div>
          <div className="flex flex-1 gap-2 items-center min-w-0">
            {customTitle ? (
              customTitle
            ) : (
              <h4 className="text-base font-semibold truncate text-foreground">
                {title}
              </h4>
            )}
            {badges.map((badge, index) => (
              <span 
                key={index}
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeVariantClass(badge.variant)}`}
              >
                {badge.text}
              </span>
            ))}
          </div>
        </div>
        
        {/* 액션 버튼들 */}
        <div className="flex gap-1 items-center">
          {customActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              className={`w-8 h-8 min-w-8 rounded-full transition-colors text-muted-foreground border-none neu-flat hover:neu-hover ${action.hoverClass}`}
              title={action.title}
            >
              {React.cloneElement(action.icon, { size: 14 })}
            </Button>
          ))}
          {onDetail && (
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDetail();
              }}
              className="w-8 h-8 min-w-8 rounded-full transition-colors border-none neu-flat hover:neu-hover hover:bg-blue-100 text-muted-foreground hover:text-blue-600"
              title="상세 보기"
              icon={Eye}
            />
          )}
          {onExclude && (
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onExclude();
              }}
              className="w-8 h-8 min-w-8 rounded-full transition-colors border-none neu-flat hover:neu-hover hover:bg-orange-100 text-muted-foreground hover:text-orange-600"
              title="제외"
              icon={Unplug}
            />
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="w-8 h-8 min-w-8 rounded-full transition-colors border-none neu-flat hover:neu-hover hover:bg-red-100 text-muted-foreground hover:text-red-600"
              title="삭제"
              icon={Trash2}
            />
          )}
        </div>
      </div>

      {/* 바디 - 2열 구조 */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {/* 좌측 열 */}
        <div className="space-y-2">
          {leftColumn.map((field, index) => 
            field.show !== false && (
              <div key={index} className="flex gap-2 items-center text-muted-foreground">
                {React.cloneElement(field.icon, { 
                  size: 12, 
                  className: 'flex-shrink-0' 
                })}
                <span className="truncate">{field.value}</span>
              </div>
            )
          )}
        </div>

        {/* 우측 열 */}
        <div className="space-y-2">
          {rightColumn.map((field, index) => 
            field.show !== false && (
              <div key={index} className="flex gap-2 items-center text-muted-foreground">
                {React.cloneElement(field.icon, { 
                  size: 12, 
                  className: 'flex-shrink-0' 
                })}
                <span className="truncate">{field.value}</span>
              </div>
            )
          )}
        </div>
      </div>
      
      {/* 메모 영역 */}
      {memo && (
        <div className="pt-3 mt-3 border-t border-border/50">
          <div className="flex gap-2 items-start p-2 text-xs bg-gray-50 rounded text-muted-foreground">
            <MessageSquare size={12} className="flex-shrink-0 mt-0.5" />
            <span>{memo}</span>
          </div>
        </div>
      )}
    </div>
  );
}
