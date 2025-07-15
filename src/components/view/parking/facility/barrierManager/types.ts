/* 
  파일명: /components/view/parking/facility/BarrierManagementView/types.ts
  기능: 차단기 관리 관련 타입 정의
  책임: 차단기 뷰와 후크에서 사용되는 모든 타입을 중앙 관리한다.
*/

// #region 기본 타입
export interface BarrierManagerProps {
	barriers: import('@/types/parking').ParkingBarrier[];
	onBarrierOpen: (barrierId: string) => void;
	onBarrierClose: (barrierId: string) => void;
	onOperationModeChange: (
		barrierId: string,
		mode: import('@/types/parking').OperationMode
	) => void;
	onPolicyUpdate?: (
		barrierId: string,
		policies: Record<string, boolean>
	) => void;
}
// #endregion
