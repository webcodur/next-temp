/* 
  파일명: /app/temp/household/instances/HouseholdInstancesManager/useInstanceOperations.ts
  기능: 거주 이력 관련 비즈니스 로직을 처리하는 커스텀 훅
  책임: CRUD 작업과 네비게이션 로직을 캡슐화한다.
*/ // ------------------------------

// #region 커스텀 훅
export function useInstanceOperations() {
  // #region 핸들러
  const handleView = (id: number) => {
    window.location.href = `/preview/household/instances/${id}`;
  };

  const handleEdit = (id: number) => {
    window.location.href = `/preview/household/instances/${id}/edit`;
  };

  const handleSettings = (id: number) => {
    window.location.href = `/preview/household/instances/${id}/settings`;
  };
  // #endregion

  return {
    handleView,
    handleEdit,
    handleSettings
  };
}
// #endregion 