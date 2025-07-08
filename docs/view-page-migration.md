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

| 상태 | 타입 | 메뉴 경로 (href) | View 파일 예정명 |
|------|------|-----------------|-------------------|
| ✅ 완료 | 마이그레이션 | `/` | `Home.tsx` |
| ✅ 완료 | 마이그레이션 | `/login` | `Login.tsx` |
| ✅ 완료 | 마이그레이션 | `/parking/facility/info` | `FacilityInfoPage.tsx` |
| ✅ 완료 | 마이그레이션 | `/parking/facility/policy` | `FacilityPolicyPage.tsx` |
| ✅ 완료 | 마이그레이션 | `/parking/facility/staff` | `StaffListPage.tsx` |
| ✅ 완료 | 마이그레이션 | 404 (not-found) | `NotFound.tsx` |
| 🚧 미완료 | 신규 | `/parking/users/entry-exit` | `EntryExitPage.tsx` |
| 🚧 미완료 | 신규 | `/parking/users/vehicle-registration` | `VehicleRegistrationPage.tsx` |
| 🚧 미완료 | 신규 | `/parking/users/visitors` | `VisitorsPage.tsx` |
| 🚧 미완료 | 신규 | `/parking/users/households` | `HouseholdsPage.tsx` |
| 🚧 미완료 | 신규 | `/parking/users/blacklist` | `BlacklistPage.tsx` |
| 🚧 미완료 | 신규 | `/parking/stores/status` | `StoreStatusPage.tsx` |
| 🚧 미완료 | 신규 | `/parking/security/patrol-log` | `PatrolLogPage.tsx` |
| 🚧 미완료 | 신규 | `/parking/security/patrol-config` | `PatrolConfigPage.tsx` |
| 🚧 미완료 | 신규 | `/parking/payment/discounts` | `PaymentDiscountsPage.tsx` |
| 🚧 미완료 | 신규 | `/parking/payment/settlement` | `PaymentSettlementPage.tsx` |
| 🚧 미완료 | 신규 | `/parking/payment/billing` | `PaymentBillingPage.tsx` |
| 🚧 미완료 | 신규 | `/community/facilities/registration` | `FacilityRegistrationPage.tsx` |
| 🚧 미완료 | 신규 | `/community/facilities/reservations` | `FacilityReservationsPage.tsx` |
| 🚧 미완료 | 신규 | `/community/facilities/access` | `FacilityAccessPage.tsx` |
| 🚧 미완료 | 신규 | `/community/facilities/settlement` | `FacilitySettlementPage.tsx` |
| 🚧 미완료 | 신규 | `/community/communication/board` | `OneToOneBoardPage.tsx` |
| 🚧 미완료 | 신규 | `/community/communication/suggestions` | `SuggestionBoxPage.tsx` |
| 🚧 미완료 | 신규 | `/community/services/maintenance-fee` | `MaintenanceFeePage.tsx` |
| 🚧 미완료 | 신규 | `/community/services/voting` | `VotingPage.tsx` |
| 🚧 미완료 | 신규 | `/community/services/delivery` | `DeliveryManagementPage.tsx` |
| 🚧 미완료 | 신규 | `/announcement/notices/general` | `GeneralNoticesPage.tsx` |
| 🚧 미완료 | 신규 | `/announcement/notices/emergency` | `EmergencyNoticesPage.tsx` |
| 🚧 미완료 | 신규 | `/announcement/notices/event` | `EventNoticesPage.tsx` |
| 🚧 미완료 | 신규 | `/announcement/push/send` | `PushSendPage.tsx` |
| 🚧 미완료 | 신규 | `/announcement/push/history` | `PushHistoryPage.tsx` |
| 🚧 미완료 | 신규 | `/announcement/push/template` | `PushTemplatePage.tsx` |
| 🚧 미완료 | 신규 | `/account/management/users` | `AccountUsersPage.tsx` |
| 🚧 미완료 | 신규 | `/account/management/roles` | `AccountRolesPage.tsx` |
| 🚧 미완료 | 신규 | `/account/management/groups` | `AccountGroupsPage.tsx` |
| 🚧 미완료 | 신규 | `/account/security/password-policy` | `PasswordPolicyPage.tsx` |
| 🚧 미완료 | 신규 | `/account/security/login-history` | `LoginHistoryPage.tsx` |
| 🚧 미완료 | 신규 | `/account/security/session` | `SessionManagementPage.tsx` |
| 🚧 미완료 | 신규 | `/settings/system/general` | `SystemGeneralPage.tsx` |
| 🚧 미완료 | 신규 | `/settings/system/database` | `SystemDatabasePage.tsx` |
| 🚧 미완료 | 신규 | `/settings/system/backup` | `SystemBackupPage.tsx` |
| 🚧 미완료 | 신규 | `/settings/system/logs` | `SystemLogsPage.tsx` |
| 🚧 미완료 | 신규 | `/settings/preferences/theme` | `PreferencesThemePage.tsx` |
| 🚧 미완료 | 신규 | `/settings/preferences/language` | `PreferencesLanguagePage.tsx` |
| 🚧 미완료 | 신규 | `/settings/preferences/notifications` | `PreferencesNotificationsPage.tsx` |
| 🚧 미완료 | 신규 | `/settings/integration/api` | `IntegrationApiPage.tsx` |
| 🚧 미완료 | 신규 | `/settings/integration/webhooks` | `IntegrationWebhooksPage.tsx` |
| 🚧 미완료 | 신규 | `/settings/integration/external-services` | `IntegrationExternalServicesPage.tsx` |

> ℹ️ `lab/**` 이하의 경로는 실험용이므로 마이그레이션 대상에서 제외한다.

---

## 3. 다음 단계 제안

1. 위 **미완료** 목록을 순서대로 작업한다. 규모가 큰 경우 상위 카테고리별로 PR 을 나눠도 된다.
2. 새 View 파일을 만든 뒤 기존 `src/app` 브릿지 파일을 추가한다.
3. 페이지가 기능적으로 복잡하면 Storybook 또는 간단한 Mock 데이터를 추가하여 독립 테스트를 권장한다.
4. 모든 새 페이지가 최소 `neu-flat` 컨테이너를 사용하고 *색상 시스템* 가이드를 준수하는지 확인한다.

---
