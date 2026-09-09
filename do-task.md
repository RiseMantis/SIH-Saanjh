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
- [x] `RoleSelect.tsx` — side-by-side cards on desktop
- [x] `ArtisanHome.tsx` — multi-column summary cards
- [x] `Discover.tsx` — product grid layout
- [x] `SearchScreen.tsx` — results grid
- [x] `AddProduct.tsx` — centered wizard
- [x] `ArtisanOrders.tsx` — 2-column order cards
- [x] `BuyerOrders.tsx` — 2-column order cards
- [x] `ArtisanAccount.tsx` — centered 2-col settings
- [x] `BuyerAccount.tsx` — centered 2-col settings
- [x] `ProductDetail.tsx` — 2-col image+details
- [x] `ArtisanOrderDetail.tsx` — centered content
- [x] `BuyerOrderDetail.tsx` — centered content
- [x] `ArtisanSignup.tsx` — centered form
- [x] `BuyerSignup.tsx` — centered form
- [x] `PostRequest.tsx` — centered form
- [x] `ArtisanProfile.tsx` — centered content
- [x] `NotificationDetail.tsx` — centered content
- [x] `FloatingAssistant.tsx` — responsive positioning

## Phase 4: Verification
- [x] `npm run build` passes
- [x] Visual check: mobile layout
- [x] Visual check: desktop layout
