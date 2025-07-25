/* 
  파일명: /app/preview/household/instances/page.tsx
  기능: 세대별 거주 이력 관리 페이지
  책임: Manager 컴포넌트를 렌더링하고 페이지 레이아웃을 제공한다.
*/ // ------------------------------

import { HouseholdInstancesManager } from './HouseholdInstancesManager/HouseholdInstancesManager';

// #region 메인 페이지
export default function HouseholdInstancesPage() {
  return (
    <div className="p-6 font-multilang animate-fadeIn">
      <HouseholdInstancesManager />
    </div>
  );
}
// #endregion