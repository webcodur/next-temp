/* 
  파일명: /app/preview/menu/page.tsx
  기능: 주차장별 메뉴 권한 관리 페이지
  책임: 페이지 타이틀 관리 및 하위 컴포넌트 조율
  메뉴 설명: 주차장별 메뉴 권한을 설정

  메뉴 API 개편을 위해 비활성화 처리
*/ // ------------------------------

'use client';

// import { MenuManager } from './MenuManager/MenuManager';

export default function MenuManagementPage() {
  // #region 렌더링
  return (
    <div className="p-6 mx-auto space-y-6 max-w-6xl font-multilang">
      {/* 메뉴 설정 영역 */}
      {/* 메뉴 API 개편을 위해 비활성화 처리됨 */}
      <div className="p-8 text-center bg-gray-50 rounded-lg">
        <p className="text-gray-600">메뉴 관리 기능은 현재 개편 중입니다.</p>
      </div>
    </div>
  );
  // #endregion
}