'use client';

import React from 'react';
import { Users, User, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ResidentInstanceWithResident } from '@/types/instance';

interface InstanceResidentListProps {
  residentInstances?: ResidentInstanceWithResident[];
  loading?: boolean;
}

export default function InstanceResidentList({ 
  residentInstances = [], 
  loading = false 
}: InstanceResidentListProps) {
  const router = useRouter();

  const handleResidentClick = (residentId: number) => {
    router.push(`/system/residents/${residentId}`);
  };

  if (loading) {
    return (
      <div className="border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={20} className="text-primary" />
          <h3 className="text-lg font-medium">거주민 목록</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users size={20} className="text-primary" />
        <h3 className="text-lg font-medium">거주민 목록</h3>
        <span className="text-sm text-muted-foreground">({residentInstances.length}명)</span>
      </div>

      {residentInstances.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <User size={32} className="mb-3 text-muted-foreground" />
          <h4 className="mb-1 text-sm font-medium text-foreground">
            등록된 거주민이 없습니다
          </h4>
          <p className="text-xs text-muted-foreground">
            이 호실에 거주민을 추가해보세요
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {residentInstances.map((residentInstance) => (
            <div
              key={residentInstance.id}
              onClick={() => handleResidentClick(residentInstance.resident.id)}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary hover:bg-accent/50 cursor-pointer transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {residentInstance.resident.name}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {residentInstance.resident.phone || '전화번호 없음'}
                    </p>
                    {residentInstance.resident.email && (
                      <p className="text-xs text-muted-foreground truncate">
                        {residentInstance.resident.email}
                      </p>
                    )}
                  </div>
                </div>
                {residentInstance.status && (
                  <div className="mt-2 ml-11">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      residentInstance.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {residentInstance.status === 'ACTIVE' ? '활성' : residentInstance.status}
                    </span>
                  </div>
                )}
                {residentInstance.memo && (
                  <div className="mt-1 ml-11">
                    <p className="text-xs text-muted-foreground">
                      {residentInstance.memo}
                    </p>
                  </div>
                )}
              </div>
              <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
