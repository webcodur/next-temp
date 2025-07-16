'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useTranslations } from '@/hooks/useI18n'

// 클라이언트에서만 로드되도록 동적 임포트
const Editor = dynamic(
  () => import('./Editor'),
  { ssr: false }
)

export default function EditorExample() {
  const t = useTranslations()
  const [content, setContent] = useState<string>('')

  return (
    <div className="p-8 mx-auto space-y-6 max-w-5xl">
      <h1 className="mb-6 text-2xl font-bold font-multilang">{t('에디터_제목')}</h1>
      
      <Editor
        value={content}
        onChange={setContent}
        height={500}
      />

      <div className="p-4 mt-8 rounded-lg neu-flat">
        <h2 className="mb-2 text-lg font-semibold font-multilang">{t('에디터_현재콘텐츠')}</h2>
        <pre className="overflow-x-auto p-4 text-sm bg-gray-100 rounded">
          {content}
        </pre>
      </div>
    </div>
  )
} 