'use client';

import * as React from 'react';
import { Button } from '@/components/ui/ui-input/button';
import Modal from '@/components/ui/ui-layout/modal/Modal';

export default function ModalPage() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="container py-10">
      <h1 className="mb-8 text-3xl font-bold">Modal 컴포넌트</h1>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="모달 제목">
        <p>모달 내용입니다.</p>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>취소</Button>
          <Button onClick={() => setIsOpen(false)}>확인</Button>
        </div>
      </Modal>
    </div>
  );
} 