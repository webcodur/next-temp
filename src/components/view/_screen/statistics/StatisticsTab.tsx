/* 
  파일명: StatisticsTab.tsx
  기능: 주차장 통계 정보 탭 컴포넌트
  책임: 주차장 운영 현황, 이용률, 수익 등의 통계 정보를 표시한다
*/

'use client';

import React from 'react';

// #region 메인 컴포넌트
const StatisticsTab: React.FC = () => {
	// #region 렌더링
	return (
		<div className="space-y-6">
			<div className="p-8 text-center text-muted-foreground">
				<h2 className="text-xl font-semibold mb-4">통계 정보 개발 예정</h2>
				<p>주차장 운영 현황, 이용률, 수익 등의 통계 정보가 여기에 표시됩니다.</p>
			</div>
		</div>
	);
	// #endregion
};

export default StatisticsTab; 