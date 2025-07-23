/* 
  파일명: /components/view/parking-lot-selection/ActionButtons/ActionButtons.tsx
  기능: 액션 버튼 영역
  책임: 확인 버튼과 로딩 상태 관리
*/

'use client';

// #region 타입
interface ActionButtonsProps {
  selectedId: number | null;
  isLoading: boolean;
  onConfirm: () => void;
}
// #endregion

export function ActionButtons({ selectedId, isLoading, onConfirm }: ActionButtonsProps) {
  // #region 렌더링
  return (
    <div className="flex justify-end">
      <button
        onClick={onConfirm}
        disabled={!selectedId || isLoading}
        className={`neu-raised px-8 py-3 rounded-lg font-medium transition-all min-w-32 ${
          (!selectedId || isLoading) 
            ? 'opacity-50 cursor-not-allowed' 
            : 'text-primary'
        }`}
      >
        {isLoading ? '처리 중...' : '확인'}
      </button>
    </div>
  );
  // #endregion
}