'use client';

import React from 'react';
import GridForm from './GridForm';
import GridFormRow from './GridFormRow';
import GridFormLabel from './GridFormLabel';
import GridFormContent from './GridFormContent';
import GridFormRules from './GridFormRules';
import type { GridFormAutoProps } from './types';

// #region GridFormAuto 컴포넌트
const GridFormAuto = React.forwardRef<
  HTMLDivElement,
  GridFormAutoProps & React.HTMLAttributes<HTMLDivElement>
>(({
  fields,
  viewMode: initialViewMode,
  sequenceWidth,
  rulesWidth,
  gap,
  colorVariant,
  className,
  topRightActions,
  bottomLeftActions,
  bottomRightActions,
  ...props
}, ref) => {
  return (
    <GridForm
      ref={ref}
      viewMode={initialViewMode}
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
          
          <GridFormContent>
            {field.component}
          </GridFormContent>
          
          {field.rules && (
            <GridFormRules>
              {field.rules}
            </GridFormRules>
          )}
        </GridFormRow>
      ))}
    </GridForm>
  );
});

GridFormAuto.displayName = 'GridFormAuto';
// #endregion

export default GridFormAuto;
