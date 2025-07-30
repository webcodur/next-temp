/**
 * Menu 관련 타입 정의 (camelCase 기준)
 */

// #region 메뉴 기본 타입
/**
 * 메뉴 기본 정보 타입
 */
export interface Menu {
  id: number;
  parentId?: number;
  name: string;
  path?: string;
  icon?: string;
  order: number;
  isVisible: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  // 관계 정보
  children?: Menu[];
  parent?: Menu;
  parkingLots?: ParkingLotMenu[];
}

/**
 * 메뉴 트리 구조 타입 (계층형)
 */
export interface MenuTree extends Menu {
  children: MenuTree[];
  level: number;
  fullPath: string;
}

/**
 * 메뉴 순서 변경 요청 타입
 */
export interface UpdateMenuOrderRequest {
  newOrder: number;
}
// #endregion

// #region 주차장-메뉴 관계 타입
/**
 * 주차장별 메뉴 할당 정보 타입
 */
export interface ParkingLotMenu {
  id: number;
  parkingLotId: number;
  menuId: number;
  createdAt: string;
  updatedAt: string;
  // 관계 정보
  parkingLot?: ParkingLot;
  menu?: Menu;
}

/**
 * 주차장 기본 정보 타입 (메뉴 관련)
 */
export interface ParkingLot extends Record<string, unknown> {
  id: number;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

/**
 * 주차장에 메뉴 할당 요청 타입
 */
export interface AssignMenuToParkingLotRequest {
  menuIds: number[];
}

/**
 * 주차장에서 메뉴 제거 요청 타입
 */
export interface RemoveMenuFromParkingLotRequest {
  menuIds: number[];
}

/**
 * 여러 주차장에 메뉴 일괄 할당 요청 타입
 */
export interface BulkAssignMenuRequest {
  parkingLotIds: number[];
  menuIds: number[];
}
// #endregion

// #region 응답 타입
/**
 * 전체 메뉴 목록 응답 타입
 */
export interface MenuListResponse {
  menus: MenuTree[];
  totalCount: number;
}

/**
 * 주차장별 메뉴 응답 타입
 */
export interface ParkingLotMenuResponse {
  parkingLot: ParkingLot;
  menus: MenuTree[];
  totalMenuCount: number;
}

/**
 * 메뉴 할당 결과 응답 타입
 */
export interface MenuAssignmentResponse {
  assignedCount: number;
  skippedCount: number;
  assignedMenus: Menu[];
  skippedMenus: Menu[];
  message: string;
}

/**
 * 메뉴 제거 결과 응답 타입
 */
export interface MenuRemovalResponse {
  removedCount: number;
  removedMenus: Menu[];
  message: string;
}

/**
 * 일괄 할당 결과 응답 타입
 */
export interface BulkAssignmentResponse {
  successfulAssignments: {
    parkingLotId: number;
    assignedMenuIds: number[];
  }[];
  failedAssignments: {
    parkingLotId: number;
    error: string;
  }[];
  totalAssignedCount: number;
  message: string;
}
// #endregion

// #region 메뉴 유틸리티 타입
/**
 * 메뉴 아이콘 매핑 타입
 */
export interface MenuIconMapping {
  [menuName: string]: string;
}

/**
 * 메뉴 권한 타입
 */
export interface MenuPermission {
  menuId: number;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

/**
 * 사용자별 메뉴 권한 타입
 */
export interface UserMenuPermissions {
  userId: number;
  permissions: MenuPermission[];
}
// #endregion 