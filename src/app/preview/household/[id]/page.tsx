'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, Home, Users, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { getHouseholdDetail } from '@/services/household/household@id_GET';
import { deleteHousehold } from '@/services/household/household@id_DELETE';
import type { Household } from '@/types/household';

// #region Main Component
export default function HouseholdDetailPage() {
  const router = useRouter();
  const params = useParams();
  const householdId = parseInt(params.id as string);
  
  const [household, setHousehold] = useState<Household | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHousehold = async () => {
      try {
        const result = await getHouseholdDetail(householdId);
        
        if (result.success && result.data) {
          setHousehold(result.data as Household);
        } else {
          console.error('세대 정보 조회 실패:', result.errorMsg);
          setHousehold(null);
        }
      } catch (error) {
        console.error('세대 정보 조회 중 오류:', error);
        setHousehold(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHousehold();
  }, [householdId]);

  const handleEdit = () => {
    router.push(`/preview/household/${householdId}/edit`);
  };

  const handleDelete = async () => {
    if (confirm('정말로 이 세대를 삭제하시겠습니까?')) {
      try {
        const result = await deleteHousehold(householdId);
        
        if (result.success) {
          alert('세대가 삭제되었습니다.');
          router.push('/preview/household');
        } else {
          alert(`세대 삭제 실패: ${result.errorMsg}`);
        }
      } catch (error) {
        console.error('세대 삭제 중 오류:', error);
        alert('세대 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const getHouseholdTypeLabel = (type: string) => {
    switch (type) {
      case 'GENERAL': return '일반세대';
      case 'TEMP': return '임시세대';
      case 'COMMERCIAL': return '상업세대';
      default: return '알 수 없음';
    }
  };

  const getHouseholdTypeBadge = (type: string) => {
    const baseClasses = 'inline-flex px-3 py-1 text-sm font-semibold rounded-full';
    switch (type) {
      case 'GENERAL': return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'TEMP': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'COMMERCIAL': return `${baseClasses} bg-purple-100 text-purple-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!household) {
    return (
      <div className="p-6 space-y-6 font-multilang animate-fadeIn">
        <div className="p-6 rounded-xl neu-flat">
          <div className="flex gap-4 items-center">
            <button
              onClick={() => router.push('/preview/household')}
              className="p-3 rounded-xl transition-all duration-200 neu-raised hover:animate-click-feedback"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">세대를 찾을 수 없습니다</h1>
              <p className="mt-1 text-sm text-muted-foreground">요청하신 세대 정보가 존재하지 않습니다</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 font-multilang animate-fadeIn">
      {/* 페이지 헤더 */}
      <div className="p-6 rounded-xl neu-flat">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <button
              onClick={() => router.push('/preview/household')}
              className="p-3 rounded-xl transition-all duration-200 neu-raised hover:animate-click-feedback"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">세대 상세 정보</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {household.address1Depth} {household.address2Depth}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="flex gap-2 items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 neu-raised hover:animate-click-feedback"
            >
              <Edit className="w-4 h-4" />
              수정
            </button>
            <button
              onClick={handleDelete}
              className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-red-600 rounded-xl transition-all duration-200 neu-raised hover:animate-click-feedback"
            >
              <Trash2 className="w-4 h-4" />
              삭제
            </button>
          </div>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 기본 정보 */}
        <div className="p-6 rounded-xl neu-elevated">
          <div className="flex gap-3 items-center mb-6">
            <div className="p-3 rounded-xl neu-flat">
              <Home className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">기본 정보</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">세대 ID</label>
              <p className="mt-1 text-lg text-foreground">#{household.id}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">주소</label>
              <p className="mt-1 text-lg text-foreground">
                {household.address1Depth} {household.address2Depth}
                {household.address3Depth && ` ${household.address3Depth}`}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">세대 유형</label>
              <div className="mt-2">
                <span className={getHouseholdTypeBadge(household.householdType)}>
                  {getHouseholdTypeLabel(household.householdType)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 인스턴스 정보 */}
        <div className="p-6 rounded-xl neu-elevated">
          <div className="flex gap-3 items-center mb-6">
            <div className="p-3 rounded-xl neu-flat">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">인스턴스 정보</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">인스턴스 수</label>
              <p className="mt-1 text-lg text-foreground">{household.instances?.length || 0}개</p>
            </div>
          </div>
        </div>

        {/* 등록 정보 */}
        <div className="p-6 rounded-xl neu-elevated">
          <div className="flex gap-3 items-center mb-6">
            <div className="p-3 rounded-xl neu-flat">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">등록 정보</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">등록일</label>
              <p className="mt-1 text-lg text-foreground">{new Date(household.createdAt).toLocaleDateString('ko-KR')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">수정일</label>
              <p className="mt-1 text-lg text-foreground">{new Date(household.updatedAt).toLocaleDateString('ko-KR')}</p>
            </div>
          </div>
        </div>

        {/* 메모 */}
        {household.memo && (
          <div className="p-6 rounded-xl neu-elevated">
            <h2 className="mb-4 text-xl font-semibold text-foreground">메모</h2>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{household.memo}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// #endregion 