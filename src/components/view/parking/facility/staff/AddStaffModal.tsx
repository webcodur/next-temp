'use client';

import React, { useState, useMemo } from 'react';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldPassword from '@/components/ui/ui-input/field/text/FieldPassword';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';
import { Button } from '@/components/ui/ui-input/button/Button';

// Staff 타입: 부모 페이지의 타입을 재선언(충돌 방지용). 주요 키만 명시.
export interface StaffInput {
  id: string;
  password: string;
  name: string;
  phone: string;
  role: string;
}

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (input: StaffInput) => void;
}

const ROLE_OPTIONS = [
  { value: '근무자', label: '근무자' },
  { value: '관리자', label: '관리자' },
];

const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose, onAdd }) => {
  // #region 폼 상태
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  // #endregion

  // #region 검증
  const isValid = useMemo(() => {
    return (
      id.trim() &&
      password.trim() &&
      confirm.trim() &&
      password === confirm &&
      name.trim() &&
      phone.trim() &&
      role.trim()
    );
  }, [id, password, confirm, name, phone, role]);
  // #endregion

  const handleSubmit = () => {
    if (!isValid) return;
    onAdd({ id, password, name, phone, role });
    // reset & close
    setId('');
    setPassword('');
    setConfirm('');
    setName('');
    setPhone('');
    setRole('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="근무자 추가"
      size="lg"
      closeOnBackdropClick={false}
    >
      <div className="grid gap-4">
        <FieldText
          id="staff-id"
          label="아이디 *"
          placeholder="아이디를 입력해주세요."
          value={id}
          onChange={setId}
        />
        <FieldPassword
          id="staff-pw"
          label="비밀번호 *"
          placeholder="비밀번호를 입력해주세요."
          value={password}
          onChange={setPassword}
        />
        <FieldPassword
          id="staff-pw2"
          label="비밀번호 확인 *"
          placeholder="비밀번호를 다시 입력해주세요."
          value={confirm}
          onChange={setConfirm}
          error={confirm !== '' && password !== confirm}
          errorMessage="비밀번호가 일치하지 않습니다."
        />
        <FieldText
          id="staff-name"
          label="이름 *"
          placeholder="이름을 입력해주세요."
          value={name}
          onChange={setName}
        />
        <FieldText
          id="staff-phone"
          label="연락처 *"
          placeholder="010-0000-0000"
          value={phone}
          onChange={setPhone}
        />
        <FieldSelect
          id="staff-role"
          label="권한 *"
          placeholder="권한선택"
          value={role}
          onChange={setRole}
          options={ROLE_OPTIONS}
        />
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="ghost" onClick={onClose}>
          목록
        </Button>
        <Button variant="accent" onClick={handleSubmit} disabled={!isValid}>
          등록
        </Button>
      </div>
    </Modal>
  );
};

export default AddStaffModal; 