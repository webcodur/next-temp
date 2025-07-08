# View 폴더 페이지 마이그레이션 가이드

## 1. 작업 개요

- **실제 페이지 구현 위치**: `src/app/**` 에 있던 `page.tsx` 코드는 `src/view/**` 로 이동한다.
- **파일 네이밍 규칙**: `page.tsx` 금지. 의미 있는 컴포넌트명(`Home.tsx`, `FacilityInfoPage.tsx` 등)을 사용한다.
- **Bridge 패턴**: `src/app/**/page.tsx` 파일은 다음과 같이 간단히 View 페이지를 재-export 한다.

```tsx
'use client';
export { default } from '@/view/경로/ActualPageFile';
```

- **신규 페이지 작성**: 원본 `page.tsx` 가 존재하지 않을 경우, View 폴더에 새 페이지 컴포넌트를 만들고 `src/app` 에는 위와 같은 Bridge 파일만 추가한다.
- **절대경로 import**: `@/view/**` 경로가 그대로 동작하도록 `tsconfig.json` 의 `paths` 설정을 활용한다.
- **범위**: `lab` 디렉토리와 동적 [miltMenu] 등 실험용 페이지는 제외하고 실제 제품 페이지만 마이그레이션한다.

---

## 2. 메뉴 기반 페이지 리스트

아래 표는 `src/data/menuData.ts` 의 `href` 값을 기준으로 **마이그레이션 완료** 페이지와 **신규 필요** 페이지를 구분한 목록이다.

| 상태    | 타입         | 메뉴 경로 (href)                          | View 파일 예정명                      |
| ------- | ------------ | ----------------------------------------- | ------------------------------------- |
| ✅ 완료 | 마이그레이션 | `/`                                       | `Home.tsx`                            |
| ✅ 완료 | 마이그레이션 | `/login`                                  | `Login.tsx`                           |
| ✅ 완료 | 마이그레이션 | `/parking/facility/info`                  | `FacilityInfoPage.tsx`                |
| ✅ 완료 | 마이그레이션 | `/parking/facility/policy`                | `FacilityPolicyPage.tsx`              |
| ✅ 완료 | 마이그레이션 | `/parking/facility/staff`                 | `StaffListPage.tsx`                   |
| ✅ 완료 | 마이그레이션 | 404 (not-found)                           | `NotFound.tsx`                        |
| ✅ 완료 | 신규         | `/parking/users/entry-exit`               | `EntryExitPage.tsx`                   |
| ✅ 완료 | 신규         | `/parking/users/vehicle-registration`     | `VehicleRegistrationPage.tsx`         |
| ✅ 완료 | 신규         | `/parking/users/visitors`                 | `VisitorsPage.tsx`                    |
| ✅ 완료 | 신규         | `/parking/users/households`               | `HouseholdsPage.tsx`                  |
| ✅ 완료 | 신규         | `/parking/users/blacklist`                | `BlacklistPage.tsx`                   |
| ✅ 완료 | 신규         | `/parking/stores/status`                  | `StoreStatusPage.tsx`                 |
| ✅ 완료 | 신규         | `/parking/security/patrol-log`            | `PatrolLogPage.tsx`                   |
| ✅ 완료 | 신규         | `/parking/security/patrol-config`         | `PatrolConfigPage.tsx`                |
| ✅ 완료 | 신규         | `/parking/payment/discounts`              | `PaymentDiscountsPage.tsx`            |
| ✅ 완료 | 신규         | `/parking/payment/settlement`             | `PaymentSettlementPage.tsx`           |
| ✅ 완료 | 신규         | `/parking/payment/billing`                | `PaymentBillingPage.tsx`              |
| ✅ 완료 | 신규         | `/community/facilities/registration`      | `FacilityRegistrationPage.tsx`        |
| ✅ 완료 | 신규         | `/community/facilities/reservations`      | `FacilityReservationsPage.tsx`        |
| ✅ 완료 | 신규         | `/community/facilities/access`            | `FacilityAccessPage.tsx`              |
| ✅ 완료 | 신규         | `/community/facilities/settlement`        | `FacilitySettlementPage.tsx`          |
| ✅ 완료 | 신규         | `/community/communication/board`          | `OneToOneBoardPage.tsx`               |
| ✅ 완료 | 신규         | `/community/communication/suggestions`    | `SuggestionBoxPage.tsx`               |
| ✅ 완료 | 신규         | `/community/services/maintenance-fee`     | `MaintenanceFeePage.tsx`              |
| ✅ 완료 | 신규         | `/community/services/voting`              | `VotingPage.tsx`                      |
| ✅ 완료 | 신규         | `/community/services/delivery`            | `DeliveryManagementPage.tsx`          |
| ✅ 완료 | 신규         | `/announcement/notices/general`           | `GeneralNoticesPage.tsx`              |
| ✅ 완료 | 신규         | `/announcement/notices/emergency`         | `EmergencyNoticesPage.tsx`            |
| ✅ 완료 | 신규         | `/announcement/notices/event`             | `EventNoticesPage.tsx`                |
| ✅ 완료 | 신규         | `/announcement/push/send`                 | `PushSendPage.tsx`                    |
| ✅ 완료 | 신규         | `/announcement/push/history`              | `PushHistoryPage.tsx`                 |
| ✅ 완료 | 신규         | `/announcement/push/template`             | `PushTemplatePage.tsx`                |
| ✅ 완료 | 신규         | `/account/management/users`               | `AccountUsersPage.tsx`                |
| ✅ 완료 | 신규         | `/account/management/roles`               | `AccountRolesPage.tsx`                |
| ✅ 완료 | 신규         | `/account/management/groups`              | `AccountGroupsPage.tsx`               |
| ✅ 완료 | 신규         | `/account/security/password-policy`       | `PasswordPolicyPage.tsx`              |
| ✅ 완료 | 신규         | `/account/security/login-history`         | `LoginHistoryPage.tsx`                |
| ✅ 완료 | 신규         | `/account/security/session`               | `SessionManagementPage.tsx`           |
| ✅ 완료 | 신규         | `/settings/system/general`                | `SystemGeneralPage.tsx`               |
| ✅ 완료 | 신규         | `/settings/system/database`               | `SystemDatabasePage.tsx`              |
| ✅ 완료 | 신규         | `/settings/system/backup`                 | `SystemBackupPage.tsx`                |
| ✅ 완료 | 신규         | `/settings/system/logs`                   | `SystemLogsPage.tsx`                  |
| ✅ 완료 | 신규         | `/settings/preferences/theme`             | `PreferencesThemePage.tsx`            |
| ✅ 완료 | 신규         | `/settings/preferences/language`          | `PreferencesLanguagePage.tsx`         |
| ✅ 완료 | 신규         | `/settings/preferences/notifications`     | `PreferencesNotificationsPage.tsx`    |
| ✅ 완료 | 신규         | `/settings/integration/api`               | `IntegrationApiPage.tsx`              |
| ✅ 완료 | 신규         | `/settings/integration/webhooks`          | `IntegrationWebhooksPage.tsx`         |
| ✅ 완료 | 신규         | `/settings/integration/external-services` | `IntegrationExternalServicesPage.tsx` |

> ℹ️ `lab/**` 이하의 경로는 실험용이므로 마이그레이션 대상에서 제외한다.

---

## 3. 작업 완료 현황

✅ **전체 마이그레이션 완료 (48개 페이지)**

- **기존 마이그레이션**: 6개 페이지 완료
- **신규 페이지 생성**: 42개 페이지 완료
- **브릿지 파일**: 모든 페이지에 대한 `src/app/**/page.tsx` 브릿지 파일 생성 완료

### 카테고리별 현황

1. **주차 관리** (17개) ✅

   - 시설관리: 3개, 이용자관리: 5개, 상가관리: 1개, 보안순찰: 2개, 결제정산: 3개, 기존 3개

2. **커뮤니티** (9개) ✅

   - 시설서비스: 4개, 소통관리: 2개, 생활서비스: 3개

3. **공지사항** (6개) ✅

   - 공지관리: 3개, 푸시알림: 3개

4. **계정 관리** (6개) ✅

   - 계정관리: 3개, 보안설정: 3개

5. **시스템 설정** (10개) ✅
   - 시스템설정: 4개, 개인설정: 3개, 연동설정: 3개

---
