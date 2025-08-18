'use client';

import React from 'react';
import GridForm from './GridForm';
import GridFormRow from './GridFormRow';
import GridFormLabel from './GridFormLabel';
import GridFormContent from './GridFormContent';
import GridFormRules from './GridFormRules';
import GridFormViewSelector from './GridFormViewSelector';
import type { GridFormAutoProps, GridFormViewMode } from './types';

// #region GridFormAuto 컴포넌트
const GridFormAuto = React.forwardRef<
  HTMLDivElement,
  GridFormAutoProps & React.HTMLAttributes<HTMLDivElement>
>(({
  fields,
  viewMode: initialViewMode = 'default',
  sequenceWidth,
  rulesWidth,
  gap,
  colorVariant,
  className,
  topRightActions,
  bottomLeftActions,
  bottomRightActions,
  showViewSelector = true,
  ...props
}, ref) => {
  // 뷰 모드 상태 관리를 GridFormAuto에서 담당
  const [viewMode, setViewMode] = React.useState<GridFormViewMode>(initialViewMode);
  
  // 필드명 길이 디버깅용 - 개발 환경에서만
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const fieldLabels = fields.map(field => field.label);
      const fieldRules = fields.map(field => field.rules).filter(Boolean);
      console.log('📋 GridFormAuto Field Analysis:', {
        fieldCount: fields.length,
        labels: fieldLabels,
        rulesCount: fieldRules.length,
        hasRules: fieldRules.length > 0,
        viewMode: viewMode,
        defaultRulesWidth: rulesWidth || '280px'
      });
    }
  }, [fields, viewMode, rulesWidth]);

  // 필드 변경 시 GridForm 강제 재마운트를 위한 key 생성
  const formKey = React.useMemo(() => {
    return `gridform-${fields.length}-${fields.map(f => f.label).join('-')}-${viewMode}`;
  }, [fields, viewMode]);

  return (
    <>
      {/* 뷰 선택기 (필요한 경우에만) */}
      {showViewSelector && (
        <div className="flex justify-end mb-4">
          <GridFormViewSelector
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
      )}

      <GridForm
        key={formKey}
        ref={ref}
        viewMode={viewMode}
        sequenceWidth={sequenceWidth}
        rulesWidth={rulesWidth}
        gap={gap}
        colorVariant={colorVariant}
        className={className}
        topRightActions={topRightActions}
        bottomLeftActions={bottomLeftActions}
        bottomRightActions={bottomRightActions}
        {...props}
      >
        {fields.map((field) => (
          <GridFormRow key={field.id} align={field.align}>
            <GridFormLabel 
              required={field.required}
              htmlFor={field.htmlFor || field.id}
            >
              {field.label}
            </GridFormLabel>
            
            <GridFormContent className="justify-start items-start">
              <div className="w-full text-start">
                {field.component}
              </div>
            </GridFormContent>
            
            {field.rules && (
              <GridFormRules>
                {field.rules}
              </GridFormRules>
            )}
          </GridFormRow>
        ))}
      </GridForm>
    </>
  );
});

GridFormAuto.displayName = 'GridFormAuto';
// #endregion

export default GridFormAuto;
