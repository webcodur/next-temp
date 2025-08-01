'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import type { HouseholdInstance } from '@/types/household';

interface HouseholdInstancesListProps {
  householdId: number | undefined;
  instances: HouseholdInstance[];
}

export default function HouseholdInstancesList({
  householdId,
  instances,
}: HouseholdInstancesListProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">입주세대</h2>
        {householdId && (
          <Link
            href={`/parking/household-management/household-instance/create?householdId=${householdId}`}
            className="flex gap-2 items-center px-3 py-1 text-sm rounded transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
            title="새 세대 배정"
          >
            <Plus className="w-4 h-4" />
            세대 배정
          </Link>
        )}
      </div>
      
      {instances.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          현재 입주한 세대가 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {instances.map((instance) => (
            <div key={instance.id} className="p-3 bg-gray-50 rounded border">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{instance.instanceName || '세대명 없음'}</h3>
                  <p className="text-sm text-gray-600">
                    입주일: {instance.startDate ? new Date(instance.startDate).toLocaleDateString() : '-'}
                  </p>
                  {instance.endDate && (
                    <p className="text-sm text-gray-600">
                      예정 퇴거일: {new Date(instance.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link 
                    href={`/parking/household-management/household-instance/${instance.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                    title="세대 상세 정보"
                  >
                    상세
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}