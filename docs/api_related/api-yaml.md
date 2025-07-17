openapi: 3.0.0
paths:
  /:
    get:
      operationId: AppController_getHello
      parameters: []
      responses:
        '200':
          description: ''
      tags:
        - App
  /auth/signin:
    post:
      operationId: AuthController_signIn
      parameters: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AuthDto'
      responses:
        '200':
          description: Successful sign in
      summary: User sign in
      tags:
        - Auth
  /auth/logout:
    get:
      operationId: AuthController_logout
      parameters: []
      responses:
        '200':
          description: Logout successful
      security:
        - bearer: []
      summary: User logout
      tags:
        - Auth
  /auth/refresh:
    post:
      description: Use refresh token to get new access and refresh tokens
      operationId: AuthController_refresh
      parameters: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RefreshTokenDto'
      responses:
        '200':
          description: Token refreshed successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TokenResponseDto'
      summary: Refresh access token
      tags:
        - Auth
  /admins:
    post:
      operationId: AdminController_createAdmin
      parameters: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateAdminDto'
      responses:
        '200':
          description: 관리자 생성 성공.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AdminListDto'
      security:
        - bearer: []
      summary: 관리자 생성
      tags:
        - Admin
  /admins/search:
    get:
      description: >-
        쿼리 조건에 따라 관리자 목록과 페이지 정보를 검색합니다. (쿼리 파라미터: account, name, role_id,
        email, page, limit)
      operationId: AdminController_searchAdmins
      parameters:
        - name: account
          required: false
          in: query
          description: 계정명으로 검색
          schema:
            type: string
        - name: name
          required: false
          in: query
          description: 이름으로 검색
          schema:
            type: string
        - name: role_id
          required: false
          in: query
          description: 역할 ID로 검색
          schema:
            example: 1
            type: number
        - name: email
          required: false
          in: query
          description: 이메일로 검색
          schema:
            type: string
        - name: page
          required: false
          in: query
          description: '페이지 번호 (기본값: 1)'
          schema:
            default: 1
            example: 1
            type: number
        - name: limit
          required: false
          in: query
          description: '페이지당 아이템 수 (기본값: 10)'
          schema:
            default: 10
            example: 10
            type: number
      responses:
        '200':
          description: 관리자 목록 검색 성공.
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/PageDto'
                  - properties:
                      data:
                        type: array
                        items:
                          $ref: '#/components/schemas/AdminListDto'
      security:
        - bearer: []
      summary: 관리자 검색
      tags:
        - Admin
  /admins/{id}:
    get:
      description: 관리자 ID로 관리자 상세 정보를 조회합니다.
      operationId: AdminController_getAdmin
      parameters:
        - name: id
          required: true
          in: path
          description: 관리자 ID
          schema:
            type: integer
      responses:
        '200':
          description: 관리자 상세 조회 성공.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AdminListDto'
      security:
        - bearer: []
      summary: 관리자 상세 조회
      tags:
        - Admin
    put:
      description: 관리자 정보를 업데이트합니다.
      operationId: AdminController_updateAdmin
      parameters:
        - name: id
          required: true
          in: path
          description: 관리자 ID
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateAdminDto'
      responses:
        '200':
          description: 관리자 업데이트 성공.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AdminListDto'
        '400':
          description: Invalid input data
        '404':
          description: Admin not found
      security:
        - bearer: []
      summary: 관리자 업데이트
      tags:
        - Admin
    delete:
      description: 최고 관리자가 관리자 ID로 관리자를 삭제합니다.
      operationId: AdminController_remove
      parameters:
        - name: id
          required: true
          in: path
          description: 관리자 ID
          schema:
            type: integer
      responses:
        '204':
          description: 관리자 삭제 성공.
      security:
        - bearer: []
      summary: 관리자 삭제
      tags:
        - Admin
  /system-config/{key}:
    get:
      description: 주어진 키에 따라 설정값을 조회합니다.
      operationId: ConfigCacheController_getConfig
      parameters:
        - name: key
          required: true
          in: path
          description: 설정값 키
          schema:
            example: BLOCK_DURATION
            type: string
      responses:
        '200':
          description: 설정값 조회 성공
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  data:
                    $ref: '#/components/schemas/ConfigListDto'
                  timestamp:
                    type: string
                    format: date-time
      security:
        - bearer: []
      summary: 설정값 조회
      tags:
        - System Config Management
    put:
      description: 설정값을 업데이트합니다.
      operationId: ConfigCacheController_updateConfig
      parameters:
        - name: key
          required: true
          in: path
          description: 설정값 키
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateConfigDto'
      responses:
        '200':
          description: 설정값 업데이트 성공
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  data:
                    $ref: '#/components/schemas/ConfigListDto'
                  timestamp:
                    type: string
                    format: date-time
      security:
        - bearer: []
      summary: 설정값 업데이트
      tags:
        - System Config Management
  /system-config:
    get:
      description: 모든 설정값을 조회합니다.
      operationId: ConfigCacheController_getAllConfigs
      parameters: []
      responses:
        '200':
          description: 모든 설정값 조회 성공
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/ConfigListDto'
                  message:
                    type: string
                    example: 5 configs loaded
                  timestamp:
                    type: string
                    format: date-time
      security:
        - bearer: []
      summary: 모든 설정값 조회
      tags:
        - System Config Management
  /ip-blocks:
    get:
      description: Redis에 저장된 모든 차단된 IP 주소와 상세 정보를 조회합니다.
      operationId: IpBlockController_getBlockedIps
      parameters: []
      responses:
        '200':
          description: 차단된 IP 목록 조회 성공
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/BlockedIpDto'
                  message:
                    type: string
                    example: 5 blocked IPs found
                  timestamp:
                    type: string
                    format: date-time
      security:
        - bearer: []
      summary: 차단된 IP 목록 조회
      tags:
        - IP Block Management
    delete:
      description: Redis에 저장된 모든 차단된 IP 주소를 해제합니다.
      operationId: IpBlockController_unblockAllIps
      parameters: []
      responses:
        '200':
          description: 모든 IP 차단 해제 성공
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  data:
                    type: object
                    properties:
                      unblockedCount:
                        type: number
                        example: 5
                  message:
                    type: string
                    example: 5 IPs have been unblocked
                  timestamp:
                    type: string
                    format: date-time
      security:
        - bearer: []
      summary: 모든 IP 차단 해제
      tags:
        - IP Block Management
  /ip-blocks/history/search:
    get:
      description: '쿼리 조건에 따라 차단 이력을 검색합니다. (쿼리 파라미터: page, limit)'
      operationId: IpBlockController_searchBlockHistory
      parameters:
        - name: page
          required: false
          in: query
          description: 페이지 번호
          schema:
            default: 1
            type: number
        - name: limit
          required: false
          in: query
          description: 페이지당 아이템 수
          schema:
            default: 10
            type: number
        - name: ip
          required: false
          in: query
          description: IP 주소
          schema:
            type: string
        - name: blockType
          required: false
          in: query
          description: Block Type
          schema:
            type: string
        - name: userAgent
          required: false
          in: query
          description: User-Agent
          schema:
            type: string
        - name: requestMethod
          required: false
          in: query
          description: Request Method
          schema:
            type: string
        - name: requestUrl
          required: false
          in: query
          description: Request URL
          schema:
            type: string
        - name: blockReason
          required: false
          in: query
          description: 차단 사유
          schema:
            type: string
        - name: matchedPattern
          required: false
          in: query
          description: Matched Pattern
          schema:
            type: string
        - name: blockDuration
          required: false
          in: query
          description: Block Duration
          schema:
            type: number
        - name: isActive
          required: false
          in: query
          description: 활성화 여부
          schema:
            type: number
        - name: unblockedStartDate
          required: false
          in: query
          description: 차단 해제 날짜(시작)
          schema:
            type: string
        - name: unblockedEndDate
          required: false
          in: query
          description: 차단 해제 날짜(종료)
          schema:
            type: string
        - name: unblockedBy
          required: false
          in: query
          description: 차단 해제 사용자
          schema:
            type: string
        - name: startDate
          required: false
          in: query
          description: 차단 날짜(시작) (YYYY-MM-DD)
          schema:
            example: '2025-01-01'
            type: string
        - name: endDate
          required: false
          in: query
          description: 차단 날짜(종료) (YYYY-MM-DD)
          schema:
            example: '2025-12-31'
            type: string
      responses:
        '200':
          description: 차단 이력 조회 성공.
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/PageDto'
                  - properties:
                      data:
                        type: array
                        items:
                          $ref: '#/components/schemas/BlockHistoryDto'
      security:
        - bearer: []
      summary: 차단 이력 검색
      tags:
        - IP Block Management
  /ip-blocks/{ip}:
    delete:
      description: 지정된 IP 주소의 차단을 해제합니다.
      operationId: IpBlockController_unblockIp
      parameters:
        - name: ip
          required: true
          in: path
          description: 차단 해제할 IP 주소
          schema:
            type: string
      responses:
        '200':
          description: IP 차단 해제 성공
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  data:
                    type: object
                    properties:
                      ip:
                        type: string
                        example: 192.168.1.100
                      unblocked:
                        type: boolean
                        example: true
                  message:
                    type: string
                    example: IP 192.168.1.100 has been unblocked
                  timestamp:
                    type: string
                    format: date-time
      security:
        - bearer: []
      summary: 특정 IP 차단 해제
      tags:
        - IP Block Management
  /cache/stats:
    get:
      description: 전체 캐시 상태와 통계를 조회합니다.
      operationId: CacheManagementController_getCacheStats
      parameters: []
      responses:
        '200':
          description: Cache statistics retrieved successfully
      security:
        - bearer: []
      summary: 캐시 통계 조회
      tags:
        - Cache Management
  /cache/namespace/{namespace}/stats:
    get:
      description: 특정 네임스페이스의 캐시 통계를 조회합니다.
      operationId: CacheManagementController_getNamespaceStats
      parameters:
        - name: namespace
          required: true
          in: path
          schema:
            type: string
      responses:
        '200':
          description: Namespace cache statistics retrieved successfully
      security:
        - bearer: []
      summary: 네임스페이스별 캐시 통계 조회
      tags:
        - Cache Management
  /cache/namespace/{namespace}:
    delete:
      description: 특정 네임스페이스의 모든 캐시를 삭제합니다.
      operationId: CacheManagementController_clearNamespaceCache
      parameters:
        - name: namespace
          required: true
          in: path
          schema:
            type: string
      responses:
        '200':
          description: Namespace cache cleared successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  deletedCount:
                    type: number
                  namespace:
                    type: string
      security:
        - bearer: []
      summary: 네임스페이스 캐시 삭제
      tags:
        - Cache Management
  /cache/menu:
    delete:
      description: 모든 메뉴 관련 캐시를 삭제합니다.
      operationId: CacheManagementController_clearMenuCache
      parameters: []
      responses:
        '200':
          description: Menu cache cleared successfully
      security:
        - bearer: []
      summary: 메뉴 캐시 삭제
      tags:
        - Cache Management
  /cache/user/{userId}/menu:
    delete:
      description: 특정 사용자의 모든 메뉴 캐시를 삭제합니다.
      operationId: CacheManagementController_clearUserMenuCache
      parameters:
        - name: userId
          required: true
          in: path
          schema:
            type: string
      responses:
        '200':
          description: User menu cache cleared successfully
      security:
        - bearer: []
      summary: 특정 사용자 메뉴 캐시 삭제
      tags:
        - Cache Management
  /menus/my-menus:
    get:
      description: 현재 로그인한 사용자의 권한과 선택한 주차장에 따라 접근 가능한 메뉴 목록을 계층 구조로 반환합니다.
      operationId: MenuController_getMyMenus
      parameters:
        - name: parkingLotId
          required: false
          in: query
          description: 조회할 주차장 ID (미지정시 첫 번째 주차장)
          schema:
            type: string
      responses:
        '200':
          description: Menu retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MenuListResponseDto'
        '401':
          description: Unauthorized user
        '403':
          description: No access to specified parking lot
        '404':
          description: User or parking lot not found
      security:
        - bearer: []
      summary: 내 권한에 따른 메뉴 조회
      tags:
        - Menu Management
  /menus/all:
    get:
      description: 시스템의 모든 메뉴를 계층 구조로 반환합니다. 관리자 권한이 필요합니다.
      operationId: MenuController_getAllMenus
      parameters: []
      responses:
        '200':
          description: All menus retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MenuListResponseDto'
        '401':
          description: Unauthorized user
        '403':
          description: Insufficient permissions (Admin access required)
      security:
        - bearer: []
      summary: 모든 메뉴 조회 (관리자 전용)
      tags:
        - Menu Management
  /menus/breadcrumb/{menuId}:
    get:
      description: 특정 메뉴의 breadcrumb 경로를 반환합니다.
      operationId: MenuController_getMenuBreadcrumb
      parameters:
        - name: menuId
          required: true
          in: path
          description: 메뉴 ID
          schema:
            type: string
      responses:
        '200':
          description: Breadcrumb retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/MenuResponseDto'
        '401':
          description: Unauthorized user
        '404':
          description: Menu not found
      security:
        - bearer: []
      summary: 메뉴 breadcrumb 조회
      tags:
        - Menu Management
  /menus/{menuId}/order:
    put:
      description: 특정 메뉴의 순서를 변경합니다. 같은 부모를 가진 메뉴들 내에서만 순서를 변경할 수 있습니다.
      operationId: MenuController_updateMenuOrder
      parameters:
        - name: menuId
          required: true
          in: path
          description: 순서를 변경할 메뉴 ID
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateMenuOrderDto'
      responses:
        '200':
          description: Menu order updated successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: Menu order updated successfully
        '400':
          description: Invalid request (Invalid order)
        '401':
          description: Unauthorized user
        '403':
          description: Insufficient permissions (Admin access required)
        '404':
          description: Menu not found
      security:
        - bearer: []
      summary: 메뉴 순서 변경 (관리자 전용)
      tags:
        - Menu Management
  /menus/batch-order:
    put:
      description: 여러 메뉴의 순서를 일괄로 변경합니다. 모든 메뉴는 같은 부모를 가져야 합니다.
      operationId: MenuController_batchUpdateMenuOrder
      parameters: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BatchUpdateMenuOrderDto'
      responses:
        '200':
          description: Menu order batch updated successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: Menu order batch updated successfully
        '400':
          description: Invalid request (Different parents, duplicate orders, etc.)
        '401':
          description: Unauthorized user
        '403':
          description: Insufficient permissions (Admin access required)
        '404':
          description: Some menus not found
      security:
        - bearer: []
      summary: 메뉴 순서 일괄 변경 (관리자 전용)
      tags:
        - Menu Management
  /menus/parking-lot/{parkingLotId}:
    get:
      description: 특정 주차장에 할당된 메뉴 목록을 계층 구조로 반환합니다.
      operationId: MenuController_getMenusByParkingLot
      parameters:
        - name: parkingLotId
          required: true
          in: path
          description: 주차장 ID
          schema:
            type: string
      responses:
        '200':
          description: Parking lot menus retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ParkingLotMenuResponseDto'
        '401':
          description: Unauthorized user
        '403':
          description: Insufficient permissions (Admin access required)
        '404':
          description: Parking lot not found or inactive
      security:
        - bearer: []
      summary: 주차장별 메뉴 조회 (관리자 전용)
      tags:
        - Menu Management
  /menus/parking-lot/{parkingLotId}/assign:
    put:
      description: 특정 주차장에 메뉴를 할당합니다. 이미 할당된 메뉴는 제외됩니다.
      operationId: MenuController_assignMenuToParkingLot
      parameters:
        - name: parkingLotId
          required: true
          in: path
          description: 주차장 ID
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AssignMenuToParkingLotDto'
      responses:
        '200':
          description: Menus assigned to parking lot successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: 3 menus assigned to parking lot successfully
                  assignedCount:
                    type: number
                    example: 3
        '400':
          description: Invalid request
        '401':
          description: Unauthorized user
        '403':
          description: Insufficient permissions (Admin access required)
        '404':
          description: Parking lot or some menus not found
      security:
        - bearer: []
      summary: 주차장에 메뉴 할당 (관리자 전용)
      tags:
        - Menu Management
  /menus/parking-lot/{parkingLotId}/remove:
    put:
      description: 특정 주차장에서 메뉴를 제거합니다.
      operationId: MenuController_removeMenuFromParkingLot
      parameters:
        - name: parkingLotId
          required: true
          in: path
          description: 주차장 ID
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RemoveMenuFromParkingLotDto'
      responses:
        '200':
          description: Menus removed from parking lot successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: 2 menus removed from parking lot successfully
                  removedCount:
                    type: number
                    example: 2
        '400':
          description: Invalid request
        '401':
          description: Unauthorized user
        '403':
          description: Insufficient permissions (Admin access required)
        '404':
          description: Parking lot not found
      security:
        - bearer: []
      summary: 주차장에서 메뉴 제거 (관리자 전용)
      tags:
        - Menu Management
  /menus/parking-lots/bulk-assign:
    put:
      description: 여러 주차장에 메뉴를 일괄로 할당합니다. 이미 할당된 조합은 제외됩니다.
      operationId: MenuController_bulkAssignMenuToParkingLots
      parameters: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BulkAssignMenuToParkingLotsDto'
      responses:
        '200':
          description: Menus bulk assigned to parking lots successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: 12 menu assignments created successfully
                  totalAssigned:
                    type: number
                    example: 12
        '400':
          description: Invalid request
        '401':
          description: Unauthorized user
        '403':
          description: Insufficient permissions (Admin access required)
        '404':
          description: Some parking lots or menus not found
      security:
        - bearer: []
      summary: 여러 주차장에 메뉴 일괄 할당 (관리자 전용)
      tags:
        - Menu Management
  /menus/parking-lot/{parkingLotId}/assign-admin:
    put:
      description: 특정 주차장에 관리자를 할당합니다. 이미 할당된 관리자는 제외됩니다.
      operationId: MenuController_assignAdminToParkingLot
      parameters:
        - name: parkingLotId
          required: true
          in: path
          description: 주차장 ID
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AssignAdminToParkingLotDto'
      responses:
        '200':
          description: Admins assigned to parking lot successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: 3 admins assigned to parking lot successfully
                  assignedCount:
                    type: number
                    example: 3
        '400':
          description: Invalid request
        '401':
          description: Unauthorized user
        '403':
          description: Insufficient permissions (Admin access required)
        '404':
          description: Parking lot or some admins not found
      security:
        - bearer: []
      summary: 주차장에 관리자 할당 (관리자 전용)
      tags:
        - Menu Management
  /menus/parking-lot/{parkingLotId}/remove-admin:
    put:
      description: 특정 주차장에서 관리자를 제거합니다.
      operationId: MenuController_removeAdminFromParkingLot
      parameters:
        - name: parkingLotId
          required: true
          in: path
          description: 주차장 ID
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RemoveAdminFromParkingLotDto'
      responses:
        '200':
          description: Admins removed from parking lot successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: 2 admins removed from parking lot successfully
                  removedCount:
                    type: number
                    example: 2
        '400':
          description: Invalid request
        '401':
          description: Unauthorized user
        '403':
          description: Insufficient permissions (Admin access required)
        '404':
          description: Parking lot not found
      security:
        - bearer: []
      summary: 주차장에서 관리자 제거 (관리자 전용)
      tags:
        - Menu Management
  /menus/cleanup-duplicates:
    post:
      description: 동일한 이름의 중복된 메뉴를 정리합니다. 가장 작은 ID를 가진 메뉴만 유지합니다.
      operationId: MenuController_cleanupDuplicateMenus
      parameters: []
      responses:
        '200':
          description: Duplicate menus cleaned up successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: Duplicate menus cleaned up successfully
        '403':
          description: Access denied - Admin role required
      security:
        - bearer: []
      summary: 중복 메뉴 정리 (관리자 전용)
      tags:
        - Menu Management
  /residents:
    post:
      description: 새로운 거주자를 생성합니다.
      operationId: ResidentController_createResident
      parameters: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateResidentDto'
      responses:
        '201':
          description: ''
      security:
        - bearer: []
      summary: 거주자 생성
      tags:
        - 거주자 관리
    get:
      description: 거주자 목록을 조회합니다.
      operationId: ResidentController_findAllResidents
      parameters:
        - name: page
          required: false
          in: query
          description: 페이지 번호
          schema:
            default: 1
            type: number
        - name: limit
          required: false
          in: query
          description: 페이지당 아이템 수
          schema:
            default: 10
            type: number
        - name: name
          required: false
          in: query
          description: 거주자 이름
          schema:
            type: string
        - name: phone
          required: false
          in: query
          description: 전화번호
          schema:
            type: string
        - name: email
          required: false
          in: query
          description: 이메일
          schema:
            type: string
        - name: gender
          required: false
          in: query
          description: 성별
          schema:
            enum:
              - M
              - F
            type: string
      responses:
        '200':
          description: ''
      security:
        - bearer: []
      summary: 거주자 목록 조회
      tags:
        - 거주자 관리
  /residents/{id}:
    get:
      description: 특정 거주자의 상세 정보를 조회합니다.
      operationId: ResidentController_findOneResident
      parameters:
        - name: id
          required: true
          in: path
          schema:
            type: string
      responses:
        '200':
          description: ''
      security:
        - bearer: []
      summary: 거주자 상세 조회
      tags:
        - 거주자 관리
    patch:
      description: 특정 거주자의 정보를 수정합니다.
      operationId: ResidentController_updateResident
      parameters:
        - name: id
          required: true
          in: path
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateResidentDto'
      responses:
        '200':
          description: ''
      security:
        - bearer: []
      summary: 거주자 수정
      tags:
        - 거주자 관리
    delete:
      description: 특정 거주자를 삭제합니다.
      operationId: ResidentController_removeResident
      parameters:
        - name: id
          required: true
          in: path
          schema:
            type: string
      responses:
        '200':
          description: ''
      security:
        - bearer: []
      summary: 거주자 삭제
      tags:
        - 거주자 관리
  /residents/households:
    post:
      description: 거주자와 세대 간의 관계를 생성합니다.
      operationId: ResidentController_createResidentHousehold
      parameters: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateResidentHouseholdDto'
      responses:
        '201':
          description: ''
      security:
        - bearer: []
      summary: 거주자-세대 관계 생성
      tags:
        - 거주자 관리
  /residents/households/{id}:
    patch:
      description: 거주자와 세대 간의 관계를 수정합니다.
      operationId: ResidentController_updateResidentHousehold
      parameters:
        - name: id
          required: true
          in: path
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateResidentHouseholdDto'
      responses:
        '200':
          description: ''
      security:
        - bearer: []
      summary: 거주자-세대 관계 수정
      tags:
        - 거주자 관리
    delete:
      description: 거주자와 세대 간의 관계를 삭제합니다.
      operationId: ResidentController_removeResidentHousehold
      parameters:
        - name: id
          required: true
          in: path
          schema:
            type: string
      responses:
        '200':
          description: ''
      security:
        - bearer: []
      summary: 거주자-세대 관계 삭제
      tags:
        - 거주자 관리
  /households:
    post:
      description: 새로운 세대(물리적 공간)를 생성합니다.
      operationId: HouseholdController_createHousehold
      parameters: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateHouseholdDto'
      responses:
        '201':
          description: 세대가 성공적으로 생성되었습니다.
        '400':
          description: 잘못된 요청 데이터
        '409':
          description: 이미 존재하는 세대
      security:
        - bearer: []
      summary: 세대 생성
      tags:
        - 세대 관리
    get:
      description: 등록된 세대 목록을 페이지네이션과 필터링으로 조회합니다.
      operationId: HouseholdController_findAllHouseholds
      parameters:
        - name: page
          required: false
          in: query
          description: '페이지 번호 (기본값: 1)'
          schema:
            default: 1
            type: number
        - name: limit
          required: false
          in: query
          description: '페이지당 항목 수 (기본값: 10)'
          schema:
            default: 10
            type: number
        - name: parkinglot_id
          required: false
          in: query
          description: 주차장 ID 필터
          schema:
            type: number
        - name: household_type
          required: false
          in: query
          description: 세대 유형 필터
          schema:
            enum:
              - GENERAL
              - TEMP
              - COMMERCIAL
            type: string
        - name: address
          required: false
          in: query
          description: 주소 검색어
          schema:
            type: string
      responses:
        '200':
          description: 세대 목록 조회 성공
      security:
        - bearer: []
      summary: 세대 목록 조회
      tags:
        - 세대 관리
  /households/admin-view:
    get:
      description: 현재 관리자가 접근 가능한 모든 세대 정보를 VIEW를 통해 조회합니다.
      operationId: HouseholdController_getAdminHouseholdList
      parameters:
        - name: parkinglot_id
          required: false
          in: query
          description: 주차장 ID 필터
          schema:
            type: number
        - name: household_status
          required: false
          in: query
          description: 세대 상태 필터
          schema:
            type: string
        - name: address
          required: false
          in: query
          description: 주소 검색
          schema:
            type: string
        - name: page
          required: false
          in: query
          description: 페이지 번호
          schema:
            type: number
        - name: limit
          required: false
          in: query
          description: 페이지 크기
          schema:
            type: number
      responses:
        '200':
          description: 관리자별 세대 목록 조회 성공
      security:
        - bearer: []
      summary: 관리자별 세대 목록 조회 (VIEW)
      tags:
        - 세대 관리
  /households/instances:
    get:
      description: 모든 세대 인스턴스 목록을 조회합니다.
      operationId: HouseholdController_findAllHouseholdInstances
      parameters:
        - name: page
          required: false
          in: query
          description: 페이지 번호
          schema:
            default: 1
            type: number
        - name: limit
          required: false
          in: query
          description: 페이지당 아이템 수
          schema:
            default: 10
            type: number
        - name: household_id
          required: false
          in: query
          description: 세대 ID 필터
          schema:
            type: number
        - name: parkinglot_id
          required: false
          in: query
          description: 주차장 ID
          schema:
            type: number
        - name: instance_name
          required: false
          in: query
          description: 인스턴스 이름 검색
          schema:
            type: string
      responses:
        '200':
          description: 세대 인스턴스 목록 조회 성공
      security:
        - bearer: []
      summary: 세대 인스턴스 목록 조회
      tags:
        - 세대 관리
  /households/admin-summary:
    get:
      description: 현재 관리자의 주차장별 세대 현황을 요약합니다.
      operationId: HouseholdController_getAdminHouseholdSummary
      parameters: []
      responses:
        '200':
          description: 관리자별 세대 요약 조회 성공
      security:
        - bearer: []
      summary: 관리자별 세대 요약 통계
      tags:
        - 세대 관리
  /households/all-admin-summary:
    get:
      description: 모든 관리자의 세대 현황을 조회합니다. (시스템 관리자만 접근 가능)
      operationId: HouseholdController_getAllAdminHouseholdSummary
      parameters: []
      responses:
        '200':
          description: 전체 관리자 세대 현황 조회 성공
      security:
        - bearer: []
      summary: 전체 관리자 세대 현황
      tags:
        - 세대 관리
  /households/{id}:
    get:
      description: 특정 세대의 상세 정보와 관련 인스턴스들을 조회합니다.
      operationId: HouseholdController_findOneHousehold
      parameters:
        - name: id
          required: true
          in: path
          description: 세대 ID
          schema:
            type: number
      responses:
        '200':
          description: 세대 조회 성공
        '404':
          description: 세대를 찾을 수 없음
      security:
        - bearer: []
      summary: 세대 상세 조회
      tags:
        - 세대 관리
    put:
      description: 특정 세대의 정보를 수정합니다.
      operationId: HouseholdController_updateHousehold
      parameters:
        - name: id
          required: true
          in: path
          description: 세대 ID
          schema:
            type: number
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateHouseholdDto'
      responses:
        '200':
          description: 세대 수정 성공
        '404':
          description: 세대를 찾을 수 없음
      security:
        - bearer: []
      summary: 세대 정보 수정
      tags:
        - 세대 관리
    delete:
      description: 특정 세대를 삭제합니다 (소프트 삭제).
      operationId: HouseholdController_removeHousehold
      parameters:
        - name: id
          required: true
          in: path
          description: 세대 ID
          schema:
            type: number
      responses:
        '204':
          description: 세대 삭제 성공
        '404':
          description: 세대를 찾을 수 없음
      security:
        - bearer: []
      summary: 세대 삭제
      tags:
        - 세대 관리
  /households/{id}/instances:
    post:
      description: 특정 세대에 새로운 거주 기간(인스턴스)을 생성합니다.
      operationId: HouseholdController_createHouseholdInstance
      parameters:
        - name: id
          required: true
          in: path
          description: 세대 ID
          schema:
            type: number
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateHouseholdInstanceDto'
      responses:
        '201':
          description: 세대 인스턴스가 성공적으로 생성되었습니다.
      security:
        - bearer: []
      summary: 세대 인스턴스 생성
      tags:
        - 세대 관리
    get:
      description: 특정 세대의 모든 인스턴스(거주 기간) 목록을 조회합니다.
      operationId: HouseholdController_findHouseholdInstances
      parameters:
        - name: id
          required: true
          in: path
          description: 세대 ID
          schema:
            type: number
        - name: page
          required: false
          in: query
          description: 페이지 번호
          schema:
            default: 1
            type: number
        - name: limit
          required: false
          in: query
          description: 페이지당 아이템 수
          schema:
            default: 10
            type: number
        - name: household_id
          required: false
          in: query
          description: 세대 ID
          schema:
            type: number
        - name: parkinglot_id
          required: false
          in: query
          description: 주차장 ID
          schema:
            type: number
        - name: instance_name
          required: false
          in: query
          description: 인스턴스 이름
          schema:
            type: string
      responses:
        '200':
          description: 세대별 인스턴스 목록 조회 성공
      security:
        - bearer: []
      summary: 세대별 인스턴스 목록
      tags:
        - 세대 관리
  /households/instances/{instanceId}:
    get:
      description: 특정 세대 인스턴스의 상세 정보를 조회합니다.
      operationId: HouseholdController_findOneHouseholdInstance
      parameters:
        - name: instanceId
          required: true
          in: path
          description: 세대 인스턴스 ID
          schema:
            type: number
      responses:
        '200':
          description: 세대 인스턴스 조회 성공
        '404':
          description: 세대 인스턴스를 찾을 수 없음
      security:
        - bearer: []
      summary: 세대 인스턴스 상세 조회
      tags:
        - 세대 관리
    put:
      description: 특정 세대 인스턴스의 정보를 수정합니다.
      operationId: HouseholdController_updateHouseholdInstance
      parameters:
        - name: instanceId
          required: true
          in: path
          description: 세대 인스턴스 ID
          schema:
            type: number
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateHouseholdInstanceDto'
      responses:
        '200':
          description: 세대 인스턴스 수정 성공
      security:
        - bearer: []
      summary: 세대 인스턴스 수정
      tags:
        - 세대 관리
    delete:
      description: 특정 세대 인스턴스를 삭제합니다 (이사 처리).
      operationId: HouseholdController_removeHouseholdInstance
      parameters:
        - name: instanceId
          required: true
          in: path
          description: 세대 인스턴스 ID
          schema:
            type: number
      responses:
        '204':
          description: 세대 인스턴스 삭제 성공
      security:
        - bearer: []
      summary: 세대 인스턴스 삭제
      tags:
        - 세대 관리
  /households/instances/{instanceId}/service-config:
    post:
      description: 세대 인스턴스의 서비스 설정을 생성하거나 수정합니다.
      operationId: HouseholdController_upsertServiceConfig
      parameters:
        - name: instanceId
          required: true
          in: path
          description: 세대 인스턴스 ID
          schema:
            type: number
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateHouseholdServiceConfigDto'
      responses:
        '201':
          description: 서비스 설정이 성공적으로 저장되었습니다.
      security:
        - bearer: []
      summary: 세대 서비스 설정 생성/수정
      tags:
        - 세대 관리
    get:
      description: 세대 인스턴스의 서비스 설정을 조회합니다.
      operationId: HouseholdController_getServiceConfig
      parameters:
        - name: instanceId
          required: true
          in: path
          description: 세대 인스턴스 ID
          schema:
            type: number
      responses:
        '200':
          description: 서비스 설정 조회 성공
      security:
        - bearer: []
      summary: 세대 서비스 설정 조회
      tags:
        - 세대 관리
  /households/instances/{instanceId}/visit-config:
    post:
      description: 세대 인스턴스의 방문 시간 설정을 생성하거나 수정합니다.
      operationId: HouseholdController_upsertVisitConfig
      parameters:
        - name: instanceId
          required: true
          in: path
          description: 세대 인스턴스 ID
          schema:
            type: number
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateHouseholdVisitConfigDto'
      responses:
        '201':
          description: 방문 설정이 성공적으로 저장되었습니다.
      security:
        - bearer: []
      summary: 세대 방문 설정 생성/수정
      tags:
        - 세대 관리
    get:
      description: 세대 인스턴스의 방문 설정을 조회합니다.
      operationId: HouseholdController_getVisitConfig
      parameters:
        - name: instanceId
          required: true
          in: path
          description: 세대 인스턴스 ID
          schema:
            type: number
      responses:
        '200':
          description: 방문 설정 조회 성공
      security:
        - bearer: []
      summary: 세대 방문 설정 조회
      tags:
        - 세대 관리
  /households/parkinglot/{parkinglotId}/summary:
    get:
      description: 특정 주차장의 세대 현황을 요약합니다.
      operationId: HouseholdController_getHouseholdSummaryByParkinglot
      parameters:
        - name: parkinglotId
          required: true
          in: path
          description: 주차장 ID
          schema:
            type: number
      responses:
        '200':
          description: 세대 요약 조회 성공
      security:
        - bearer: []
      summary: 주차장별 세대 요약
      tags:
        - 세대 관리
info:
  title: New Hub
  description: The New Hub API description
  version: '1.0'
  contact: {}
tags: []
servers: []
components:
  securitySchemes:
    bearer:
      scheme: bearer
      bearerFormat: JWT
      type: http
  schemas:
    AuthDto:
      type: object
      properties:
        account:
          type: string
          description: 사용자 계정
          example: admin
        password:
          type: string
          description: 사용자 비밀번호
          example: admin123!
      required:
        - account
        - password
    RefreshTokenDto:
      type: object
      properties:
        refreshToken:
          type: string
          description: 리프레시 토큰
          example: eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...
      required:
        - refreshToken
    TokenResponseDto:
      type: object
      properties:
        accessToken:
          type: string
          description: 액세스 토큰
          example: eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...
        refreshToken:
          type: string
          description: 리프레시 토큰
          example: eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...
      required:
        - accessToken
        - refreshToken
    CreateAdminDto:
      type: object
      properties:
        account:
          type: string
          description: 관리자 계정명
        role_id:
          type: number
          description: 관리자 역할 ID
          example: 1
        name:
          type: string
          description: 관리자 이름
        email:
          type: string
          description: 이메일 주소
        password:
          type: string
          description: 비밀번호
        phone:
          type: string
          description: 전화번호
      required:
        - account
        - role_id
        - password
    RoleInfo:
      type: object
      properties:
        id:
          type: number
          description: 역할 ID
          example: 1
        code:
          type: string
          description: 역할 코드
          example: ADMIN
        name:
          type: string
          description: 역할 이름
          example: 관리자
        description:
          type: string
          description: 역할 설명
          example: 시스템 관리자
      required:
        - id
        - code
        - name
    AdminListDto:
      type: object
      properties:
        id:
          type: number
          description: 관리자 ID
          example: 1
        account:
          type: string
          description: 관리자 계정명
          example: admin01
        role_id:
          type: number
          description: 관리자 역할 ID
          example: 1
        role:
          description: 관리자 역할 정보
          allOf:
            - $ref: '#/components/schemas/RoleInfo'
        name:
          type: string
          description: 관리자 이름
          example: 홍길동
        email:
          type: string
          description: 이메일 주소
          example: admin@example.com
        phone:
          type: string
          description: 전화번호
          example: 010-1234-5678
        created_at:
          format: date-time
          type: string
          description: 생성일시
          example: '2024-01-01T00:00:00.000Z'
        updated_at:
          format: date-time
          type: string
          description: 수정일시
          example: '2024-01-01T00:00:00.000Z'
        deleted_at:
          format: date-time
          type: string
          description: 삭제일시
          example: null
      required:
        - id
        - account
        - role_id
        - created_at
        - updated_at
    PageMetaDto:
      type: object
      properties:
        totalItems:
          type: number
          description: 전체 아이템 개수
          example: 100
        currentPage:
          type: number
          description: 현재 페이지 번호
          example: 1
        itemsPerPage:
          type: number
          description: 페이지 당 아이템 수
          example: 10
        totalPages:
          type: number
          description: 전체 페이지 수
          example: 10
      required:
        - totalItems
        - currentPage
        - itemsPerPage
        - totalPages
    PageDto:
      type: object
      properties:
        data:
          type: array
          items:
            type: array
        meta:
          $ref: '#/components/schemas/PageMetaDto'
      required:
        - data
        - meta
    UpdateAdminDto:
      type: object
      properties:
        role_id:
          type: number
          description: 관리자 역할 ID
          example: 1
        name:
          type: string
          description: 관리자 이름
        email:
          type: string
          description: 이메일 주소
        password:
          type: string
          description: 비밀번호
        phone:
          type: string
          description: 전화번호
    ConfigListDto:
      type: object
      properties:
        id:
          format: int64
          type: integer
          description: 설정 ID
        configKey:
          type: string
          description: 설정 키
        configValue:
          type: string
          description: 설정 값
        configType:
          type: string
          description: 설정 타입
        isActive:
          type: boolean
          description: 설정 활성화 여부
        createdAt:
          type: object
          description: 설정 생성일시
        updatedAt:
          type: object
          description: 설정 수정일시
      required:
        - id
        - configKey
        - configValue
        - configType
        - isActive
        - createdAt
        - updatedAt
    UpdateConfigDto:
      type: object
      properties:
        config_value:
          type: string
          description: 설정값
          example: '1234567890'
      required:
        - config_value
    ApiResponseDto:
      type: object
      properties:
        success:
          type: boolean
          description: 요청 성공 여부
          example: true
        data:
          type: object
          description: 응답 데이터
        message:
          type: string
          description: 응답 메시지
        timestamp:
          type: string
          description: 응답 시간
          example: '2025-06-11T14:38:49.000Z'
      required:
        - success
        - data
        - timestamp
    BlockedIpDto:
      type: object
      properties:
        ip:
          type: string
          description: IP 주소
          example: 192.168.1.100
        blockedAt:
          format: date-time
          type: string
          description: 차단된 시간
          example: '2025-01-15T10:30:00Z'
        reason:
          type: string
          description: 차단 사유
          example: Bot activity detected
        userAgent:
          type: string
          description: User-Agent
          example: Mozilla/5.0...
        attempts:
          type: number
          description: 시도 횟수
          example: 3
        remainingTime:
          type: number
          description: 남은 차단 시간(초)
          example: 300
        isPermanent:
          type: boolean
          description: 영구 차단 여부
          example: false
      required:
        - ip
        - blockedAt
        - reason
        - attempts
    UnblockIpDto:
      type: object
      properties:
        ip:
          type: string
          description: 차단 해제할 IP 주소
          example: 192.168.1.100
      required:
        - ip
    MenuResponseDto:
      type: object
      properties:
        id:
          type: string
          description: 메뉴 ID
          example: '1'
        name:
          type: string
          description: 메뉴 이름
          example: 주차관리
        url:
          type: string
          description: 메뉴 URL
          example: /parking
        parentId:
          type: string
          description: 부모 메뉴 ID
          example: '0'
        sort:
          type: number
          description: 정렬 순서
          example: 1
        depth:
          type: number
          description: 메뉴 깊이
          example: 1
        children:
          description: 하위 메뉴 목록
          type: array
          items:
            $ref: '#/components/schemas/MenuResponseDto'
      required:
        - id
        - name
        - sort
        - depth
        - children
    UserRoleInfo:
      type: object
      properties:
        id:
          type: string
          description: 역할 ID
          example: '1'
        code:
          type: string
          description: 역할 코드
          example: ADMIN
        name:
          type: string
          description: 역할 이름
          example: 관리자
      required:
        - id
        - code
        - name
    ParkingLotInfo:
      type: object
      properties:
        id:
          type: string
          description: 주차장 ID
          example: '1'
        code:
          type: string
          description: 주차장 코드
          example: LOT001
        name:
          type: string
          description: 주차장 이름
          example: 강남 주차장
        description:
          type: string
          description: 주차장 설명
          example: 강남구 소재 대형 주차장
      required:
        - id
        - code
        - name
    MenuListResponseDto:
      type: object
      properties:
        menus:
          description: 메뉴 목록
          type: array
          items:
            $ref: '#/components/schemas/MenuResponseDto'
        totalCount:
          type: number
          description: 총 메뉴 개수
          example: 15
        userRole:
          description: 사용자 역할 정보
          allOf:
            - $ref: '#/components/schemas/UserRoleInfo'
        parkingLot:
          description: 현재 선택된 주차장 정보
          allOf:
            - $ref: '#/components/schemas/ParkingLotInfo'
        availableParkingLots:
          description: 사용자가 접근 가능한 모든 주차장 목록
          type: array
          items:
            $ref: '#/components/schemas/ParkingLotInfo'
        version:
          type: string
          description: 메뉴 데이터 버전 (캐싱용)
          example: '1704067200000'
        timestamp:
          type: string
          description: 데이터 생성 시간
          example: '2024-01-01T00:00:00Z'
        cacheMaxAge:
          type: number
          description: 캐시 유효 시간 (초)
          example: 1800
      required:
        - menus
        - totalCount
        - userRole
        - availableParkingLots
        - version
        - timestamp
        - cacheMaxAge
    UpdateMenuOrderDto:
      type: object
      properties:
        newOrder:
          type: number
          description: 변경할 순서 (1부터 시작)
          example: 3
      required:
        - newOrder
    MenuOrderItem:
      type: object
      properties:
        menuId:
          type: string
          description: 메뉴 ID
          example: '1'
        order:
          type: number
          description: 새 순서
          example: 1
      required:
        - menuId
        - order
    BatchUpdateMenuOrderDto:
      type: object
      properties:
        items:
          description: 순서를 변경할 메뉴 목록
          example:
            - menuId: '1'
              order: 2
            - menuId: '2'
              order: 1
            - menuId: '3'
              order: 3
          type: array
          items:
            $ref: '#/components/schemas/MenuOrderItem'
      required:
        - items
    ParkingLotMenuResponseDto:
      type: object
      properties:
        parkingLot:
          description: 주차장 정보
          allOf:
            - $ref: '#/components/schemas/ParkingLotInfo'
        menus:
          description: 주차장에 할당된 메뉴 목록
          type: array
          items:
            $ref: '#/components/schemas/MenuResponseDto'
        totalCount:
          type: number
          description: 총 메뉴 개수
          example: 15
        timestamp:
          type: string
          description: 데이터 생성 시간
          example: '2024-01-01T00:00:00Z'
      required:
        - parkingLot
        - menus
        - totalCount
        - timestamp
    AssignMenuToParkingLotDto:
      type: object
      properties:
        menuIds:
          description: 할당할 메뉴 ID 목록
          example:
            - '1'
            - '2'
            - '3'
          type: array
          items:
            type: string
      required:
        - menuIds
    RemoveMenuFromParkingLotDto:
      type: object
      properties:
        menuIds:
          description: 제거할 메뉴 ID 목록
          example:
            - '1'
            - '2'
          type: array
          items:
            type: string
      required:
        - menuIds
    BulkAssignMenuToParkingLotsDto:
      type: object
      properties:
        parkingLotIds:
          description: 대상 주차장 ID 목록
          example:
            - '1'
            - '2'
            - '3'
          type: array
          items:
            type: string
        menuIds:
          description: 할당할 메뉴 ID 목록
          example:
            - '1'
            - '2'
            - '3'
          type: array
          items:
            type: string
      required:
        - parkingLotIds
        - menuIds
    AssignAdminToParkingLotDto:
      type: object
      properties:
        adminIds:
          description: 할당할 관리자 ID 목록
          example:
            - '1'
            - '2'
            - '3'
          type: array
          items:
            type: string
        roleType:
          type: string
          description: 해당 주차장에서의 역할 타입 (선택사항)
          example: WORKER
      required:
        - adminIds
    RemoveAdminFromParkingLotDto:
      type: object
      properties:
        adminIds:
          description: 제거할 관리자 ID 목록
          example:
            - '1'
            - '2'
          type: array
          items:
            type: string
      required:
        - adminIds
    CreateResidentDto:
      type: object
      properties:
        name:
          type: string
          description: 거주자 이름
          example: 김철수
          maxLength: 50
        phone:
          type: string
          description: 전화번호
          example: 010-1234-5678
          maxLength: 20
        email:
          type: string
          description: 이메일
          example: kim@example.com
          maxLength: 100
        birth_date:
          type: string
          description: 생년월일
          example: '1990-01-01'
        gender:
          type: string
          description: 성별
          enum:
            - M
            - F
          example: M
        emergency_contact:
          type: string
          description: 비상연락처
          example: 010-9876-5432
          maxLength: 20
        memo:
          type: string
          description: 메모
          example: 주거주자
      required:
        - name
    UpdateResidentDto:
      type: object
      properties:
        name:
          type: string
          description: 거주자 이름
          example: 김철수
          maxLength: 50
        phone:
          type: string
          description: 전화번호
          example: 010-1234-5678
          maxLength: 20
        email:
          type: string
          description: 이메일
          example: kim@example.com
          maxLength: 100
        birth_date:
          type: string
          description: 생년월일
          example: '1990-01-01'
        gender:
          type: string
          description: 성별
          enum:
            - M
            - F
          example: M
        emergency_contact:
          type: string
          description: 비상연락처
          example: 010-9876-5432
          maxLength: 20
        memo:
          type: string
          description: 메모
          example: 주거주자
    CreateResidentHouseholdDto:
      type: object
      properties:
        resident_id:
          type: number
          description: 거주자 ID
          example: 1
        household_instance_id:
          type: number
          description: 세대 인스턴스 ID
          example: 1
        relationship:
          type: string
          description: 관계 유형
          enum:
            - HEAD
            - SPOUSE
            - CHILD
            - PARENT
            - MEMBER
            - TEMP
          example: HEAD
        memo:
          type: string
          description: 메모
          example: 세대주
      required:
        - resident_id
        - household_instance_id
        - relationship
    UpdateResidentHouseholdDto:
      type: object
      properties:
        relationship:
          type: string
          description: 관계 유형
          enum:
            - HEAD
            - SPOUSE
            - CHILD
            - PARENT
            - MEMBER
            - TEMP
          example: SPOUSE
        memo:
          type: string
          description: 메모
          example: 배우자
    CreateHouseholdDto:
      type: object
      properties:
        parkinglot_id:
          type: number
          description: 주차장 ID
          example: 1
        address_1depth:
          type: string
          description: '주소 1단계 (예: 시/도)'
          example: 경기도
        address_2depth:
          type: string
          description: '주소 2단계 (예: 시/군/구)'
          example: 성남시 분당구
        address_3depth:
          type: string
          description: 주소 3단계 (동/호수)
          example: 101동 101호
        household_type:
          type: string
          description: 세대 유형
          enum:
            - GENERAL
            - TEMP
            - COMMERCIAL
          example: RESIDENTIAL
        memo:
          type: string
          description: 메모
          example: 남향, 3층
      required:
        - parkinglot_id
        - address_3depth
        - household_type
    UpdateHouseholdDto:
      type: object
      properties:
        parkinglot_id:
          type: number
          description: 주차장 ID
          example: 1
        address_1depth:
          type: string
          description: '주소 1단계 (예: 시/도)'
          example: 경기도
        address_2depth:
          type: string
          description: '주소 2단계 (예: 시/군/구)'
          example: 성남시 분당구
        address_3depth:
          type: string
          description: 주소 3단계 (동/호수)
          example: 101동 101호
        household_type:
          type: string
          description: 세대 유형
          enum:
            - GENERAL
            - TEMP
            - COMMERCIAL
          example: RESIDENTIAL
        memo:
          type: string
          description: 메모
          example: 남향, 3층
    CreateHouseholdInstanceDto:
      type: object
      properties:
        household_id:
          type: number
          description: 세대 ID
          example: 1
        instance_name:
          type: string
          description: 인스턴스 이름 (가족명 등)
          example: 김씨가족
        password:
          type: string
          description: 세대 비밀번호 (4자리 숫자)
          example: '1234'
        start_date:
          type: string
          description: 입주 시작일
          example: '2024-01-01'
        end_date:
          type: string
          description: 입주 종료일
          example: '2025-12-31'
        memo:
          type: string
          description: 메모
          example: 2년 계약
      required:
        - household_id
    UpdateHouseholdInstanceDto:
      type: object
      properties:
        household_id:
          type: number
          description: 세대 ID
          example: 1
        instance_name:
          type: string
          description: 인스턴스 이름 (가족명 등)
          example: 김씨가족
        password:
          type: string
          description: 세대 비밀번호 (4자리 숫자)
          example: '1234'
        start_date:
          type: string
          description: 입주 시작일
          example: '2024-01-01'
        end_date:
          type: string
          description: 입주 종료일
          example: '2025-12-31'
        memo:
          type: string
          description: 메모
          example: 2년 계약
    CreateHouseholdServiceConfigDto:
      type: object
      properties:
        household_instance_id:
          type: number
          description: 세대 인스턴스 ID
          example: 1
        can_add_new_resident:
          type: boolean
          description: 신규 거주자 추가 가능 여부
          example: false
        is_common_entrance_subscribed:
          type: boolean
          description: 공동현관 구독 여부
          example: false
        is_temporary_access:
          type: boolean
          description: 임시 접근 허용 여부
          example: false
        temp_car_limit:
          type: number
          description: 임시 차량 제한 수
          example: 0
      required:
        - household_instance_id
    CreateHouseholdVisitConfigDto:
      type: object
      properties:
        household_instance_id:
          type: number
          description: 세대 인스턴스 ID
          example: 1
        available_visit_time:
          type: number
          description: 사용 가능한 방문 시간 (분)
          example: 0
        purchased_visit_time:
          type: number
          description: 구매한 방문 시간 (분)
          example: 0
        visit_request_limit:
          type: number
          description: 방문 요청 제한 수
          example: 0
      required:
        - household_instance_id