'use client';

import React from 'react';
import { Users, User, Phone, Mail, Calendar, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ResidentInstanceWithResident } from '@/types/instance';
import InfoCard, { InfoCardField, InfoCardBadge } from '@/components/ui/ui-layout/info-card/InfoCard';

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
      <div className="p-6 border rounded-lg">
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
    <div className="p-6 border rounded-lg">
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
        <div className="space-y-2">
          {residentInstances.map((residentInstance) => {
            // 배지 정보
            const badges: InfoCardBadge[] = [];
            if (residentInstance.status) {
              badges.push({
                text: residentInstance.status === 'ACTIVE' ? '활성' : residentInstance.status,
                variant: residentInstance.status === 'ACTIVE' ? 'success' : 'default'
              });
            }

            // 좌측 열 데이터
            const leftColumn: InfoCardField[] = [
              {
                icon: <Phone />,
                value: residentInstance.resident.phone || '전화번호 없음'
              },
              {
                icon: <Mail />,
                value: residentInstance.resident.email || '',
                show: !!residentInstance.resident.email
              }
            ];

            // 우측 열 데이터
            const rightColumn: InfoCardField[] = [
              {
                icon: <UserCheck />,
                value: residentInstance.resident.gender === 'M' ? '남성' : 
                       residentInstance.resident.gender === 'F' ? '여성' : 
                       residentInstance.resident.gender || '',
                show: !!residentInstance.resident.gender
              },
              {
                icon: <Calendar />,
                value: residentInstance.resident.birthDate 
                  ? new Date(residentInstance.resident.birthDate).toLocaleDateString('ko-KR')
                  : '',
                show: !!residentInstance.resident.birthDate
              }
            ];

            return (
              <InfoCard
                key={residentInstance.id}
                headerIcon={<User />}
                title={residentInstance.resident.name}
                badges={badges}
                leftColumn={leftColumn}
                rightColumn={rightColumn}
                memo={residentInstance.memo || undefined}
                onClick={() => handleResidentClick(residentInstance.resident.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
