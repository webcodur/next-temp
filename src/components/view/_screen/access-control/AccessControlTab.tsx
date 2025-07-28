/* 
  파일명: AccessControlTab.tsx
  기능: 출입제어 관리 탭 컴포넌트
  책임: 차단기 제어와 출입 정책 관리 기능을 독립적으로 담당한다
*/

'use client';

import React from 'react';
import AccessControlManager from './AccessControlManager';

// #region 타입 정의
interface AccessControlTabProps {
	onActionsRender?: (actions: React.ReactNode) => void;
}
// #endregion

// #region 메인 컴포넌트
const AccessControlTab: React.FC<AccessControlTabProps> = ({
	onActionsRender
}) => {
	// #region 렌더링
	return (
		<div className="space-y-4">
			<AccessControlManager
				showActions={false}
				onActionsRender={onActionsRender}
			/>
		</div>
	);
	// #endregion
};

export default AccessControlTab; 