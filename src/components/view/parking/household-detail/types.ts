import type { HouseholdType } from '@/types/household';

// #region 폼 데이터 타입
export interface HouseholdFormData {
  lv1Address: string;
  lv2Address: string;
  lv3Address: string;
  householdType: HouseholdType | '';
  memo: string;
}
// #endregion