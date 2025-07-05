'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/ui-input/button/Button';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { useTranslations } from '@/hooks/useI18n';

export default function ModalPage() {
	const t = useTranslations();
	const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="container py-10">
      <h1 className="mb-8 text-3xl font-bold font-multilang">{t('모달_제목')}</h1>
      <Button onClick={() => setIsOpen(true)} className="font-multilang">{t('모달_열기')}</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('모달_제목텍스트')}>
        <p className="font-multilang">{t('모달_내용')}</p>
        <div className="mt-4 flex justify-end space-x-2">
					<Button variant="outline" onClick={() => setIsOpen(false)} className="font-multilang">
						{t('모달_취소')}
					</Button>
          <Button onClick={() => setIsOpen(false)} className="font-multilang">{t('모달_확인')}</Button>
        </div>
      </Modal>
    </div>
  );
} 