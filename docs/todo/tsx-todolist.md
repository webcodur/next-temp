# TSX 파일 가시성 개선 작업 목록

이 문서는 `.cursor/rules/tsx.mdc` 가이드라인을 프로젝트 내 모든 `.tsx` 파일에 적용하기 위한 작업 목록입니다.

## 작업 절차

각 파일에 대해 아래 3가지 작업을 순서대로 수행합니다.

1.  **파일 헤더 주석 추가**: 파일 최상단에 파일 경로, 핵심 기능, 단일 책임을 기술합니다.
2.  **Import 정렬**: 규칙에 따라 `import` 문의 순서를 정렬합니다.
3.  **코드 구조화**: 컴포넌트 내부 로직을 `#region`과 `#endregion`으로 그룹화합니다. (타입 → 상수 → 상태 → 훅 → 핸들러 → 렌더링 순서)

---

## 대상 파일 목록

- [ ] `src/app/[topMenu]/[midMenu]/[botMenu]/page.tsx`
- [ ] `src/app/lab/system-testing/field-datepicker/page.tsx`
- [ ] `src/app/lab/system-testing/font-test/page.tsx`
- [ ] `src/app/lab/system-testing/i18n-test/page.tsx`
- [ ] `src/app/lab/system-testing/license-plate/page.tsx`
- [ ] `src/app/lab/system-testing/rtl-demo/page.tsx`
- [ ] `src/app/lab/system-testing/theme-test/page.tsx`
- [ ] `src/app/lab/ui-3d/barrier-3d/page.tsx`
- [ ] `src/app/lab/ui-3d/threejs-advanced/page.tsx`
- [ ] `src/app/lab/ui-3d/threejs-animations/page.tsx`
- [ ] `src/app/lab/ui-3d/threejs-basics/page.tsx`
- [ ] `src/app/lab/ui-3d/threejs-geometries/page.tsx`
- [ ] `src/app/lab/ui-3d/threejs-interactions/page.tsx`
- [ ] `src/app/lab/ui-3d/threejs-materials-lights/page.tsx`
- [ ] `src/app/lab/ui-data/infinite-scroll/page.tsx`
- [ ] `src/app/lab/ui-data/list-highlight-marker/page.tsx`
- [ ] `src/app/lab/ui-data/pagination/page.tsx`
- [ ] `src/app/lab/ui-data/table/page.tsx`
- [ ] `src/app/lab/ui-data/timeline/page.tsx`
- [ ] `src/app/lab/ui-effects/avatar/page.tsx`
- [ ] `src/app/lab/ui-effects/badge/page.tsx`
- [ ] `src/app/lab/ui-effects/button/page.tsx`
- [ ] `src/app/lab/ui-effects/drag-and-drop/page.tsx`
- [ ] `src/app/lab/ui-effects/flip-text/page.tsx`
- [ ] `src/app/lab/ui-effects/morphing-text/page.tsx`
- [ ] `src/app/lab/ui-effects/toast/page.tsx`
- [ ] `src/app/lab/ui-effects/tooltip/page.tsx`
- [ ] `src/app/lab/ui-input/datepicker/page.tsx`
- [ ] `src/app/lab/ui-input/editor/page.tsx`
- [ ] `src/app/lab/ui-input/field/page.tsx`
- [ ] `src/app/lab/ui-input/simple-input/page.tsx`
- [ ] `src/app/lab/ui-layout/accordion/page.tsx`
- [ ] `src/app/lab/ui-layout/container/page.tsx`
- [ ] `src/app/lab/ui-layout/dialog/page.tsx`
- [ ] `src/app/lab/ui-layout/modal/page.tsx`
- [ ] `src/app/lab/ui-layout/nested-tabs/page.tsx`
- [ ] `src/app/lab/ui-layout/stepper/page.tsx`
- [ ] `src/app/lab/ui-layout/tabs/page.tsx`
- [ ] `src/app/layout.tsx`
- [ ] `src/app/login/layout.tsx`
- [ ] `src/app/login/page.tsx`
- [ ] `src/app/not-found.tsx`
- [ ] `src/app/page.tsx`
- [ ] `src/components/layout/footer/Footer.tsx`
- [ ] `src/components/layout/header/Breadcrumb.tsx`
- [ ] `src/components/layout/header/Header.tsx`
- [ ] `src/components/layout/header/PrimaryColorPicker.tsx`
- [ ] `src/components/layout/header/ProfileButton.tsx`
- [ ] `src/components/layout/header/SettingsButton.tsx`
- [ ] `src/components/layout/login/LoginForm.tsx`
- [ ] `src/components/layout/main-layout.tsx`
- [ ] `src/components/layout/sidebar/Sidebar.tsx`
- [ ] `src/components/layout/sidebar/unit/control/SideResizeControl.tsx`
- [ ] `src/components/layout/sidebar/unit/control/SideToggleControl.tsx`
- [ ] `src/components/layout/sidebar/unit/header/searchModal/panelForMenu/MenuRecentList.tsx`
- [ ] `src/components/layout/sidebar/unit/header/searchModal/panelForMenu/MenuSearchInput.tsx`
- [ ] `src/components/layout/sidebar/unit/header/searchModal/panelForMenu/MenuSearchResults.tsx`
- [ ] `src/components/layout/sidebar/unit/header/searchModal/panelForMenu/PanelForMenu.tsx`
- [ ] `src/components/layout/sidebar/unit/header/searchModal/panelForSite/PanelForSite.tsx`
- [ ] `src/components/layout/sidebar/unit/header/searchModal/panelForSite/SiteRecentList.tsx`
- [ ] `src/components/layout/sidebar/unit/header/searchModal/panelForSite/SiteSearchInput.tsx`
- [ ] `src/components/layout/sidebar/unit/header/searchModal/panelForSite/SiteSearchResults.tsx`
- [ ] `src/components/layout/sidebar/unit/header/searchModal/SearchModal.tsx`
- [ ] `src/components/layout/sidebar/unit/header/SideHeader.tsx`
- [ ] `src/components/layout/sidebar/unit/panel/SideEndPanel.tsx`
