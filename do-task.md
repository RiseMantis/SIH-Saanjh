# UI Revamp — Task Tracker

## Phase 1: Core Shell & Infrastructure
- [x] Modify `AppShell.tsx` — strip device frame, remove ScreenRail/AnnotationPanel imports
- [x] Delete `ScreenRail.tsx`
- [x] Delete `AnnotationPanel.tsx`
- [x] Create `useMediaQuery.ts` hook
- [x] Modify `App.tsx` — remove showAnnotations plumbing
- [x] Modify `index.css` — cleanup body background

## Phase 2: Navigation
- [x] Create `ArtisanTopNav.tsx` — desktop horizontal nav
- [x] Create `BuyerTopNav.tsx` — desktop horizontal nav
- [x] Modify `ArtisanTabBar.tsx` — add `lg:hidden`
- [x] Modify `BuyerTabBar.tsx` — add `lg:hidden`
- [x] Modify `ArtisanLayout.tsx` — integrate top nav + tab bar switching
- [x] Modify `BuyerLayout.tsx` — integrate top nav + tab bar switching

## Phase 3: Page Responsive Updates
- [/] `RoleSelect.tsx` — side-by-side cards on desktop
- [/] `ArtisanHome.tsx` — multi-column summary cards
- [/] `Discover.tsx` — product grid layout
- [ ] `SearchScreen.tsx` — results grid
- [ ] `AddProduct.tsx` — centered wizard
- [ ] `ArtisanOrders.tsx` — 2-column order cards
- [ ] `BuyerOrders.tsx` — 2-column order cards
- [ ] `ArtisanAccount.tsx` — centered 2-col settings
- [ ] `BuyerAccount.tsx` — centered 2-col settings
- [ ] `ProductDetail.tsx` — 2-col image+details
- [ ] `ArtisanOrderDetail.tsx` — centered content
- [ ] `BuyerOrderDetail.tsx` — centered content
- [ ] `ArtisanSignup.tsx` — centered form
- [ ] `BuyerSignup.tsx` — centered form
- [ ] `PostRequest.tsx` — centered form
- [ ] `ArtisanProfile.tsx` — centered content
- [ ] `NotificationDetail.tsx` — centered content
- [x] `FloatingAssistant.tsx` — responsive positioning

## Phase 4: Verification
- [ ] `npm run build` passes
- [ ] Visual check: mobile layout
- [ ] Visual check: desktop layout
