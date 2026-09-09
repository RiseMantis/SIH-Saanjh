import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { CameraIcon, HomeIcon, PackageIcon, UserIcon } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

/**
 * Horizontal top navigation bar for artisan mode on desktop (≥ 1024px).
 * Hidden on mobile — the bottom ArtisanTabBar handles navigation there.
 */
export function ArtisanTopNav() {
  const { t } = useApp();
  const navLinks = [
    { to: '/artisan/home', label: t('navHome'), Icon: HomeIcon },
    { to: '/artisan/orders', label: t('myOrders'), Icon: PackageIcon },
    { to: '/artisan/account', label: t('navAccount'), Icon: UserIcon },
  ];

  return (
    <nav
      aria-label="Main"
      className="hidden lg:flex shrink-0 items-center justify-between border-b border-sand-300 bg-white/80 backdrop-blur px-8 py-0"
    >
      {/* Brand */}
      <Link to="/artisan/home" className="flex items-center gap-2.5 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-clay-500 text-white">
          <HomeIcon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="text-lg font-bold text-ink-900">Saanjh</span>
      </Link>

      {/* Nav links */}
      <ul className="flex items-center gap-1">
        {navLinks.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-150 ease-out ' +
                (isActive
                  ? 'bg-clay-50 text-clay-700'
                  : 'text-ink-600 hover:bg-sand-200 hover:text-ink-900')
              }
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}

        {/* Add Product CTA */}
        <li className="ml-2">
          <NavLink
            to="/artisan/add"
            className={({ isActive }) =>
              'flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-card transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-300 ' +
              (isActive ? 'bg-clay-600' : 'bg-clay-500 hover:bg-clay-600')
            }
          >
            <CameraIcon className="h-4 w-4" aria-hidden="true" />
            {t('addProduct')}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
