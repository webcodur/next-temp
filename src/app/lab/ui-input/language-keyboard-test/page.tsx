/* 
  파일명: /app/lab/ui-input/language-keyboard-test/page.tsx
  기능: 언어 키보드 단축키 테스트 페이지
  책임: Alt+1,2,3 언어 전환 단축키 동작 확인
*/ // ------------------------------

'use client';

import { useGlobalKeyboard } from '@/hooks/useGlobalKeyboard';
import { useLocale } from '@/hooks/useI18n';
import LanguageSwitcher from '@/components/ui/ui-input/language-switcher/LanguageSwitcher';
import { localeMetadata } from '@/lib/i18n';

export default function LanguageKeyboardTestPage() {
  // 모든 단축키 활성화
  useGlobalKeyboard();
  
  const { currentLocale } = useLocale();
  const currentMeta = localeMetadata[currentLocale];

  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="max-w-4xl mx-auto">
        
        {/* 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">언어 키보드 단축키 테스트</h1>
          <p className="text-muted-foreground">
            Alt+1,2,3 키로 언어를 전환해보세요. 현재 언어가 즉시 변경됩니다.
          </p>
        </div>

        {/* 현재 언어 상태 */}
        <div className="neu-flat p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">현재 언어 상태</h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8">
              <img 
                src={currentMeta.flag} 
                alt={currentMeta.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium">{currentMeta.name}</div>
              <div className="text-sm text-muted-foreground">언어 코드: {currentLocale}</div>
            </div>
          </div>
        </div>

        {/* 단축키 안내 */}
        <div className="neu-flat p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">키보드 단축키</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <kbd className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm">Alt</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm">1</kbd>
              </div>
              <div className="text-sm text-muted-foreground">한국어로 전환</div>
            </div>
            
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <kbd className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm">Alt</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm">2</kbd>
              </div>
              <div className="text-sm text-muted-foreground">English로 전환</div>
            </div>
            
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <kbd className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm">Alt</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm">3</kbd>
              </div>
              <div className="text-sm text-muted-foreground">العربية로 전환</div>
            </div>
          </div>
        </div>

        {/* 기존 언어 선택기 */}
        <div className="neu-flat p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">기존 언어 선택기 (비교용)</h2>
          <p className="text-sm text-muted-foreground mb-4">
            마우스 클릭으로도 언어를 변경할 수 있습니다.
          </p>
          <div className="flex gap-4">
            <div>
              <div className="text-sm font-medium mb-2">Header 스타일</div>
              <LanguageSwitcher variant="header" />
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Sidebar 스타일</div>
              <LanguageSwitcher variant="sidebar" />
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Inline 스타일</div>
              <LanguageSwitcher variant="inline" />
            </div>
          </div>
        </div>

        {/* 기타 단축키 테스트 */}
        <div className="neu-flat p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">기타 단축키 (통합 테스트)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <kbd className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm">Y</kbd>
              </div>
              <div className="text-sm text-muted-foreground">테마 토글 (다크/라이트)</div>
            </div>
            
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <kbd className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm">B</kbd>
              </div>
              <div className="text-sm text-muted-foreground">사이드바 토글</div>
            </div>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">주의사항</h3>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• 언어 전환 시 페이지가 새로고침됩니다</li>
            <li>• 입력 필드에 포커스가 있을 때는 단축키가 무시됩니다</li>
            <li>• Alt 키는 브라우저 메뉴를 열 수 있으므로 빠르게 누르세요</li>
          </ul>
        </div>

      </div>
    </div>
  );
}