/* 
  파일명: /components/view/parking-lot-selection/ParkingLotSelectionModal.tsx
  기능: 헤더 검색 버튼에서 호출되는 현장 선택 모달
  책임: 모달 형태로 현장 선택 UI 제공
*/

'use client';

import ParkingLotSelection from './ParkingLotSelection';

export function ParkingLotSelectionModal() {
  return <ParkingLotSelection isModal={true} />;
}