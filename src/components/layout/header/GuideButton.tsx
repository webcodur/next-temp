'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import clsx from 'clsx';
import { Dialog, DialogFooter } from '@/components/ui/ui-layout/dialog/Dialog';
import { Button } from '@/components/ui/ui-input/button/Button';

interface GuideButtonProps {
  className?: string;
}

export function GuideButton({ className = '' }: GuideButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(prev => !prev);

  return (
    <>
      {/* 가이드 버튼 */}
      <button
        onClick={toggleOpen}
        className={clsx('flex justify-center items-center', className)}
        aria-label="사용자 가이드"
      >
        <HelpCircle className="w-6 h-6 text-muted-foreground" />
      </button>

      {/* 가이드 다이얼로그 */}
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="가이드"
        size="sm"
        variant="info"
      >
        <div className="space-y-6 min-w-[280px]">
          {/* 키보드 네비게이션 섹션 */}
          <section>
            <h3 className="mb-2 text-base font-semibold text-foreground font-multilang">키보드 네비게이션</h3>
            <ul className="space-y-1 text-sm list-disc ps-4 font-multilang">
              <li>
                <span className="font-medium text-primary">Ctrl + B</span> : 사이드바 ON / OFF
              </li>
              <li>
                <span className="font-medium text-primary">Ctrl + Y</span> : 다크모드 ON / OFF
              </li>
              <li>
                <span className="font-medium text-primary">Alt + 1</span> : 언어 한국어로 전환
              </li>
              <li>
                <span className="font-medium text-primary">Alt + 2</span> : change Language to English
              </li>
              <li>
                <span className="font-medium text-primary">Alt + 3</span> : تغيير اللغة إلى العربية
              </li>
            </ul>
          </section>
        </div>

        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} className="font-multilang">
            확인
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
} 