/* 
  파일명: AccessControlManager.tsx
  기능: 출입제어 관리 통합 뷰 (최상위 관리자)
  책임: 출입정책 설정과 차단기 제어 기능을 통합 관리한다
*/

import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { useAccessControl } from '@/hooks/domain/useAccessControl';
import BarrierControlGrid from './barrierManager/barrierControl/BarrierControlGrid';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { SimpleToggleSwitch } from '@/components/ui/ui-input/simple-input/SimpleToggleSwitch';

// #region 타입 정의
interface AccessControlManagerProps {
	showPageHeader?: boolean;
}
// #endregion

// #region 메인 컴포넌트
const AccessControlManager: React.FC<AccessControlManagerProps> = ({
	showPageHeader = true,
}) => {
	// #region 훅
	const {
		barriers,
		barrierOrder,
		handleBarrierToggle,
		handleOperationModeChange,
		handleBarrierOrderChange,
	} = useAccessControl();
	
	// 차단기 잠금 상태
	const [isBarrierLocked, setIsBarrierLocked] = useState(true);
	// #endregion

	// #endregion

	// #region 렌더링
	return (
		<div className="flex flex-col gap-6">
			{showPageHeader && (
				<PageHeader 
					title="주차장 출입 관리" 
					subtitle="차단기 제어 시스템과 출입 정책 통합 관리"
				/>
			)}

			{/* 차단기 제어 영역 */}
			<div className="neu-elevated">
				<SectionPanel 
					title="개별 차단기 제어 컨트롤러"
					subtitle="각 차단기를 개별적으로 제어합니다"
					icon={<Zap size={18} />}
					headerHeight="h-[70px]"
					titleAlign="center"
					headerActions={
						<div className="flex gap-3 items-center w-auto">
							<span className="text-sm font-medium whitespace-nowrap text-muted-foreground">
								{isBarrierLocked ? '잠금상태' : '편집상태'}
							</span>
							<SimpleToggleSwitch
								checked={!isBarrierLocked}
								onChange={(checked) => setIsBarrierLocked(!checked)}
								size="lg"
								className="w-auto"
							/>
						</div>
					}
				>
					<BarrierControlGrid
						barriers={barriers}
						barrierOrder={barrierOrder}
						isLocked={isBarrierLocked}
						onBarrierToggle={handleBarrierToggle}
						onOperationModeChange={handleOperationModeChange}
						onBarrierOrderChange={handleBarrierOrderChange}
					/>
				</SectionPanel>
			</div>
		</div>
	);
	// #endregion
};

export default AccessControlManager;
