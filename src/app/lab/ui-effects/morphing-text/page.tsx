"use client";

import { useState } from 'react';
import { MorphingText } from '@/components/ui/morphing-text';

export default function MorphingTextDemo() {
  const [currentExample, setCurrentExample] = useState(0);
  const [manualIndex, setManualIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // 예제 데이터 세트
  const examples = [
    {
      title: "다국어 인사말",
      texts: ["안녕하세요", "Hello", "مرحبا", "Bonjour", "Hola"]
    },
    {
      title: "주차 시스템 메시지",
      texts: ["차량 진입", "Vehicle Entry", "دخول المركبة", "출차 완료", "Exit Complete"]
    },
    {
      title: "상태 메시지",
      texts: ["로딩중...", "Loading...", "تحميل...", "처리중...", "Processing..."]
    },
    {
      title: "대형 헤드라인",
      texts: ["SMART PARKING", "스마트 주차", "موقف ذكي", "INNOVATION", "혁신"]
    }
  ];

  return (
    <div className="p-6 space-y-8 min-h-screen">
      {/* 헤더 */}
      <div className="p-6 rounded-lg neu-flat">
        <h1 className="mb-2 text-3xl font-bold font-multilang">Morphing Text 테스트</h1>
        <p className="text-muted-foreground font-multilang">
          동적 텍스트 모핑 애니메이션 컴포넌트를 테스트한다.
        </p>
      </div>

      {/* 예제 선택 */}
      <div className="p-6 rounded-lg neu-flat">
        <h2 className="mb-4 text-xl font-semibold font-multilang">예제 선택</h2>
        <div className="flex flex-wrap gap-3">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setCurrentExample(index)}
              className={`
                px-4 py-2 rounded-lg font-multilang transition-all
                ${currentExample === index 
                  ? 'neu-inset text-primary' 
                  : 'neu-raised hover:scale-[1.02]'
                }
              `}
            >
              {example.title}
            </button>
          ))}
        </div>
      </div>

      {/* 현재 예제 표시 */}
      <div className="p-8 rounded-lg neu-flat">
        <div className="space-y-6 text-center">
          <h3 className="text-lg font-medium text-muted-foreground font-multilang">
            {examples[currentExample].title}
          </h3>
          
          <div className="flex justify-center">
            <MorphingText
              texts={examples[currentExample].texts}
              className="max-w-2xl"
            />
          </div>

          <div className="space-y-2 text-sm text-muted-foreground font-multilang">
            <p><strong>텍스트:</strong> {examples[currentExample].texts.join(' → ')}</p>
          </div>
        </div>
      </div>

      {/* 수동 제어 테스트 */}
      <div className="p-6 rounded-lg neu-flat">
        <h2 className="mb-6 text-xl font-semibold font-multilang">수동 제어 테스트</h2>
        
        <div className="space-y-6">
          {/* 자동재생 토글 */}
          <div className="flex gap-4 items-center">
            <span className="font-multilang">자동 순환:</span>
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`px-4 py-2 rounded-lg font-multilang transition-all ${
                isAutoPlay ? 'neu-inset text-primary' : 'neu-raised'
              }`}
            >
              {isAutoPlay ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* 수동 인덱스 제어 */}
          <div className="space-y-3">
            <span className="font-multilang">수동 텍스트 선택:</span>
            <div className="flex flex-wrap gap-2">
              {examples[currentExample].texts.map((text, index) => (
                <button
                  key={index}
                  onClick={() => setManualIndex(index)}
                  className={`px-3 py-1 rounded font-multilang text-sm transition-all ${
                    manualIndex === index 
                      ? 'neu-inset text-primary' 
                      : 'neu-raised hover:scale-[1.02]'
                  }`}
                >
                  {index}: {text}
                </button>
              ))}
            </div>
          </div>

          {/* 제어되는 모핑 텍스트 */}
          <div className="p-8 text-center rounded-lg neu-flat">
            <MorphingText
              texts={examples[currentExample].texts}
              currentIndex={isAutoPlay ? undefined : manualIndex}
              autoPlay={isAutoPlay}
              onTextChange={(index) => {
                if (isAutoPlay) {
                  setManualIndex(index);
                }
              }}
            />
            <p className="mt-4 text-sm text-muted-foreground font-multilang">
              현재 인덱스: {manualIndex} | 자동재생: {isAutoPlay ? '활성' : '비활성'}
            </p>
          </div>
        </div>
      </div>

      {/* 추가 예제 */}
      <div className="p-6 rounded-lg neu-flat">
        <h2 className="mb-6 text-xl font-semibold font-multilang">다양한 언어 조합</h2>
        <div className="space-y-8">
          <div className="text-center">
            <p className="mb-4 text-sm text-muted-foreground font-multilang">
              한국어 + 영어 + 아랍어
            </p>
            <MorphingText
              texts={["안녕하세요", "Hello", "مرحبا"]}
            />
          </div>
          <div className="text-center">
            <p className="mb-4 text-sm text-muted-foreground font-multilang">
              시스템 메시지
            </p>
            <MorphingText
              texts={["시스템 준비중", "System Ready", "النظام جاهز", "완료", "Complete"]}
            />
          </div>
        </div>
      </div>

      {/* 사용법 가이드 */}
      <div className="p-6 rounded-lg neu-flat">
        <h2 className="mb-4 text-xl font-semibold font-multilang">사용법</h2>
        <div className="overflow-x-auto p-4 font-mono text-sm bg-gray-50 rounded-lg">
          <pre>{`import { MorphingText } from '@/components/ui/morphing-text';

// 기본 자동 순환
<MorphingText 
  texts={["안녕하세요", "Hello", "مرحبا"]}
  autoPlay={true}
  onTextChange={(index) => console.log('변경:', index)}
/>

// 수동 제어
const [index, setIndex] = useState(0);
<MorphingText 
  texts={["안녕하세요", "Hello", "مرحبا"]}
  currentIndex={index}
  autoPlay={false}
/>`}</pre>
        </div>
      </div>
    </div>
  );
} 