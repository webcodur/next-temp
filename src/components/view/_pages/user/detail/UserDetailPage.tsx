/* 메뉴 설명: 사용자 상세 페이지 */
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/ui-input/button/Button';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Tabs from '@/components/ui/ui-layout/tabs/Tabs';
import UserForm, { UserFormData } from './UserBasic';
import UserConnection from '../connection/UserConnection';
import UserHistoryPage from '../history/UserHistoryPage';
import { createUserTabs } from '../_shared/userTabs';
import { getUserDetail } from '@/services/users/users@id_GET';
import { updateUser } from '@/services/users/users@id_PATCH';
import { deleteUser } from '@/services/users/users@id_DELETE';
import { UserDetail } from '@/types/user';

export default function UserDetailPage() {  
  const router = useRouter();
  const params = useParams();
  const userId = Number(params.id);
  
  // #region 상태 관리
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState('basic');
  
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    gender: '',
    emergencyContact: '',
    memo: '',
  });
  const [originalData, setOriginalData] = useState<UserFormData>({
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    gender: '',
    emergencyContact: '',
    memo: '',
  });
  
  // 모달 상태
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  // #endregion

  // #region 탭 설정
  const tabs = createUserTabs();
  // #endregion

  // #region 데이터 로드
  const loadUserData = useCallback(async () => {
    if (!userId || isNaN(userId)) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await getUserDetail(userId);
      
      if (result.success && result.data) {
        setUser(result.data);
        
        const initialData: UserFormData = {
          name: result.data.name,
          phone: result.data.phone || '',
          email: result.data.email || '',
          birthDate: result.data.birthDate || '',
          gender: (result.data.gender as 'M' | 'F') || '',
          emergencyContact: result.data.emergencyContact || '',
          memo: result.data.memo || '',
        };
        setFormData(initialData);
        setOriginalData(initialData);
      } else {
        console.error('사용자 조회 실패:', '데이터 조회에 실패했습니다.');
        setModalMessage('사용자 정보를 불러올 수 없습니다.');
        setTimeout(() => {
          router.push('/parking/occupancy/user');
        }, 2000);
      }
    } catch (error) {
      console.error('사용자 조회 중 오류:', error);
      setModalMessage('사용자 정보를 불러오는 중 오류가 발생했습니다.');
      setTimeout(() => {
        router.push('/parking/occupancy/user');
      }, 2000);
    } finally {
      setLoading(false);
    }
  }, [userId, router]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);
  // #endregion

  // #region 변경 감지
  const hasChanges = useMemo(() => {
    return (
      formData.name !== originalData.name ||
      formData.phone !== originalData.phone ||
      formData.email !== originalData.email ||
      formData.birthDate !== originalData.birthDate ||
      formData.gender !== originalData.gender ||
      formData.emergencyContact !== originalData.emergencyContact ||
      formData.memo !== originalData.memo
    );
  }, [formData, originalData]);

  const isValid = useMemo(() => {
    if (!hasChanges) return false;
    
    return Boolean(formData.name.trim());
  }, [formData, hasChanges]);
  // #endregion

  // #region 핸들러
  const handleFormChange = useCallback((data: UserFormData) => {
    setFormData(data);
  }, []);

  const handleReset = useCallback(() => {
    if (!hasChanges) return;
    
    setFormData(originalData);
  }, [hasChanges, originalData]);

  const handleSubmit = useCallback(async () => {
    if (!user || !isValid || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const updateData: {
        name?: string;
        phone?: string;
        email?: string;
        birthDate?: string;
        gender?: 'M' | 'F';
        emergencyContact?: string;
        memo?: string;
      } = {};
      
      // 변경된 필드만 포함
      if (formData.name !== originalData.name) updateData.name = formData.name;
      if (formData.phone !== originalData.phone) updateData.phone = formData.phone;
      if (formData.email !== originalData.email) updateData.email = formData.email;
      if (formData.birthDate !== originalData.birthDate) updateData.birthDate = formData.birthDate;
      if (formData.gender !== originalData.gender) updateData.gender = formData.gender as 'M' | 'F';
      if (formData.emergencyContact !== originalData.emergencyContact) updateData.emergencyContact = formData.emergencyContact;
      if (formData.memo !== originalData.memo) updateData.memo = formData.memo;

      const result = await updateUser(user.id, updateData);

      if (result.success) {
        // 성공 시 원본 데이터 업데이트
        const newData = { ...formData };
        setOriginalData(newData);
        setFormData(newData);
        
        // 데이터 다시 로드
        await loadUserData();
        
        setModalMessage('사용자 정보가 성공적으로 수정되었습니다.');
        setSuccessModalOpen(true);
      } else {
        console.error('사용자 수정 실패:', '대상 작업에 실패했습니다.');
        setModalMessage('사용자 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('사용자 수정 중 오류:', error);
      setModalMessage('사용자 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }, [user, isValid, isSubmitting, formData, originalData, loadUserData]);

  const handleDelete = useCallback(() => {
    setDeleteConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!user) return;
    try {
      const result = await deleteUser(user.id);
      if (result.success) {
        setModalMessage('사용자가 성공적으로 삭제되었습니다.');
        setSuccessModalOpen(true);
        setTimeout(() => {
          router.push('/parking/occupancy/user');
        }, 1500);
      } else {
        setModalMessage('사용자 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('사용자 삭제 중 오류:', error);
      setModalMessage('사용자 삭제 중 오류가 발생했습니다.');
    } finally {
      setDeleteConfirmOpen(false);
    }
  }, [user, router]);


  // #endregion

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">사용자 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title="사용자 상세 정보"
        subtitle={`${user.name} - ${user.phone || '전화번호 없음'}`}
        hasChanges={hasChanges}
      />

      {/* 탭과 콘텐츠 */}
      <div className="flex flex-col">
        <Tabs
          tabs={tabs}
          activeId={activeTab}
          onTabChange={setActiveTab}
        />

        {/* 콘텐츠 영역 */}
        <div className="p-6 rounded-b-lg border-b-2 border-s-2 border-e-2 border-border bg-background">
          {/* 기본 정보 탭 */}
          {activeTab === 'basic' && (
            <UserForm
              mode="edit"
              user={user}
              data={formData}
              onChange={handleFormChange}
              disabled={isSubmitting}
              showActions={true}
              onReset={handleReset}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              hasChanges={hasChanges}
              isValid={isValid}
            />
          )}

          {/* 세대 연결 탭 */}
          {activeTab === 'connection' && (
            <div className="space-y-6">
              <UserConnection
                user={user}
                onDataChange={loadUserData}
                onOperationComplete={(success, message) => {
                  setModalMessage(message);
                  if (success) {
                    setSuccessModalOpen(true);
                  }
                }}
              />
            </div>
          )}

          {/* 거주 히스토리 탭 */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <UserHistoryPage
                user={user}
              />
            </div>
          )}
        </div>
      </div>

      {/* 성공 모달 */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="작업 완료"
        size="sm"
        onConfirm={() => setSuccessModalOpen(false)}
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-green-600">성공</h3>
            <p className="text-muted-foreground">{modalMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setSuccessModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>

      
      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="사용자 삭제 확인"
        size="md"
        onConfirm={handleDeleteConfirm}
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 삭제하시겠습니까?</h3>
            <p className="text-muted-foreground">이 작업은 되돌릴 수 없습니다. 사용자 정보가 영구적으로 삭제됩니다.</p>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)}>취소</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>삭제</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}