'use client';

import React from 'react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from './Tooltip';
import { Button } from '@/components/ui/ui-input/button/Button';
import { useTranslations } from '@/hooks/useI18n';

export default function TooltipExample() {
  const t = useTranslations();

  return (
    <TooltipProvider>
      <div className="container py-10">
        <h1 className="mb-8 text-3xl font-bold">{t('툴팁_제목')}</h1>
        <div className="flex flex-col space-y-4">
          <Tooltip>
            <TooltipTrigger>
              <Button>{t('툴팁_기본툴팁')}</Button>
            </TooltipTrigger>
            <TooltipContent>
              {t('툴팁_기본설명')}
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger>
              <Button>{t('툴팁_위치바뀜')}</Button>
            </TooltipTrigger>
            <TooltipContent>
              {t('툴팁_위치설명')}
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger>
              <Button>{t('툴팁_지연툴팁')}</Button>
            </TooltipTrigger>
            <TooltipContent>
              {t('툴팁_지연설명')}
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger>
              <Button>{t('툴팁_긴내용버튼')}</Button>
            </TooltipTrigger>
            <TooltipContent>
              {t('툴팁_긴내용')}
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger>
              <Button>{t('툴팁_코드복사')}</Button>
            </TooltipTrigger>
            <TooltipContent>
              {t('툴팁_복사설명')}
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger>
              <Button disabled>{t('툴팁_비활성버튼')}</Button>
            </TooltipTrigger>
            <TooltipContent>
              {t('툴팁_비활성설명')}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
} 