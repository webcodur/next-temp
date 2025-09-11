/* 메뉴 설명: 페이지 기능 설명 */
'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { UserCog, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';


import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import AdminForm, { AdminFormData } from './AdminForm';
import AdminPasswordSection from './AdminPasswordSection';
import { getAdminDetail } from '@/services/admin/admin@id_GET';
import { updateAdmin } from '@/services/admin/admin@id_PUT';
import { Admin, ROLE_ID_MAP } from '@/types/admin';


interface Props {
  adminId: number;
}

export default function AdminDetailPage({ adminId }: Props) {  
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  // #region 상태 관리
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
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
  
  // 모달 상태
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  // #endregion

  // #region 데이터 로드
  const loadAdminData = useCallback(async () => {
    if (!adminId || isNaN(adminId)) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await getAdminDetail({ id: adminId });
      
      if (result.success && result.data) {
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
        setFormData(initialData);
        setOriginalData(initialData);
      } else {
        console.error('관리자 조회 실패:', '데이터 조회에 실패했습니다.');
        setModalMessage('관리자 정보를 불러올 수 없습니다.');
        setTimeout(() => {
          routerRef.current.push('/parking/lot/admin');
        }, 2000);
      }
    } catch (error) {
      console.error('관리자 조회 중 오류:', error);
      setModalMessage('관리자 정보를 불러오는 중 오류가 발생했습니다.');
      setTimeout(() => {
        routerRef.current.push('/parking/lot/admin');
      }, 2000);
    } finally {
      setLoading(false);
    }
  }, [adminId]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);
  // #endregion

  // #region 변경 감지
  const hasChanges = useMemo(() => {
    return (
      formData.name !== originalData.name ||
      formData.email !== originalData.email ||
      formData.phone !== originalData.phone ||
      formData.role !== originalData.role
    );
  }, [formData, originalData]);

  const isValid = useMemo(() => {
    if (!hasChanges) return false;
    
    return Boolean(formData.name.trim() && formData.role.trim());
  }, [formData, hasChanges]);
  // #endregion

  // #region 핸들러


  const handleFormChange = useCallback((data: AdminFormData) => {
    setFormData(data);
  }, []);

  const handleReset = useCallback(() => {
    if (!hasChanges) return;
    
    setFormData(originalData);
  }, [hasChanges, originalData]);

  const handleSubmit = useCallback(async () => {
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
        // 성공 시 원본 데이터 업데이트
        const newData = {
          ...formData,
          password: '',
          confirm: '',
        };
        setOriginalData(newData);
        setFormData(newData);
        
        // 데이터 다시 로드
        await loadAdminData();
        
        setModalMessage('관리자 정보가 성공적으로 수정되었습니다.');
        setSuccessModalOpen(true);
      } else {
        console.error('관리자 수정 실패:', '데이터 수정에 실패했습니다.');
        setModalMessage('관리자 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('관리자 수정 중 오류:', error);
      setModalMessage('관리자 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }, [admin, isValid, isSubmitting, formData, originalData, loadAdminData]);

  const handleDelete = useCallback(() => {
    if (!admin) return;
    
    const confirmMessage = `정말로 관리자 '${admin.name || admin.account}'를 삭제하시겠습니까?`;
    if (!confirm(confirmMessage)) return;
    
    // TODO: 삭제 API 호출 구현
    setModalMessage('삭제 기능은 아직 구현되지 않았습니다.');
    setInfoModalOpen(true);
  }, [admin]);
  // #endregion

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

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title="관리자 상세 정보"
        subtitle={`${admin.name || admin.account} (${admin.account})`}
      />

      {/* 관리자 상세 정보 섹션 */}
      <SectionPanel 
        title="관리자 상세 정보"
        subtitle="관리자의 기본 정보를 관리합니다"
        icon={<UserCog size={18} />}
      >
          <AdminForm
            mode="edit"
            admin={admin}
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
      </SectionPanel>

      {/* 비밀번호 설정 섹션 */}
      <SectionPanel 
        title="비밀번호 설정"
        subtitle="관리자 계정의 비밀번호를 변경합니다"
        icon={<Lock size={18} />}
      >
        <AdminPasswordSection 
          admin={admin} 
          adminId={adminId}
        />
      </SectionPanel>

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

      {/* 오류 모달 제거됨 - 통합 모듈에서 처리 */}

      {/* 정보 모달 */}
      <Modal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        title="알림"
        size="sm"
        onConfirm={() => setInfoModalOpen(false)}
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-blue-600">알림</h3>
            <p className="text-muted-foreground">{modalMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setInfoModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 