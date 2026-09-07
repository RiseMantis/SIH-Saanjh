import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate } from
'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { AppShell } from './components/shell/AppShell';
import { ArtisanLayout } from './components/layout/ArtisanLayout';
import { BuyerLayout } from './components/layout/BuyerLayout';
import { RoleSelect } from './pages/RoleSelect';
import { LanguageSelect } from './pages/LanguageSelect';
import { ArtisanSignup } from './pages/artisan/ArtisanSignup';
import { ArtisanHome } from './pages/artisan/ArtisanHome';
import { AddProduct } from './pages/artisan/AddProduct';
import { ArtisanOrders } from './pages/artisan/ArtisanOrders';
import { ArtisanOrderDetail } from './pages/artisan/ArtisanOrderDetail';
import { ArtisanAccount } from './pages/artisan/ArtisanAccount';
import { NotificationDetail } from './pages/artisan/NotificationDetail';
import { BuyerSignup } from './pages/buyer/BuyerSignup';
import { Discover } from './pages/buyer/Discover';
import { SearchScreen } from './pages/buyer/SearchScreen';
import { ProductDetail } from './pages/buyer/ProductDetail';
import { ArtisanProfile } from './pages/buyer/ArtisanProfile';
import { PostRequest } from './pages/buyer/PostRequest';
import { BuyerOrders } from './pages/buyer/BuyerOrders';
import { BuyerOrderDetail } from './pages/buyer/BuyerOrderDetail';
import { BuyerAccount } from './pages/buyer/BuyerAccount';
import { ComponentLibrary } from './pages/docs/ComponentLibrary';
import { VoiceFlow } from './pages/docs/VoiceFlow';
import { AuditLogView } from './pages/admin/AuditLogView';

type EntryScreen = 'onboarding' | 'artisanHome' | 'buyerDiscover';

const entryPaths: Record<EntryScreen, string> = {
  onboarding: '/',
  artisanHome: '/artisan/home',
  buyerDiscover: '/buyer/discover'
};

function EntryRedirect({ entryScreen }: {entryScreen: EntryScreen;}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === '/' && entryScreen !== 'onboarding') {
      navigate(entryPaths[entryScreen], { replace: true });
    }
    // Only on first mount: never fight the user's own navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

interface AppProps {
  entryScreen?: EntryScreen;
  showAnnotations?: boolean;
}

export function App({
  entryScreen = 'onboarding',
  showAnnotations = true
}: AppProps) {
  return (
    <AppProvider>
      <BrowserRouter>
        <EntryRedirect entryScreen={entryScreen} />
        <Routes>
          <Route element={<AppShell showAnnotations={showAnnotations} />}>
            <Route path="/" element={<RoleSelect />} />
            <Route path="/language" element={<LanguageSelect />} />
            <Route path="/artisan/signup" element={<ArtisanSignup />} />
            <Route path="/buyer/signup" element={<BuyerSignup />} />

            <Route path="/artisan" element={<ArtisanLayout />}>
              <Route index element={<Navigate to="/artisan/home" replace />} />
              <Route path="home" element={<ArtisanHome />} />
              <Route path="add" element={<AddProduct />} />
              <Route path="orders" element={<ArtisanOrders />} />
              <Route path="orders/:orderId" element={<ArtisanOrderDetail />} />
              <Route path="account" element={<ArtisanAccount />} />
              <Route
                path="notification/:notificationId"
                element={<NotificationDetail />} />
              
            </Route>

            <Route path="/buyer" element={<BuyerLayout />}>
              <Route index element={<Navigate to="/buyer/discover" replace />} />
              <Route path="discover" element={<Discover />} />
              <Route path="search" element={<SearchScreen />} />
              <Route path="product/:productId" element={<ProductDetail />} />
              <Route path="artisan/:artisanId" element={<ArtisanProfile />} />
              <Route path="request" element={<PostRequest />} />
              <Route path="orders" element={<BuyerOrders />} />
              <Route path="orders/:orderId" element={<BuyerOrderDetail />} />
              <Route path="account" element={<BuyerAccount />} />
            </Route>
          </Route>

          <Route path="/library" element={<ComponentLibrary />} />
          <Route path="/voice-flow" element={<VoiceFlow />} />
          <Route path="/admin/audit-log" element={<AuditLogView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>);

}