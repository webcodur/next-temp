'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

// 클라이언트에서만 로드되도록 동적 임포트
const Editor = dynamic(
  () => import('@/components/ui/editor/markdown-editor').then(mod => mod.Editor),
  { ssr: false }
)

export default function EditorPage() {
  const [content, setContent] = useState<string>('')

  return (
    <div className="max-w-5xl p-8 mx-auto space-y-6">
      <h1 className="mb-6 text-2xl font-bold">마크다운 에디터</h1>
      
      <Editor
        value={content}
        onChange={setContent}
        height={500}
      />

      <div className="p-4 mt-8 rounded-lg neu-flat">
        <h2 className="mb-2 text-lg font-semibold">현재 콘텐츠 (디버그용)</h2>
        <pre className="p-4 overflow-x-auto text-sm bg-gray-100 rounded">
          {content}
        </pre>
      </div>
    </div>
  )
} 