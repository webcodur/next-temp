/* 메뉴 설명: 페이지 기능 설명 */
'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ArrowLeft, Lock, Unlock, Save } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useAtom } from 'jotai';

import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import AdminForm, { AdminFormData } from './AdminForm';
import AdminPasswordSection from './AdminPasswordSection';
import { getAdminDetail } from '@/services/admin/admin@id_GET';
import { updateAdmin } from '@/services/admin/admin@id_PUT';
import { Admin, ROLE_ID_MAP } from '@/types/admin';
import { currentPageLabelAtom } from '@/store/atom';

export default function AdminDetailPage() {  
  const router = useRouter();
  const params = useParams();
  const adminId = Number(params.id);
  const routerRef = useRef(router);
  routerRef.current = router;
  const [, setCurrentPageLabel] = useAtom(currentPageLabelAtom);
  
  console.log('AdminDetailPage 렌더링, params:', params, 'adminId:', adminId);
  
  // #region 페이지 라벨 설정
  useEffect(() => {
    setCurrentPageLabel({
      label: '관리자 상세',
      href: window.location.pathname,
    });
  }, [setCurrentPageLabel]);
  // #endregion
  
  

  // #region 상태 관리
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AdminFormData>({
    account: '',
    name: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    confirm: '',
  });
  const [originalData, setOriginalData] = useState<AdminFormData>({
    account: '',
    name: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    confirm: '',
  });
  // #endregion

  // #region 데이터 로드
  const loadAdminData = useCallback(async () => {
    console.log('loadAdminData 호출, adminId:', adminId);
    if (!adminId || isNaN(adminId)) {
      console.log('adminId가 유효하지 않음:', adminId);
      return;
    }
    
    setLoading(true);
    try {
      console.log('getAdminDetail API 호출 시작');
      const result = await getAdminDetail({ id: adminId });
      console.log('getAdminDetail API 결과:', result);
      
      if (result.success && result.data) {
        console.log('관리자 데이터 설정:', result.data);
        setAdmin(result.data);
        
        const initialData = {
          account: result.data.account,
          name: result.data.name || '',
          email: result.data.email || '',
          phone: result.data.phone || '',
          role: result.data.role?.name || '',
          password: '',
          confirm: '',
        };
        console.log('초기 폼 데이터:', initialData);
        setFormData(initialData);
        setOriginalData(initialData);
      } else {
        console.error('관리자 조회 실패:', result.errorMsg);
        alert(`관리자 정보를 불러올 수 없습니다: ${result.errorMsg}`);
        routerRef.current.push('/parking/lot-management/admin');
      }
    } catch (error) {
      console.error('관리자 조회 중 오류:', error);
      alert('관리자 정보를 불러오는 중 오류가 발생했습니다.');
      routerRef.current.push('/parking/lot-management/admin');
    } finally {
      setLoading(false);
      console.log('loadAdminData 완료');
    }
  }, [adminId]);

  useEffect(() => {
    console.log('useEffect 실행, loadAdminData 호출');
    loadAdminData();
  }, [loadAdminData]);
  // #endregion

  // #region 변경 감지
  const hasChanges = useMemo(() => {
    if (!isEditMode) return false;
    
    return (
      formData.name !== originalData.name ||
      formData.email !== originalData.email ||
      formData.phone !== originalData.phone ||
      formData.role !== originalData.role
    );
  }, [formData, originalData, isEditMode]);

  const isValid = useMemo(() => {
    if (!isEditMode || !hasChanges) return false;
    
    return formData.name.trim() && formData.role.trim();
  }, [formData, isEditMode, hasChanges]);
  // #endregion

  // #region 핸들러
  const handleBack = () => {
    		router.push('/parking/lot-management/admin');
  };


  const handleLockToggle = useCallback(() => {
    if (isEditMode && hasChanges) {
      const confirmMessage = '편집 중인 내용이 있습니다. 정말로 취소하시겠습니까?';
      if (!confirm(confirmMessage)) return;
    }
    
    setIsEditMode(!isEditMode);
    
    // 편집 모드 해제 시 원래 데이터로 복원
    if (isEditMode) {
      setFormData(originalData);
    }
  }, [isEditMode, hasChanges, originalData]);

  const handleFormChange = useCallback((data: AdminFormData) => {
    setFormData(data);
  }, []);

  const handleSave = useCallback(async () => {
    if (!admin || !isValid || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const updateData: {
        id: number;
        name?: string;
        phone?: string;
        email?: string;
        roleId?: number;
      } = {
        id: admin.id,
      };
      
      // 변경된 필드만 포함
      if (formData.name !== originalData.name) updateData.name = formData.name;
      if (formData.phone !== originalData.phone) updateData.phone = formData.phone;
      if (formData.email !== originalData.email) updateData.email = formData.email;
      if (formData.role !== originalData.role) updateData.roleId = ROLE_ID_MAP[formData.role];

      const result = await updateAdmin(updateData);

      if (result.success) {
        // 성공 시 원본 데이터 업데이트 및 편집 모드 해제
        const newData = {
          ...formData,
          password: '',
          confirm: '',
        };
        setOriginalData(newData);
        setFormData(newData);
        setIsEditMode(false);
        
        // 데이터 다시 로드
        await loadAdminData();
        
        alert('관리자 정보가 성공적으로 수정되었습니다.');
      } else {
        console.error('관리자 수정 실패:', result.errorMsg);
        alert(`관리자 수정에 실패했습니다: ${result.errorMsg}`);
      }
    } catch (error) {
      console.error('관리자 수정 중 오류:', error);
      alert('관리자 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }, [admin, isValid, isSubmitting, formData, originalData, loadAdminData]);
  // #endregion

  console.log('렌더링 상태:', { loading, admin, formData });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">관리자 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const currentMode = isEditMode ? 'edit' : 'view';

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title="관리자 상세 정보"
        subtitle={`${admin.name || admin.account} (${admin.account})`}
        leftActions={
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            title="목록으로"
          >
            <ArrowLeft size={16} />
          </Button>
        }
        rightActions={
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLockToggle}
            disabled={isSubmitting}
            title={isEditMode ? "편집 모드 해제" : "편집 모드 활성화"}
          >
            {isEditMode ? <Unlock size={16} /> : <Lock size={16} />}
          </Button>
        }
      />

      {/* 관리자 상세 정보 섹션 */}
      <div className="p-6 rounded-lg border bg-card border-border">
        
        <AdminForm
          mode={currentMode}
          admin={admin}
          data={formData}
          onChange={handleFormChange}
          disabled={isSubmitting}
        />
      </div>

      {/* 비밀번호 설정 섹션 */}
      <AdminPasswordSection 
        admin={admin} 
        adminId={adminId}
      />

      {/* 저장 버튼 - 우하단 고정 */}
      {isEditMode && hasChanges && (
        <div className="fixed right-6 bottom-6 z-50">
          <Button 
            variant="accent" 
            size="lg"
            onClick={handleSave} 
            disabled={!isValid || isSubmitting}
            title={isSubmitting ? '저장 중...' : '저장'}
            className="shadow-lg"
          >
            <Save size={20} />
          </Button>
        </div>
      )}
    </div>
  );
} 