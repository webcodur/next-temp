'use client';

import { useState } from 'react';
import { Ripple, Spinner, Dots, Pulse, Wave } from '@/components/ui/ui-effects/loading/loading';

export default function LoadingPage() {
  const [selectedComponent, setSelectedComponent] = useState('ripple');

  const components = [
    { id: 'ripple', name: 'Ripple', component: Ripple },
    { id: 'spinner', name: 'Spinner', component: Spinner },
    { id: 'dots', name: 'Dots', component: Dots },
    { id: 'pulse', name: 'Pulse', component: Pulse },
    { id: 'wave', name: 'Wave', component: Wave },
  ];

  const SelectedComponent = components.find(c => c.id === selectedComponent)?.component || Ripple;

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-6xl">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-slate-800">로딩 컴포넌트</h1>
          <p className="text-slate-600">다양한 로딩 애니메이션 효과를 테스트한다</p>
        </div>

        {/* 컴포넌트 선택 탭 */}
        <div className="p-6 mb-8 bg-white rounded-lg border shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">컴포넌트 선택</h2>
          <div className="flex flex-wrap gap-2">
            {components.map((comp) => (
              <button
                key={comp.id}
                onClick={() => setSelectedComponent(comp.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedComponent === comp.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                {comp.name}
              </button>
            ))}
          </div>
        </div>

        {/* 메인 데모 영역 */}
        <div className="p-8 bg-white rounded-lg border shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">{components.find(c => c.id === selectedComponent)?.name} 데모</h2>

          <div className="flex justify-center">
            {selectedComponent === 'ripple' ? (
              <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
                <p className="z-10 mb-4 text-5xl font-medium tracking-tighter text-center text-black whitespace-pre-wrap dark:text-white">
                  Loading
                </p>
                <SelectedComponent />
              </div>
            ) : (
              <div className="flex overflow-hidden relative justify-center items-center w-96 h-96 rounded-lg border bg-slate-50">
                <SelectedComponent />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 