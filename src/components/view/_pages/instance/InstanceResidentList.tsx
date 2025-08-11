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
    router.push(`/parking/occupancy/resident/${residentId}`);
  };

  if (loading) {
    return (
      <div className="p-6 rounded-lg border">
        <div className="flex gap-2 items-center mb-4">
          <Users size={20} className="text-primary" />
          <h3 className="text-lg font-medium">거주민 목록</h3>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="text-muted-foreground">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg border">
      <div className="flex gap-2 items-center mb-4">
        <Users size={20} className="text-primary" />
        <h3 className="text-lg font-medium">거주민 목록</h3>
        <span className="text-sm text-muted-foreground">({residentInstances.length}명)</span>
      </div>

      {residentInstances.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-8 text-center">
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
              className="flex justify-between items-center p-3 rounded-lg border transition-all cursor-pointer border-border hover:border-primary hover:bg-accent/50"
            >
              <div className="flex-1">
                <div className="flex gap-3 items-center">
                  <div className="flex flex-shrink-0 justify-center items-center w-8 h-8 rounded-full bg-primary/10">
                    <User size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate text-foreground">
                      {residentInstance.resident.name}
                    </h4>
                    <p className="text-xs truncate text-muted-foreground">
                      {residentInstance.resident.phone || '전화번호 없음'}
                    </p>
                    {residentInstance.resident.email && (
                      <p className="text-xs truncate text-muted-foreground">
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
              <ChevronRight size={16} className="flex-shrink-0 text-muted-foreground" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
