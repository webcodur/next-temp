'use client';

import React, { useState } from 'react';
import { 
  RaisedButton, 
  RaisedContainer, 
  InsetButton, 
  InsetContainer,
  FlatContainer
} from '@/components/ui/neumorphic/neumorphic';

export default function NeumorphicPage() {
  const [count, setCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'raised' | 'inset' | 'flat'>('raised');

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="text-2xl font-bold">뉴모피즘 컴포넌트</div>
      
      {/* 탭 */}
      <div className="flex gap-2">
        <RaisedButton 
          className={activeTab === 'raised' ? 'bg-blue-50' : ''}
          onClick={() => setActiveTab('raised')}
        >
          양각 컴포넌트
        </RaisedButton>
        <InsetButton 
          className={activeTab === 'inset' ? 'bg-blue-50' : ''}
          onClick={() => setActiveTab('inset')}
        >
          음각 컴포넌트
        </InsetButton>
        <RaisedButton 
          className={activeTab === 'flat' ? 'bg-blue-50' : ''}
          onClick={() => setActiveTab('flat')}
        >
          평면 컴포넌트
        </RaisedButton>
      </div>
      
      {/* 양각 컴포넌트 */}
      {activeTab === 'raised' && (
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold">양각 버튼 (Raised)</h2>
          <div className="flex flex-wrap gap-4">
            <RaisedButton onClick={() => setCount(prev => prev + 1)}>
              증가 (+1)
            </RaisedButton>
            <RaisedButton onClick={() => setCount(prev => prev - 1)}>
              감소 (-1)
            </RaisedButton>
            <RaisedButton disabled>
              비활성화 버튼
            </RaisedButton>
            <RaisedButton className="bg-blue-50">
              커스텀 스타일
            </RaisedButton>
          </div>
          
          <h2 className="text-xl font-semibold mt-4">양각 컨테이너</h2>
          <RaisedContainer className="max-w-md">
            <h3 className="text-lg font-medium mb-2">양각 컨테이너 예시</h3>
            <p>현재 카운트: {count}</p>
            <div className="mt-4 flex gap-2">
              <RaisedButton onClick={() => setCount(0)}>리셋</RaisedButton>
            </div>
          </RaisedContainer>
        </div>
      )}
      
      {/* 음각 컴포넌트 */}
      {activeTab === 'inset' && (
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold">음각 버튼 (Inset)</h2>
          <div className="flex flex-wrap gap-4">
            <InsetButton onClick={() => setCount(prev => prev + 1)}>
              증가 (+1)
            </InsetButton>
            <InsetButton onClick={() => setCount(prev => prev - 1)}>
              감소 (-1)
            </InsetButton>
            <InsetButton disabled>
              비활성화 버튼
            </InsetButton>
            <InsetButton className="bg-blue-50">
              커스텀 스타일
            </InsetButton>
          </div>
          
          <h2 className="text-xl font-semibold mt-4">음각 컨테이너</h2>
          <InsetContainer className="max-w-md">
            <h3 className="text-lg font-medium mb-2">음각 컨테이너 예시</h3>
            <p>현재 카운트: {count}</p>
            <div className="mt-4 flex gap-2">
              <InsetButton onClick={() => setCount(0)}>리셋</InsetButton>
            </div>
          </InsetContainer>
        </div>
      )}
      
      {/* 평면 컴포넌트 */}
      {activeTab === 'flat' && (
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold">평면 컨테이너 (Flat)</h2>
          <FlatContainer className="max-w-md">
            <h3 className="text-lg font-medium mb-2">평면 컨테이너 예시</h3>
            <p>현재 카운트: {count}</p>
            <div className="mt-4 flex gap-2">
              <RaisedButton onClick={() => setCount(prev => prev + 1)}>증가</RaisedButton>
              <InsetButton onClick={() => setCount(prev => prev - 1)}>감소</InsetButton>
            </div>
          </FlatContainer>
          
          <h2 className="text-xl font-semibold mt-4">중첩 컨테이너</h2>
          <FlatContainer className="max-w-md">
            <h3 className="text-lg font-medium mb-2">외부: 평면 컨테이너</h3>
            <RaisedContainer className="mb-4">
              <h4 className="font-medium">내부: 양각 컨테이너</h4>
              <p className="text-sm">양각 컨테이너 내부 콘텐츠</p>
            </RaisedContainer>
            <InsetContainer>
              <h4 className="font-medium">내부: 음각 컨테이너</h4>
              <p className="text-sm">음각 컨테이너 내부 콘텐츠</p>
            </InsetContainer>
          </FlatContainer>
        </div>
      )}
    </div>
  );
} 