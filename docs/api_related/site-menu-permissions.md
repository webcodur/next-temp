# 현장별 메뉴 권한 API 요청

## 요구사항
현장별로 활성화할 메뉴 경로를 관리하는 API 필요

## API 스펙

**조회:** `GET /api/sites/{siteId}/menus`
**응답:** 문자열 배열 (활성화된 메뉴 경로들)

**설정:** `PUT /api/sites/{siteId}/menus`  
**요청:** `{ "menuPaths": ["경로1", "경로2"] }`

## 메뉴 경로 목록

```
/parking/facility/info
/parking/facility/admin
/parking/facility/barrier
/parking/facility/entry
/member/entryexit
/member/member
/member/visitor
/member/household
/member/blacklist
/parking/stores/status
/parking/security/patrol-log
/parking/security/patrol-config
/parking/payment/discounts
/parking/payment/settlement
/parking/payment/billing
/community/facilities/registration
/community/facilities/reservations
/community/facilities/access
/community/facilities/settlement
/community/communication/board
/community/communication/suggestions
/community/services/maintenance-fee
/community/services/voting
/community/services/delivery
``` 