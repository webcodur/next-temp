'use client';

import React from 'react';
import { Home, Plus, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import { ResidentInstanceWithInstance } from '@/types/resident';

interface CurrentResidenceInfoProps {
  currentResidence: ResidentInstanceWithInstance | undefined;
  onCreateRelation: () => void;
}

export default function CurrentResidenceInfo({ 
  currentResidence, 
  onCreateRelation 
}: CurrentResidenceInfoProps) {
  return (
    <div className="p-6 rounded-lg border bg-card border-border">
      <div className="flex gap-2 items-center mb-4">
        <Home size={20} />
        <h2 className="text-lg font-semibold text-foreground">
          현재 거주지 정보
        </h2>
      </div>

      {currentResidence?.instance ? (
        (() => {
          const currentResidenceFields: GridFormFieldSchema[] = [
            {
              id: 'instanceId',
              label: '호실 ID',
              component: (
                <div className="flex items-center px-3 py-2 bg-blue-50 rounded-md border border-blue-200">
                  <span className="font-medium text-blue-700">
                    #{currentResidence.instance.id}
                  </span>
                </div>
              ),
              rules: 'API에서 관리하는 호실 고유 식별자'
            },
            {
              id: 'address',
              label: '주소 정보',
              component: (
                <div className="flex gap-2 items-center px-3 py-2 bg-green-50 rounded-md border border-green-200">
                  <MapPin size={16} className="text-green-600" />
                  <span className="text-foreground">
                    {`${currentResidence.instance.address1Depth} ${currentResidence.instance.address2Depth} ${currentResidence.instance.address3Depth || ''}`.trim()}
                  </span>
                </div>
              ),
              rules: '1차/2차/3차 주소 정보'
            },
            {
              id: 'instanceType',
              label: '호실 타입',
              component: (
                <div className="flex items-center px-3 py-2 bg-purple-50 rounded-md border border-purple-200">
                  <span className="font-medium text-purple-700">
                    {(() => {
                      const typeMap = {
                        GENERAL: '일반',
                        TEMP: '임시',
                        COMMERCIAL: '상업',
                      };
                      return typeMap[currentResidence.instance.instanceType as keyof typeof typeMap] || currentResidence.instance.instanceType;
                    })()}
                  </span>
                </div>
              ),
              rules: 'GENERAL/TEMP/COMMERCIAL 타입'
            },
            {
              id: 'relationInfo',
              label: '관계 정보',
              component: (
                <div className="px-3 py-2 bg-amber-50 rounded-md border border-amber-200">
                  <div className="text-amber-800">
                    <div className="font-medium">관계 ID: #{currentResidence.id}</div>
                    {currentResidence.memo && (
                      <div className="mt-1 text-sm">메모: {currentResidence.memo}</div>
                    )}
                    {currentResidence.createdAt && (
                      <div className="mt-1 text-xs text-amber-600">
                        생성일: {new Date(currentResidence.createdAt).toLocaleString('ko-KR')}
                      </div>
                    )}
                  </div>
                </div>
              ),
              rules: '거주자-호실 관계 상세 정보'
            }
          ];

          return (
            <div className="space-y-4">
              <GridFormAuto 
                fields={currentResidenceFields}
                gap="16px"
                bottomRightActions={null}
              />
            </div>
          );
        })()
      ) : (
        <div className="py-8 text-center">
          <p className="mb-4 text-muted-foreground">현재 연결된 거주지가 없습니다.</p>
          <Button 
            variant="primary" 
            size="default"
            onClick={onCreateRelation}
            title="호실 관계 생성"
          >
            <Plus size={16} />
            거주지 연결
          </Button>
        </div>
      )}
    </div>
  );
}
