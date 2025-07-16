"use client";

import { useState } from 'react';
import { MorphingText } from './MorphingText';
import { useTranslations } from '@/hooks/useI18n';

export default function MorphingTextExample() {
  const t = useTranslations();
  const [currentExample, setCurrentExample] = useState(0);
  const [manualIndex, setManualIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // 예제 데이터 세트
  const examples = [
    {
      title: t('모핑텍스트_다국어인사말'),
      texts: ["안녕하세요", "Hello", "مرحبا", "Bonjour", "Hola"]
    },
    {
      title: t('모핑텍스트_주차시스템메시지'),
      texts: [t('모핑텍스트_차량진입'), "Vehicle Entry", "دخول المركبة", t('모핑텍스트_출차완료'), "Exit Complete"]
    },
    {
      title: t('모핑텍스트_상태메시지'),
      texts: [t('모핑텍스트_로딩중'), "Loading...", "تحميل...", t('모핑텍스트_처리중'), "Processing..."]
    },
    {
      title: t('모핑텍스트_대형헤드라인'),
      texts: ["SMART PARKING", t('모핑텍스트_스마트주차'), "موقف ذكي", "INNOVATION", t('모핑텍스트_혁신')]
    }
  ];

  return (
    <div className="p-6 space-y-8 min-h-screen">
      {/* 헤더 */}
      <div className="p-6 rounded-lg neu-flat">
        <h1 className="mb-2 text-3xl font-bold font-multilang">{t('모핑텍스트_제목')}</h1>
        <p className="text-muted-foreground font-multilang">
          {t('모핑텍스트_설명')}
        </p>
      </div>

      {/* 예제 선택 */}
      <div className="p-6 rounded-lg neu-flat">
        <h2 className="mb-4 text-xl font-semibold font-multilang">{t('모핑텍스트_예제선택')}</h2>
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
            <p><strong>{t('모핑텍스트_텍스트')}</strong> {examples[currentExample].texts.join(' → ')}</p>
          </div>
        </div>
      </div>

      {/* 수동 제어 테스트 */}
      <div className="p-6 rounded-lg neu-flat">
        <h2 className="mb-6 text-xl font-semibold font-multilang">{t('모핑텍스트_수동제어테스트')}</h2>
        
        <div className="space-y-6">
          {/* 자동재생 토글 */}
          <div className="flex gap-4 items-center">
            <span className="font-multilang">{t('모핑텍스트_자동순환')}</span>
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
            <span className="font-multilang">{t('모핑텍스트_수동텍스트선택')}</span>
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
              {t('모핑텍스트_현재인덱스')} {manualIndex} | {t('모핑텍스트_자동재생')} {isAutoPlay ? t('모핑텍스트_활성') : t('모핑텍스트_비활성')}
            </p>
          </div>
        </div>
      </div>

      {/* 추가 예제 */}
      <div className="p-6 rounded-lg neu-flat">
        <h2 className="mb-6 text-xl font-semibold font-multilang">{t('모핑텍스트_다양한언어조합')}</h2>
        <div className="space-y-8">
          <div className="text-center">
            <p className="mb-4 text-sm text-muted-foreground font-multilang">
              {t('모핑텍스트_한국어영어아랍어')}
            </p>
            <MorphingText
              texts={["안녕하세요", "Hello", "مرحبا"]}
            />
          </div>
          <div className="text-center">
            <p className="mb-4 text-sm text-muted-foreground font-multilang">
              {t('모핑텍스트_시스템메시지')}
            </p>
            <MorphingText
              texts={[t('모핑텍스트_시스템준비중'), "System Ready", "النظام جاهز", t('모핑텍스트_완료'), "Complete"]}
            />
          </div>
        </div>
      </div>

      {/* 사용법 가이드 */}
      <div className="p-6 rounded-lg neu-flat">
        <h2 className="mb-4 text-xl font-semibold font-multilang">{t('모핑텍스트_사용법')}</h2>
        <div className="overflow-x-auto p-4 font-mono text-sm bg-gray-50 rounded-lg">
          <pre>{`import { MorphingText } from '@/components/ui/ui-effects/morphing-text/MorphingText';

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