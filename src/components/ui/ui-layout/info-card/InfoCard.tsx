'use client';

import React from 'react';
import { ChevronRight, MessageSquare } from 'lucide-react';

// 필드 정보 타입
export interface InfoCardField {
  icon: React.ReactElement;
  value: string;
  show?: boolean;
}

// 배지 정보 타입
export interface InfoCardBadge {
  text: string;
  variant?: 'default' | 'success' | 'info' | 'warning' | 'danger';
}

// InfoCard Props 타입
export interface InfoCardProps {
  // 헤더
  headerIcon: React.ReactElement;
  title: string;
  customTitle?: React.ReactElement; // 커스텀 제목 컴포넌트 (번호판 등)
  badges?: InfoCardBadge[];
  
  // 바디 (2열 구조)
  leftColumn: InfoCardField[];
  rightColumn: InfoCardField[];
  
  // 푸터
  memo?: string;
  
  // 인터랙션
  onClick?: () => void;
  clickable?: boolean;
  
  // 스타일링
  className?: string;
}

export default function InfoCard({
  headerIcon,
  title,
  customTitle,
  badges = [],
  leftColumn,
  rightColumn,
  memo,
  onClick,
  clickable = true,
  className = ''
}: InfoCardProps) {
  const getBadgeVariantClass = (variant: InfoCardBadge['variant'] = 'default') => {
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
      onClick={clickable ? onClick : undefined}
      className={`
        relative p-4 rounded-lg border border-border neu-raised transition-all duration-200
        ${clickable ? 'cursor-pointer group hover:shadow-md' : ''}
        ${className}
      `}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex flex-shrink-0 justify-center items-center w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
            {React.cloneElement(headerIcon, { 
              size: 18, 
              className: 'text-primary' 
            })}
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-0">
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
        {clickable && (
          <ChevronRight size={16} className="flex-shrink-0 transition-colors text-muted-foreground group-hover:text-primary" />
        )}
      </div>

      {/* 바디 - 2열 구조 */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {/* 좌측 열 */}
        <div className="space-y-2">
          {leftColumn.map((field, index) => 
            field.show !== false && (
              <div key={index} className="flex items-center gap-2 text-muted-foreground">
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
              <div key={index} className="flex items-center gap-2 text-muted-foreground">
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
          <div className="flex items-start gap-2 p-2 text-xs bg-gray-50 rounded text-muted-foreground">
            <MessageSquare size={12} className="flex-shrink-0 mt-0.5" />
            <span>{memo}</span>
          </div>
        </div>
      )}
    </div>
  );
}
