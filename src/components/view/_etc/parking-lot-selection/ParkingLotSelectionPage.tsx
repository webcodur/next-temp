/* 
  파일명: /components/view/parking-lot-selection/ParkingLotSelectionPage.tsx
  기능: 로그인 후 현장(주차장) 선택 페이지 (Manager)
  책임: 페이지 모드로 현장 선택 UI 제공
*/

'use client';

import ParkingLotSelection from './ParkingLotSelection';

// #region 타입
interface ParkingLotSelectionPageProps {
  onSelectionComplete?: () => void;
}
// #endregion

export default function ParkingLotSelectionPage({ onSelectionComplete }: ParkingLotSelectionPageProps) {
  return (
    <ParkingLotSelection 
      isModal={false}
      onSelectionComplete={onSelectionComplete}
    />
  );
}