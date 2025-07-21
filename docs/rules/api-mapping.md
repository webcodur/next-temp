# API 매핑 테이블

## 파일명 → 함수명 매핑

### Auth 관련
| 엔드포인트 | 파일명 | 함수명 | 설명 |
|---|---|---|---|
| `POST /auth/signin` | `auth_signin_POST.ts` | `createAuthSignin()` | 로그인 |
| `GET /auth/logout` | `auth_logout_GET.ts` | `getAuthLogout()` | 로그아웃 |
| `POST /auth/refresh` | `auth_refresh_POST.ts` | `createAuthRefresh()` | 토큰 갱신 |

### Admin 관련
| 엔드포인트 | 파일명 | 함수명 | 설명 |
|---|---|---|---|
| `POST /admins` | `admin_POST.ts` | `createAdmin()` | 관리자 생성 |
| `GET /admins/search` | `admin$_GET.ts` | `searchAdmin()` | 관리자 검색 |
| `GET /admins/{id}` | `admin@id_GET.ts` | `getAdminDetail()` | 관리자 상세 |
| `PUT /admins/{id}` | `admin@id_PUT.ts` | `updateAdmin()` | 관리자 수정 |
| `DELETE /admins/{id}` | `admin@id_DELETE.ts` | `deleteAdmin()` | 관리자 삭제 |



### System Config 관련
| 엔드포인트 | 파일명 | 함수명 | 설명 |
|---|---|---|---|
| `GET /system-config` | `systemConfig_GET.ts` | `getSystemConfigList()` | 모든 설정값 조회 |
| `GET /system-config/{key}` | `systemConfig@key_GET.ts` | `getSystemConfigDetail()` | 설정값 조회 |
| `PUT /system-config/{key}` | `systemConfig@key_PUT.ts` | `updateSystemConfig()` | 설정값 업데이트 |

### IP Block 관련
| 엔드포인트 | 파일명 | 함수명 | 설명 |
|---|---|---|---|
| `GET /ip-blocks` | `ipBlock_GET.ts` | `getIpBlockList()` | 차단된 IP 목록 |
| `DELETE /ip-blocks` | `ipBlock_DELETE.ts` | `deleteIpBlock()` | 모든 IP 차단 해제 |
| `GET /ip-blocks/history/search` | `ipBlock_history$_GET.ts` | `searchIpBlockHistory()` | 차단 이력 검색 |
| `DELETE /ip-blocks/{ip}` | `ipBlock@ip_DELETE.ts` | `deleteIpBlockByIp()` | 특정 IP 차단 해제 |

### Cache Management 관련
| 엔드포인트 | 파일명 | 함수명 | 설명 |
|---|---|---|---|
| `GET /cache/stats` | `cache_stats_GET.ts` | `getCacheStats()` | 캐시 통계 조회 |
| `GET /cache/namespace/{namespace}/stats` | `cache_namespace@namespace_stats_GET.ts` | `getCacheNamespaceStats()` | 네임스페이스별 캐시 통계 |
| `DELETE /cache/namespace/{namespace}` | `cache_namespace@namespace_DELETE.ts` | `deleteCacheNamespace()` | 네임스페이스 캐시 삭제 |
| `DELETE /cache/menu` | `cache_menu_DELETE.ts` | `deleteCacheMenu()` | 메뉴 캐시 삭제 |
| `DELETE /cache/user/{userId}/menu` | `cache_user@userId_menu_DELETE.ts` | `deleteCacheUserMenu()` | 사용자 메뉴 캐시 삭제 |

### Menu Management 관련
| 엔드포인트 | 파일명 | 함수명 | 설명 |
|---|---|---|---|
| `GET /menus/my-menus` | `menu_myMenu$_GET.ts` | `getMyMenuList()` | 내 권한 메뉴 조회 |
| `GET /menus/all` | `menu_all_GET.ts` | `getAllMenuList()` | 모든 메뉴 조회 |
| `GET /menus/breadcrumb/{menuId}` | `menu_breadcrumb@menuId_GET.ts` | `getMenuBreadcrumb()` | 메뉴 breadcrumb |
| `PUT /menus/{menuId}/order` | `menu@menuId_order_PUT.ts` | `updateMenuOrder()` | 메뉴 순서 변경 |
| `PUT /menus/batch-order` | `menu_batchOrder_PUT.ts` | `updateMenuBatchOrder()` | 메뉴 순서 일괄 변경 |
| `GET /menus/parking-lot/{parkingLotId}` | `menu_parkingLot@parkingLotId_GET.ts` | `getMenuByParkingLot()` | 주차장별 메뉴 조회 |
| `PUT /menus/parking-lot/{parkingLotId}/assign` | `menu_parkingLot@parkingLotId_assign_PUT.ts` | `updateMenuParkingLotAssign()` | 주차장에 메뉴 할당 |
| `PUT /menus/parking-lot/{parkingLotId}/remove` | `menu_parkingLot@parkingLotId_remove_PUT.ts` | `updateMenuParkingLotRemove()` | 주차장에서 메뉴 제거 |
| `PUT /menus/parking-lots/bulk-assign` | `menu_parkingLot_bulkAssign_PUT.ts` | `updateMenuParkingLotBulkAssign()` | 여러 주차장에 메뉴 일괄 할당 |
| `PUT /menus/parking-lot/{parkingLotId}/assign-admin` | `menu_parkingLot@parkingLotId_assignAdmin_PUT.ts` | `updateMenuParkingLotAssignAdmin()` | 주차장에 관리자 할당 |
| `PUT /menus/parking-lot/{parkingLotId}/remove-admin` | `menu_parkingLot@parkingLotId_removeAdmin_PUT.ts` | `updateMenuParkingLotRemoveAdmin()` | 주차장에서 관리자 제거 |
| `POST /menus/cleanup-duplicates` | `menu_cleanupDuplicate_POST.ts` | `createMenuCleanupDuplicate()` | 중복 메뉴 정리 |

### Resident 관련
| 엔드포인트 | 파일명 | 함수명 | 설명 |
|---|---|---|---|
| `GET /residents` | `resident$_GET.ts` | `searchResident()` | 거주자 목록/검색 |
| `POST /residents` | `resident_POST.ts` | `createResident()` | 거주자 생성 |
| `GET /residents/{id}` | `resident@id_GET.ts` | `getResidentDetail()` | 거주자 상세 |
| `PATCH /residents/{id}` | `resident@id_PATCH.ts` | `updateResident()` | 거주자 수정 |
| `DELETE /residents/{id}` | `resident@id_DELETE.ts` | `deleteResident()` | 거주자 삭제 |
| `POST /residents/households` | `resident_household_POST.ts` | `createResidentHousehold()` | 거주자-세대 관계 생성 |
| `PATCH /residents/households/{id}` | `resident_household@id_PATCH.ts` | `updateResidentHousehold()` | 거주자-세대 관계 수정 |
| `DELETE /residents/households/{id}` | `resident_household@id_DELETE.ts` | `deleteResidentHousehold()` | 거주자-세대 관계 삭제 |

### Household 관련
| 엔드포인트 | 파일명 | 함수명 | 설명 |
|---|---|---|---|
| `GET /households` | `household$_GET.ts` | `searchHousehold()` | 세대 목록/검색 |
| `POST /households` | `household_POST.ts` | `createHousehold()` | 세대 생성 |
| `GET /households/admin-view` | `household_adminView$_GET.ts` | `getHouseholdAdminView()` | 관리자별 세대 목록 |
| `GET /households/instances` | `household_instance$_GET.ts` | `searchHouseholdInstance()` | 세대 인스턴스 목록 |
| `GET /households/admin-summary` | `household_adminSummary_GET.ts` | `getHouseholdAdminSummary()` | 관리자별 세대 요약 |
| `GET /households/all-admin-summary` | `household_allAdminSummary_GET.ts` | `getHouseholdAllAdminSummary()` | 전체 관리자 세대 현황 |
| `GET /households/{id}` | `household@id_GET.ts` | `getHouseholdDetail()` | 세대 상세 |
| `PUT /households/{id}` | `household@id_PUT.ts` | `updateHousehold()` | 세대 수정 |
| `DELETE /households/{id}` | `household@id_DELETE.ts` | `deleteHousehold()` | 세대 삭제 |
| `POST /households/{id}/instances` | `household@id_instance_POST.ts` | `createHouseholdInstance()` | 세대 인스턴스 생성 |
| `GET /households/{id}/instances` | `household@id_instance$_GET.ts` | `searchHouseholdInstanceById()` | 세대별 인스턴스 목록 |
| `GET /households/instances/{instanceId}` | `household_instance@instanceId_GET.ts` | `getHouseholdInstanceDetail()` | 세대 인스턴스 상세 |
| `PUT /households/instances/{instanceId}` | `household_instance@instanceId_PUT.ts` | `updateHouseholdInstance()` | 세대 인스턴스 수정 |
| `DELETE /households/instances/{instanceId}` | `household_instance@instanceId_DELETE.ts` | `deleteHouseholdInstance()` | 세대 인스턴스 삭제 |
| `POST /households/instances/{instanceId}/service-config` | `household_instance@instanceId_serviceConfig_POST.ts` | `createHouseholdServiceConfig()` | 세대 서비스 설정 생성/수정 |
| `GET /households/instances/{instanceId}/service-config` | `household_instance@instanceId_serviceConfig_GET.ts` | `getHouseholdServiceConfig()` | 세대 서비스 설정 조회 |
| `POST /households/instances/{instanceId}/visit-config` | `household_instance@instanceId_visitConfig_POST.ts` | `createHouseholdVisitConfig()` | 세대 방문 설정 생성/수정 |
| `GET /households/instances/{instanceId}/visit-config` | `household_instance@instanceId_visitConfig_GET.ts` | `getHouseholdVisitConfig()` | 세대 방문 설정 조회 |
| `GET /households/parkinglot/{parkinglotId}/summary` | `household_parkinglot@parkinglotId_summary_GET.ts` | `getHouseholdParkingLotSummary()` | 주차장별 세대 요약 |

## 디렉토리 구조

```
src/services/
├── fetchClient.ts              # 공통 HTTP 클라이언트
├── auth/
│   ├── auth_signin_POST.ts
│   ├── auth_logout_GET.ts
│   └── auth_refresh_POST.ts
├── admin/
│   ├── admin_POST.ts
│   ├── admin$_GET.ts
│   ├── admin@id_GET.ts
│   ├── admin@id_PUT.ts
│   └── admin@id_DELETE.ts
├── systemConfig/
│   ├── systemConfig_GET.ts
│   ├── systemConfig@key_GET.ts
│   └── systemConfig@key_PUT.ts
├── ipBlock/
│   ├── ipBlock_GET.ts
│   ├── ipBlock_DELETE.ts
│   ├── ipBlock_history$_GET.ts
│   └── ipBlock@ip_DELETE.ts
├── cache/
│   ├── cache_stats_GET.ts
│   ├── cache_namespace@namespace_stats_GET.ts
│   ├── cache_namespace@namespace_DELETE.ts
│   ├── cache_menu_DELETE.ts
│   └── cache_user@userId_menu_DELETE.ts
├── menu/
│   ├── menu_myMenu$_GET.ts
│   ├── menu_all_GET.ts
│   ├── menu_breadcrumb@menuId_GET.ts
│   ├── menu@menuId_order_PUT.ts
│   ├── menu_batchOrder_PUT.ts
│   ├── menu_parkingLot@parkingLotId_GET.ts
│   ├── menu_parkingLot@parkingLotId_assign_PUT.ts
│   ├── menu_parkingLot@parkingLotId_remove_PUT.ts
│   ├── menu_parkingLot_bulkAssign_PUT.ts
│   ├── menu_parkingLot@parkingLotId_assignAdmin_PUT.ts
│   ├── menu_parkingLot@parkingLotId_removeAdmin_PUT.ts
│   └── menu_cleanupDuplicate_POST.ts
├── resident/
│   ├── resident$_GET.ts
│   ├── resident_POST.ts
│   ├── resident@id_GET.ts
│   ├── resident@id_PATCH.ts
│   ├── resident@id_DELETE.ts
│   ├── resident_household_POST.ts
│   ├── resident_household@id_PATCH.ts
│   └── resident_household@id_DELETE.ts
└── household/
    ├── household$_GET.ts
    ├── household_POST.ts
    ├── household_adminView$_GET.ts
    ├── household_instance$_GET.ts
    ├── household_adminSummary_GET.ts
    ├── household_allAdminSummary_GET.ts
    ├── household@id_GET.ts
    ├── household@id_PUT.ts
    ├── household@id_DELETE.ts
    ├── household@id_instance_POST.ts
    ├── household@id_instance$_GET.ts
    ├── household_instance@instanceId_GET.ts
    ├── household_instance@instanceId_PUT.ts
    ├── household_instance@instanceId_DELETE.ts
    ├── household_instance@instanceId_serviceConfig_POST.ts
    ├── household_instance@instanceId_serviceConfig_GET.ts
    ├── household_instance@instanceId_visitConfig_POST.ts
    ├── household_instance@instanceId_visitConfig_GET.ts
    └── household_parkinglot@parkinglotId_summary_GET.ts
``` 