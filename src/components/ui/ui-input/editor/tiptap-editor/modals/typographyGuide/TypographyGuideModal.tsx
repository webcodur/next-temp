'use client'

import React from 'react'
import { X, Type, ArrowRight, Copyright, Zap } from 'lucide-react'

interface TypographyGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Typography 기능 안내 모달
 * 
 * TipTap Typography Extension의 자동 변환 기능들을 사용자에게 안내
 * 입력 규칙과 변환 결과를 시각적으로 표시
 */
const TypographyGuideModal: React.FC<TypographyGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null

  const typographyRules = [
    {
      category: '기본 기호',
      icon: <Type className="w-4 h-4" />,
      rules: [
        { input: '--', output: '—', description: 'Em dash (긴 대시)' },
        { input: '...', output: '…', description: '줄임표' },
        { input: '<-', output: '←', description: '왼쪽 화살표' },
        { input: '->', output: '→', description: '오른쪽 화살표' },
      ]
    },
    {
      category: '인용부호',
      icon: <span className="w-4 h-4 text-sm font-bold">&quot;</span>,
      rules: [
        { input: '"텍스트"', output: '"텍스트"', description: '스마트 따옴표' },
        { input: "'텍스트'", output: "'텍스트'", description: '스마트 작은따옴표' },
      ]
    },
    {
      category: '특수 기호',
      icon: <Copyright className="w-4 h-4" />,
      rules: [
        { input: '(c)', output: '©', description: '저작권 기호' },
        { input: '(r)', output: '®', description: '등록상표 기호' },
        { input: '(tm)', output: '™', description: '상표 기호' },
        { input: '1/2', output: '½', description: '분수 기호' },
        { input: '+/-', output: '±', description: '플러스/마이너스 기호' },
      ]
    },
    {
      category: '수식 기호',
      icon: <Zap className="w-4 h-4" />,
      rules: [
        { input: '2*3', output: '2×3', description: '곱셈 기호 (별표)' },
        { input: '2x3', output: '2×3', description: '곱셈 기호 (x)' },
        { input: '^2', output: '²', description: '제곱 기호' },
        { input: '^3', output: '³', description: '세제곱 기호' },
      ]
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* 모달 컨테이너 */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden neu-flat">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 neu-raised">
          <div className="flex items-center gap-3">
            <Type className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Typography 자동 변환 가이드</h2>
              <p className="text-sm text-gray-600">입력하면 자동으로 변환되는 텍스트 규칙들</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors neu-button"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* 안내 문구 */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 neu-inset">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-medium text-blue-900 mb-2">사용 방법</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 아래 입력 패턴을 타이핑하면 자동으로 변환됩니다</li>
                  <li>• <kbd className="px-2 py-1 bg-blue-200 rounded text-xs">Backspace</kbd> 키로 변환을 취소할 수 있습니다</li>
                  <li>• 변환은 실시간으로 이루어지며, 공백이나 Enter 입력 시 확정됩니다</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 변환 규칙들 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {typographyRules.map((category, categoryIndex) => (
              <div key={categoryIndex} className="neu-flat rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  {category.icon}
                  <h3 className="text-lg font-medium text-gray-900">{category.category}</h3>
                </div>
                
                <div className="space-y-3">
                  {category.rules.map((rule, ruleIndex) => (
                    <div key={ruleIndex} className="flex items-center gap-4 p-3 bg-gray-50 rounded neu-inset">
                      {/* 입력 */}
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 mb-1">입력</div>
                        <code className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">
                          {rule.input}
                        </code>
                      </div>
                      
                      {/* 화살표 */}
                      <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      
                      {/* 결과 */}
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 mb-1">결과</div>
                        <div className="px-2 py-1 bg-white rounded border text-lg font-medium">
                          {rule.output}
                        </div>
                      </div>
                      
                      {/* 설명 */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-600 mb-1">설명</div>
                        <div className="text-sm text-gray-800 break-words">
                          {rule.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 추가 팁 */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 neu-inset">
            <h3 className="font-medium text-green-900 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              유용한 팁
            </h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• 변환을 원하지 않으면 입력 후 즉시 <kbd className="px-1 py-0.5 bg-green-200 rounded text-xs">Backspace</kbd>를 누르세요</li>
              <li>• 모든 변환은 텍스트 입력 시 실시간으로 작동합니다</li>
              <li>• 복사/붙여넣기한 텍스트는 자동 변환되지 않습니다</li>
              <li>• 코드 블록 내에서는 변환이 적용되지 않습니다</li>
            </ul>
          </div>
        </div>

        {/* 푸터 */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 neu-raised">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              TipTap Typography Extension 기능 안내
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors neu-button"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TypographyGuideModal