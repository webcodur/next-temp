/* 메뉴 설명: 페이지 기능 설명 */
'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Info } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import AdminForm, { AdminFormData } from './AdminForm';
import { createAdmin } from '@/services/admin/admin_POST';
import { getAdminDetail } from '@/services/admin/admin@id_GET';
import { ROLE_ID_MAP, ROLE_NAME_MAP } from '@/types/admin';


// Admin 타입: 생성 시 필요한 필드만 명시
export interface AdminInput {
  account: string;
  password: string;
  name: string;
  email?: string;
  phone?: string;
  roleId: number;
}

export default function AdminCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const copyFromId = searchParams.get('copyFrom');

  


  // #region 복사 기능
  const loadAdminForCopy = useCallback(async (adminId: number) => {
    setCopyLoading(true);
    try {
      const result = await getAdminDetail({ id: adminId });
      
      if (result.success && result.data) {
        const admin = result.data;
        
        // role 매핑을 안전하게 처리
        let roleName = '';
        if (admin.role) {
          // 서버에서 받아온 role.name이 ROLE_ID_MAP에 있는지 확인
          if (admin.role.name && ROLE_ID_MAP[admin.role.name]) {
            roleName = admin.role.name;
          } 
          // 없다면 role ID를 통해 ROLE_NAME_MAP에서 찾기
          else if (admin.role.id && ROLE_NAME_MAP[admin.role.id]) {
            roleName = ROLE_NAME_MAP[admin.role.id];
          }
          // 그래도 없다면 기본값
          else {
            console.warn('매핑되지 않은 role:', admin.role);
            roleName = '운영자'; // 기본값
          }
        }
        
        const copiedData = {
          account: '', // 빈값 - 유니크해야 함
          name: admin.name || '',
          email: admin.email || '', // 수정 폼과 동일하게 복사
          phone: admin.phone || '', // 수정 폼과 동일하게 복사
          role: roleName,
          password: '',
          confirm: '',
        };

        setFormData(copiedData);
        setBaselineData(copiedData); // 복사 완료 후를 새로운 기준점으로 설정
        
        setCopyInfoMessage(`${admin.name || admin.account}(${roleName}) 정보를 복사하여 신규 데이터를 등록합니다. 계정명과 비밀번호는 새로 입력해주세요.`);
      } else {
        console.error('관리자 조회 실패:', result.errorMsg);
        setErrorMessage(`복사할 관리자 정보를 불러올 수 없습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('관리자 조회 중 오류:', error);
      setErrorMessage('복사할 관리자 정보를 불러오는 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setCopyLoading(false);
    }
  }, []);

  useEffect(() => {
    if (copyFromId) {
      const adminId = Number(copyFromId);
      if (!isNaN(adminId)) {
        loadAdminForCopy(adminId);
      }
    }
  }, [copyFromId, loadAdminForCopy]);
  // #endregion

  // #region 폼 상태
  const initialFormData: AdminFormData = {
    account: '',
    name: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    confirm: '',
  };

  const [formData, setFormData] = useState<AdminFormData>(initialFormData);
  const [baselineData, setBaselineData] = useState<AdminFormData>(initialFormData); // 비교 기준점
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  
  // 모달 상태
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copyInfoMessage, setCopyInfoMessage] = useState('');
  // #endregion

  // #region 검증
  const isValid = useMemo(() => {
    return (
      formData.account.trim() &&
      formData.password.trim() &&
      formData.confirm.trim() &&
      formData.name.trim() &&
      formData.role.trim() &&
      formData.password === formData.confirm
    );
  }, [formData]);

  // 변경사항 확인
  const hasChanges = useMemo(() => {
    return (
      formData.account !== baselineData.account ||
      formData.name !== baselineData.name ||
      formData.email !== baselineData.email ||
      formData.phone !== baselineData.phone ||
      formData.role !== baselineData.role ||
      formData.password !== baselineData.password ||
      formData.confirm !== baselineData.confirm
    );
  }, [formData, baselineData]);
  // #endregion

  // #region 이벤트 핸들러
  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const createData = {
        account: formData.account,
        password: formData.password,
        name: formData.name,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        roleId: ROLE_ID_MAP[formData.role],
      };

      const result = await createAdmin(createData);

      if (result.success) {
        // 성공 시 목록 페이지로 이동
        router.push('/parking/lot/admin');
      } else {
        // 에러 처리
        console.error('관리자 생성 실패:', result.errorMsg);
        setErrorMessage(`관리자 생성에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('관리자 생성 중 오류:', error);
      setErrorMessage('관리자 생성 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (data: AdminFormData) => {
    setFormData(data);
  };

  const handleReset = () => {
    setFormData(baselineData);
    // 완전 초기화가 아닌 경우 복사 메시지 유지
    if (JSON.stringify(baselineData) === JSON.stringify(initialFormData)) {
      setCopyInfoMessage(''); // 완전 초기화인 경우만 메시지 제거
    }
  };
  // #endregion

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title="관리자 추가"
        subtitle="새로운 관리자 계정을 생성합니다"
      />

      {/* 복사 정보 안내 */}
      {copyInfoMessage && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex gap-2 items-center text-blue-700">
            <Info size={20} />
            <span className="font-medium">{copyInfoMessage}</span>
          </div>
        </div>
      )}

      {/* 폼 섹션 */}
      <div className="p-6 rounded-lg border bg-card border-border">
        {copyLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-muted-foreground">복사할 정보를 불러오는 중...</div>
          </div>
        ) : (
          <AdminForm
            mode="create"
            data={formData}
            onChange={handleFormChange}
            disabled={isSubmitting || copyLoading}
            showActions={true}
            onSubmit={handleSubmit}
            onReset={handleReset}
            hasChanges={hasChanges}
            isValid={Boolean(isValid && !copyLoading)}
          />
        )}
      </div>

      {/* 오류 모달 */}
      <Modal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        title="오류 발생"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-red-600">오류</h3>
            <p className="text-muted-foreground">{errorMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setErrorModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 