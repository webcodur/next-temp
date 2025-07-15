export interface BarrierManagementViewProps {
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
