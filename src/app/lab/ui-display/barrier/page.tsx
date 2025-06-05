"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import Barrier from '@/components/ui/barrier/barrier';

export default function BarrierPage() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="container py-10">
      <h1 className="mb-8 text-3xl font-bold">Barrier 컴포넌트</h1>
      <Button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '닫기' : '열기'}
      </Button>
      <div className="mt-6 inline-block border border-gray-300 p-4">
        <Barrier
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          width={120}
          height={8}
        />
      </div>
    </div>
  );
} 